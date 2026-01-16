import { Router } from "express";
import { db } from "../db";
import { users, userPreferences } from "@shared/schema-sqlite";
import { eq } from "drizzle-orm";
import { authenticate } from "../middleware/auth";
import { z } from "zod";

const router = Router();

// Validation schema
const preferencesSchema = z.object({
  goal: z.enum(["lose_weight", "gain_muscle", "maintain", "health"]).optional(),
  targetWeight: z.string().optional(),
  currentWeight: z.string().optional(),
  height: z.string().optional(),
  age: z.number().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "very_active"]).optional(),
  allergies: z.array(z.string()).optional(),
  dietaryRestrictions: z.array(z.string()).optional(),
  dislikedFoods: z.array(z.string()).optional(),
  mealPreferences: z.array(z.string()).optional(),
});

/**
 * GET /api/onboarding/status - Check if onboarding is completed
 */
router.get("/status", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user.userId))
      .limit(1);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      onboardingCompleted: user.onboardingCompleted || false,
    });
  } catch (error) {
    console.error("Get onboarding status error:", error);
    res.status(500).json({ error: "Failed to get onboarding status" });
  }
});

/**
 * GET /api/onboarding/preferences - Get user preferences
 */
router.get("/preferences", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const [preferences] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, req.user.userId))
      .limit(1);

    if (!preferences) {
      return res.status(404).json({ error: "Preferences not found" });
    }

    // Parse JSON fields (stored as text in SQLite)
    const parsedPreferences = {
      ...preferences,
      allergies: preferences.allergies ? JSON.parse(preferences.allergies) : [],
      dietaryRestrictions: preferences.dietaryRestrictions ? JSON.parse(preferences.dietaryRestrictions) : [],
      dislikedFoods: preferences.dislikedFoods ? JSON.parse(preferences.dislikedFoods) : [],
      mealPreferences: preferences.mealPreferences ? JSON.parse(preferences.mealPreferences) : [],
    };

    res.json(parsedPreferences);
  } catch (error) {
    console.error("Get preferences error:", error);
    res.status(500).json({ error: "Failed to get preferences" });
  }
});

/**
 * POST /api/onboarding/preferences - Save user preferences
 */
router.post("/preferences", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const validatedData = preferencesSchema.parse(req.body);

    // Check if preferences exist
    const [existingPreferences] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, req.user.userId))
      .limit(1);

    // Prepare update data (convert arrays to JSON strings for SQLite)
    const updateData: any = {
      ...validatedData,
      updatedAt: new Date().toISOString(),
    };

    // Convert arrays to JSON strings for SQLite
    if (validatedData.allergies) {
      updateData.allergies = JSON.stringify(validatedData.allergies);
    }
    if (validatedData.dietaryRestrictions) {
      updateData.dietaryRestrictions = JSON.stringify(validatedData.dietaryRestrictions);
    }
    if (validatedData.dislikedFoods) {
      updateData.dislikedFoods = JSON.stringify(validatedData.dislikedFoods);
    }
    if (validatedData.mealPreferences) {
      updateData.mealPreferences = JSON.stringify(validatedData.mealPreferences);
    }

    if (existingPreferences) {
      // Update existing preferences
      await db
        .update(userPreferences)
        .set(updateData)
        .where(eq(userPreferences.id, existingPreferences.id));
    } else {
      // Create new preferences
      await db.insert(userPreferences).values({
        userId: req.user.userId,
        ...updateData,
        createdAt: new Date().toISOString(),
      });
    }

    // Mark onboarding as completed
    await db
      .update(users)
      .set({
        onboardingCompleted: true,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, req.user.userId));

    res.json({
      message: "Preferences saved successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error("Save preferences error:", error);
    res.status(500).json({ error: "Failed to save preferences" });
  }
});

/**
 * PATCH /api/onboarding/preferences - Update specific preference fields
 */
router.patch("/preferences", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const validatedData = preferencesSchema.partial().parse(req.body);

    // Check if preferences exist
    const [existingPreferences] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, req.user.userId))
      .limit(1);

    if (!existingPreferences) {
      return res.status(404).json({ error: "Preferences not found" });
    }

    // Prepare update data
    const updateData: any = {
      ...validatedData,
      updatedAt: new Date().toISOString(),
    };

    // Convert arrays to JSON strings for SQLite
    if (validatedData.allergies) {
      updateData.allergies = JSON.stringify(validatedData.allergies);
    }
    if (validatedData.dietaryRestrictions) {
      updateData.dietaryRestrictions = JSON.stringify(validatedData.dietaryRestrictions);
    }
    if (validatedData.dislikedFoods) {
      updateData.dislikedFoods = JSON.stringify(validatedData.dislikedFoods);
    }
    if (validatedData.mealPreferences) {
      updateData.mealPreferences = JSON.stringify(validatedData.mealPreferences);
    }

    // Update preferences
    await db
      .update(userPreferences)
      .set(updateData)
      .where(eq(userPreferences.id, existingPreferences.id));

    res.json({
      message: "Preferences updated successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error("Update preferences error:", error);
    res.status(500).json({ error: "Failed to update preferences" });
  }
});

/**
 * POST /api/onboarding/skip - Skip onboarding and mark as completed
 */
router.post("/skip", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Mark onboarding as completed without saving preferences
    await db
      .update(users)
      .set({
        onboardingCompleted: true,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, req.user.userId));

    res.json({
      message: "Onboarding skipped successfully",
    });
  } catch (error) {
    console.error("Skip onboarding error:", error);
    res.status(500).json({ error: "Failed to skip onboarding" });
  }
});

export default router;
