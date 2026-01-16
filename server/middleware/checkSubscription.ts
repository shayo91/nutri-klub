import type { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { users, subscriptions } from "@shared/schema-sqlite";
import { eq, and, gt } from "drizzle-orm";

/**
 * Middleware to check if user has an active premium subscription
 */
export async function requirePremium(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Get user from database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user.userId))
      .limit(1);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if user has premium role (admin is also considered premium)
    if (user.role === "premium" || user.role === "admin") {
      // Double-check subscription status
      if (user.subscriptionStatus === "active") {
        // Check if subscription hasn't expired
        if (user.subscriptionExpiresAt) {
          const expiresAt = new Date(user.subscriptionExpiresAt);
          if (expiresAt < new Date()) {
            // Subscription expired, update status
            await db
              .update(users)
              .set({
                subscriptionStatus: "expired",
                role: "free",
                updatedAt: new Date().toISOString(),
              })
              .where(eq(users.id, user.id));

            return res.status(403).json({
              error: "Premium subscription expired",
              code: "SUBSCRIPTION_EXPIRED",
            });
          }
        }

        return next();
      }
    }

    return res.status(403).json({
      error: "Premium subscription required",
      code: "PREMIUM_REQUIRED",
      message: "This feature is only available for Premium members. Upgrade now!",
    });
  } catch (error) {
    console.error("Error checking subscription:", error);
    return res.status(500).json({ error: "Failed to verify subscription status" });
  }
}

/**
 * Middleware to check if user has any active plan (Start, Balans, or Transformacija)
 */
export async function requirePlan(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Check if user has an active plan subscription
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, req.user.userId),
          eq(subscriptions.type, "plan"),
          eq(subscriptions.status, "active")
        )
      )
      .limit(1);

    if (!subscription) {
      return res.status(403).json({
        error: "Active plan required",
        code: "PLAN_REQUIRED",
        message: "This feature is only available for users with an active nutrition plan.",
      });
    }

    // Check if plan hasn't expired
    if (subscription.expiresAt) {
      const expiresAt = new Date(subscription.expiresAt);
      if (expiresAt < new Date()) {
        return res.status(403).json({
          error: "Plan expired",
          code: "PLAN_EXPIRED",
          message: "Your nutrition plan has expired. Renew or purchase a new plan.",
        });
      }
    }

    next();
  } catch (error) {
    console.error("Error checking plan:", error);
    return res.status(500).json({ error: "Failed to verify plan status" });
  }
}

/**
 * Middleware that allows both premium users and plan purchasers
 */
export async function requirePremiumOrPlan(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Check user role first (admin or premium)
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user.userId))
      .limit(1);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If user is premium or admin with active subscription
    if ((user.role === "premium" || user.role === "admin") && user.subscriptionStatus === "active") {
      if (user.subscriptionExpiresAt) {
        const expiresAt = new Date(user.subscriptionExpiresAt);
        if (expiresAt > new Date()) {
          return next();
        }
      } else {
        return next();
      }
    }

    // Check if user has an active plan
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, req.user.userId),
          eq(subscriptions.type, "plan"),
          eq(subscriptions.status, "active")
        )
      )
      .limit(1);

    if (subscription) {
      if (subscription.expiresAt) {
        const expiresAt = new Date(subscription.expiresAt);
        if (expiresAt > new Date()) {
          return next();
        }
      } else {
        return next();
      }
    }

    return res.status(403).json({
      error: "Premium subscription or active plan required",
      code: "PREMIUM_OR_PLAN_REQUIRED",
      message: "This feature requires either a Premium subscription or an active nutrition plan.",
    });
  } catch (error) {
    console.error("Error checking premium/plan status:", error);
    return res.status(500).json({ error: "Failed to verify subscription status" });
  }
}
