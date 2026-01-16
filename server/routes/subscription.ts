import { Router } from "express";
import { db } from "../db";
import { users, subscriptions } from "@shared/schema-sqlite";
import { eq, and } from "drizzle-orm";
import { authenticate } from "../middleware/auth";
import { getUserUsageStats } from "../middleware/rateLimit";

const router = Router();

/**
 * GET /api/subscription/status - Get subscription status
 */
router.get("/status", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Get user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user.userId))
      .limit(1);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get active subscriptions
    const userSubscriptions = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, req.user.userId),
          eq(subscriptions.status, "active")
        )
      );

    // Get usage stats (for free tier)
    const usageStats = await getUserUsageStats(req.user.userId);

    res.json({
      role: user.role,
      subscriptionStatus: user.subscriptionStatus,
      subscriptionTier: user.subscriptionTier,
      subscriptionExpiresAt: user.subscriptionExpiresAt,
      isPremium: user.role === "premium" || user.role === "admin",
      isAdmin: user.role === "admin",
      subscriptions: userSubscriptions,
      usageStats,
    });
  } catch (error) {
    console.error("Get subscription status error:", error);
    res.status(500).json({ error: "Failed to get subscription status" });
  }
});

/**
 * GET /api/subscription/usage - Get usage limits (for free tier)
 */
router.get("/usage", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const usageStats = await getUserUsageStats(req.user.userId);

    res.json(usageStats);
  } catch (error) {
    console.error("Get usage error:", error);
    res.status(500).json({ error: "Failed to get usage information" });
  }
});

/**
 * POST /api/subscription/cancel - Cancel premium subscription
 */
router.post("/cancel", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Get user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user.userId))
      .limit(1);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if user has premium subscription
    if (user.role !== "premium") {
      return res.status(400).json({ error: "No active premium subscription to cancel" });
    }

    // Find active premium subscription
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, req.user.userId),
          eq(subscriptions.status, "active")
        )
      )
      .limit(1);

    if (!subscription) {
      return res.status(400).json({ error: "No active subscription found" });
    }

    // Mark subscription to cancel at period end
    await db
      .update(subscriptions)
      .set({
        cancelAtPeriodEnd: true,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(subscriptions.id, subscription.id));

    // TODO: Cancel Stripe subscription

    res.json({
      message: "Subscription will be cancelled at the end of the billing period",
      expiresAt: subscription.currentPeriodEnd,
    });
  } catch (error) {
    console.error("Cancel subscription error:", error);
    res.status(500).json({ error: "Failed to cancel subscription" });
  }
});

export default router;
