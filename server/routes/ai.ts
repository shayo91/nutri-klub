import { Router } from "express";
import { AIService } from "../services/aiService";
import { authenticate } from "../middleware/auth";
import { db } from "../db";
import { aiChatHistory, usageTracking, users, userPreferences } from "@shared/schema-sqlite";
import { eq, and, desc, sql } from "drizzle-orm";
import { z } from "zod";

const router = Router();

// Validation schemas
const chatMessageSchema = z.object({
  message: z.string().min(1, "Message is required").max(1000, "Message too long"),
});

const mealPlanSchema = z.object({
  days: z.number().min(1).max(7),
});

/**
 * POST /api/ai/chat - Send message to AI
 */
router.post("/chat", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { message } = chatMessageSchema.parse(req.body);
    const isPremium = req.user.role === "premium" || req.user.role === "admin";

    // Check usage limit for free users
    if (!isPremium) {
      const [usage] = await db
        .select()
        .from(usageTracking)
        .where(
          and(
            eq(usageTracking.userId, req.user.userId),
            eq(usageTracking.feature, "ai_message")
          )
        )
        .limit(1);

      const messageCount = usage?.count || 0;

      if (messageCount >= 2) {
        return res.status(403).json({
          error: "AI message limit reached",
          message: "You've reached your free trial limit of 2 AI messages. Upgrade to Premium for unlimited access!",
          upgradeUrl: "/dashboard/upgrade",
          remainingMessages: 0,
        });
      }
    }

    // Get user context for personalization (Premium only)
    let userContext = undefined;
    let chatHistory: any[] = [];

    if (isPremium) {
      // Get user info
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, req.user.userId))
        .limit(1);

      // Get user preferences
      const [prefs] = await db
        .select()
        .from(userPreferences)
        .where(eq(userPreferences.userId, req.user.userId))
        .limit(1);

      if (user && prefs) {
        userContext = {
          firstName: user.firstName || undefined,
          goal: prefs.goal || undefined,
          currentWeight: prefs.currentWeight || undefined,
          targetWeight: prefs.targetWeight || undefined,
          height: prefs.height || undefined,
          age: prefs.age || undefined,
          gender: prefs.gender || undefined,
          activityLevel: prefs.activityLevel || undefined,
          allergies: prefs.allergies ? JSON.parse(prefs.allergies as any) : [],
          dietaryRestrictions: prefs.dietaryRestrictions ? JSON.parse(prefs.dietaryRestrictions as any) : [],
          dislikedFoods: prefs.dislikedFoods ? JSON.parse(prefs.dislikedFoods as any) : [],
        };
      }

      // Get recent chat history (last 5 messages)
      const history = await db
        .select()
        .from(aiChatHistory)
        .where(eq(aiChatHistory.userId, req.user.userId))
        .orderBy(desc(aiChatHistory.createdAt))
        .limit(5);

      chatHistory = history.reverse().flatMap((h) => [
        { role: "user", content: h.message },
        { role: "assistant", content: h.response },
      ]);
    }

    // Get AI response
    const response = await AIService.chat(message, chatHistory, userContext, isPremium);

    // Save to chat history
    await db.insert(aiChatHistory).values({
      userId: req.user.userId,
      message,
      response,
      context: userContext ? JSON.stringify(userContext) : null,
    });

    // Track usage for free users
    if (!isPremium) {
      const [existing] = await db
        .select()
        .from(usageTracking)
        .where(
          and(
            eq(usageTracking.userId, req.user.userId),
            eq(usageTracking.feature, "ai_message")
          )
        )
        .limit(1);

      if (existing) {
        await db
          .update(usageTracking)
          .set({ count: sql`${usageTracking.count} + 1` })
          .where(eq(usageTracking.id, existing.id));
      } else {
        await db.insert(usageTracking).values({
          userId: req.user.userId,
          feature: "ai_message",
          count: 1,
          resetDate: new Date().toISOString(),
        });
      }

      // Get updated count
      const [updatedUsage] = await db
        .select()
        .from(usageTracking)
        .where(
          and(
            eq(usageTracking.userId, req.user.userId),
            eq(usageTracking.feature, "ai_message")
          )
        )
        .limit(1);

      const remainingMessages = 2 - (updatedUsage?.count || 0);

      return res.json({
        message: response,
        remainingMessages,
        isFree: true,
      });
    }

    res.json({
      message: response,
      isPremium: true,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error("AI chat error:", error);
    res.status(500).json({ error: "Failed to process message" });
  }
});

/**
 * GET /api/ai/history - Get chat history (Premium only)
 */
router.get("/history", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const isPremium = req.user.role === "premium" || req.user.role === "admin";

    if (!isPremium) {
      return res.status(403).json({
        error: "Premium feature",
        message: "Chat history is only available for Premium members.",
      });
    }

    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;

    const history = await db
      .select()
      .from(aiChatHistory)
      .where(eq(aiChatHistory.userId, req.user.userId))
      .orderBy(desc(aiChatHistory.createdAt))
      .limit(limit)
      .offset(offset);

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(aiChatHistory)
      .where(eq(aiChatHistory.userId, req.user.userId));

    res.json({
      history: history.reverse(),
      total: Number(countResult?.count || 0),
    });
  } catch (error) {
    console.error("Get history error:", error);
    res.status(500).json({ error: "Failed to get chat history" });
  }
});

/**
 * DELETE /api/ai/history - Clear chat history (Premium only)
 */
router.delete("/history", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const isPremium = req.user.role === "premium" || req.user.role === "admin";

    if (!isPremium) {
      return res.status(403).json({
        error: "Premium feature",
        message: "This feature is only available for Premium members.",
      });
    }

    await db
      .delete(aiChatHistory)
      .where(eq(aiChatHistory.userId, req.user.userId));

    res.json({ message: "Chat history cleared successfully" });
  } catch (error) {
    console.error("Clear history error:", error);
    res.status(500).json({ error: "Failed to clear chat history" });
  }
});

/**
 * POST /api/ai/generate-meal-plan - Generate AI meal plan (Premium only)
 */
router.post("/generate-meal-plan", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const isPremium = req.user.role === "premium" || req.user.role === "admin";

    if (!isPremium) {
      return res.status(403).json({
        error: "Premium feature",
        message: "AI meal plan generation is only available for Premium members.",
        upgradeUrl: "/dashboard/upgrade",
      });
    }

    const { days } = mealPlanSchema.parse(req.body);

    // Get user context
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user.userId))
      .limit(1);

    const [prefs] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, req.user.userId))
      .limit(1);

    if (!user || !prefs) {
      return res.status(400).json({
        error: "Profile incomplete",
        message: "Please complete your profile and preferences first.",
      });
    }

    const userContext = {
      firstName: user.firstName || undefined,
      goal: prefs.goal || undefined,
      currentWeight: prefs.currentWeight || undefined,
      targetWeight: prefs.targetWeight || undefined,
      height: prefs.height || undefined,
      age: prefs.age || undefined,
      gender: prefs.gender || undefined,
      activityLevel: prefs.activityLevel || undefined,
      allergies: prefs.allergies ? JSON.parse(prefs.allergies as any) : [],
      dietaryRestrictions: prefs.dietaryRestrictions ? JSON.parse(prefs.dietaryRestrictions as any) : [],
      dislikedFoods: prefs.dislikedFoods ? JSON.parse(prefs.dislikedFoods as any) : [],
    };

    const mealPlan = await AIService.generateMealPlan(days, userContext);

    res.json({
      mealPlan,
      days,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error("Generate meal plan error:", error);
    res.status(500).json({ error: "Failed to generate meal plan" });
  }
});

/**
 * GET /api/ai/suggestions - Get quick suggestions
 */
router.get("/suggestions", async (req, res) => {
  try {
    const suggestions = AIService.getQuickSuggestions();
    res.json({ suggestions });
  } catch (error) {
    console.error("Get suggestions error:", error);
    res.status(500).json({ error: "Failed to get suggestions" });
  }
});

/**
 * GET /api/ai/usage - Get AI usage stats
 */
router.get("/usage", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const isPremium = req.user.role === "premium" || req.user.role === "admin";

    if (isPremium) {
      // Premium users have unlimited access
      return res.json({
        isPremium: true,
        unlimited: true,
        messagesUsed: 0,
        messagesLimit: null,
        remainingMessages: null,
      });
    }

    // Free users - check usage
    const [usage] = await db
      .select()
      .from(usageTracking)
      .where(
        and(
          eq(usageTracking.userId, req.user.userId),
          eq(usageTracking.feature, "ai_message")
        )
      )
      .limit(1);

    const messagesUsed = usage?.count || 0;
    const messagesLimit = 2;
    const remainingMessages = Math.max(0, messagesLimit - messagesUsed);

    res.json({
      isPremium: false,
      unlimited: false,
      messagesUsed,
      messagesLimit,
      remainingMessages,
    });
  } catch (error) {
    console.error("Get usage error:", error);
    res.status(500).json({ error: "Failed to get usage stats" });
  }
});

export default router;
