import type { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { usageTracking, users } from "@shared/schema-sqlite";
import { eq, and } from "drizzle-orm";

export type Feature = "recipe_view" | "ai_message" | "ebook_download";

// Free tier limits
const FREE_TIER_LIMITS: Record<Feature, number> = {
  recipe_view: 3, // Only 3 recipes total
  ai_message: 2, // Only 2 AI messages total
  ebook_download: 1, // Only 1 free ebook
};

/**
 * Middleware to enforce rate limits for free tier users
 */
export function rateLimitFeature(feature: Feature) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      // Get user from database to check role
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, req.user.userId))
        .limit(1);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Premium users and admins have no limits
      if (user.role === "premium" || user.role === "admin") {
        return next();
      }

      // Free users - check usage
      const limit = FREE_TIER_LIMITS[feature];

      // Get current usage
      const [usage] = await db
        .select()
        .from(usageTracking)
        .where(
          and(
            eq(usageTracking.userId, req.user.userId),
            eq(usageTracking.feature, feature)
          )
        )
        .limit(1);

      const currentCount = usage?.count || 0;

      if (currentCount >= limit) {
        return res.status(429).json({
          error: "Rate limit exceeded",
          code: "RATE_LIMIT_EXCEEDED",
          feature,
          limit,
          current: currentCount,
          message: `You've reached your free tier limit of ${limit} ${feature.replace("_", " ")}s. Upgrade to Premium for unlimited access!`,
        });
      }

      // Increment usage
      if (usage) {
        await db
          .update(usageTracking)
          .set({
            count: currentCount + 1,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(usageTracking.id, usage.id));
      } else {
        await db.insert(usageTracking).values({
          userId: req.user.userId,
          feature,
          count: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      // Attach usage info to request for optional use in response
      (req as any).usageInfo = {
        feature,
        current: currentCount + 1,
        limit,
        remaining: limit - (currentCount + 1),
      };

      next();
    } catch (error) {
      console.error("Error checking rate limit:", error);
      return res.status(500).json({ error: "Failed to check usage limits" });
    }
  };
}

/**
 * Get usage stats for a user
 */
export async function getUserUsageStats(userId: number) {
  const usage = await db
    .select()
    .from(usageTracking)
    .where(eq(usageTracking.userId, userId));

  const stats: Record<Feature, { current: number; limit: number; remaining: number }> = {
    recipe_view: {
      current: 0,
      limit: FREE_TIER_LIMITS.recipe_view,
      remaining: FREE_TIER_LIMITS.recipe_view,
    },
    ai_message: {
      current: 0,
      limit: FREE_TIER_LIMITS.ai_message,
      remaining: FREE_TIER_LIMITS.ai_message,
    },
    ebook_download: {
      current: 0,
      limit: FREE_TIER_LIMITS.ebook_download,
      remaining: FREE_TIER_LIMITS.ebook_download,
    },
  };

  for (const item of usage) {
    const feature = item.feature as Feature;
    if (stats[feature]) {
      stats[feature].current = item.count || 0;
      stats[feature].remaining = Math.max(0, stats[feature].limit - (item.count || 0));
    }
  }

  return stats;
}
