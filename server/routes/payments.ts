import { Router } from "express";
import { db } from "../db";
import { subscriptionOrders, planPurchases, users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { authenticate } from "../middleware/auth";
import { z } from "zod";

const router = Router();

// Pricing configuration
const PRICING = {
  premium_monthly: { amount: "4.00", currency: "EUR", name: "Premium Mesečno" },
  premium_yearly: { amount: "35.00", currency: "EUR", name: "Premium Godišnje" },
  plan_start: { amount: "46.00", currency: "EUR", name: "Start Plan", consultations: 1, months: 1 },
  plan_balans: { amount: "97.00", currency: "EUR", name: "Balans Plan", consultations: 3, months: 3 },
  plan_transformacija: { amount: "199.00", currency: "EUR", name: "Transformacija Plan", consultations: 6, months: 6 },
};

/**
 * POST /api/payments/create-checkout-session
 * Create Stripe checkout session
 */
router.post("/create-checkout-session", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { orderType } = req.body;

    if (!orderType || !PRICING[orderType as keyof typeof PRICING]) {
      return res.status(400).json({ error: "Invalid order type" });
    }

    const pricing = PRICING[orderType as keyof typeof PRICING];

    // In a real implementation, you would create a Stripe Checkout Session here
    // For now, we'll create a mock session

    // Create pending order
    const [order] = await db
      .insert(subscriptionOrders)
      .values({
        userId: req.user.userId,
        orderType,
        amount: pricing.amount,
        currency: pricing.currency,
        status: "pending",
        stripeSessionId: `mock_session_${Date.now()}`,
        metadata: JSON.stringify({ pricing }),
      })
      .returning();

    // Mock checkout URL (in production, this would be Stripe's URL)
    const checkoutUrl = `/dashboard/checkout-mock?orderId=${order.id}&orderType=${orderType}`;

    res.json({
      sessionId: order.stripeSessionId,
      checkoutUrl,
      order,
    });
  } catch (error) {
    console.error("Create checkout session error:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

/**
 * POST /api/payments/complete-order (Mock payment completion)
 * In production, this would be handled by Stripe webhooks
 */
router.post("/complete-order", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: "Order ID is required" });
    }

    // Get order
    const [order] = await db
      .select()
      .from(subscriptionOrders)
      .where(eq(subscriptionOrders.id, parseInt(orderId)))
      .limit(1);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.userId !== req.user.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (order.status === "completed") {
      return res.status(400).json({ error: "Order already completed" });
    }

    // Update order status
    await db
      .update(subscriptionOrders)
      .set({
        status: "completed",
        completedAt: new Date().toISOString(),
        stripePaymentIntentId: `mock_pi_${Date.now()}`,
      })
      .where(eq(subscriptionOrders.id, order.id));

    // Update user role to premium
    await db
      .update(users)
      .set({
        role: "premium",
        subscriptionStatus: "active",
        subscriptionTier: order.orderType.includes("monthly") ? "monthly" : "yearly",
        subscriptionExpiresAt: getSubscriptionExpiry(order.orderType),
      })
      .where(eq(users.id, req.user.userId));

    // If it's a plan purchase, create plan purchase record
    if (order.orderType.startsWith("plan_")) {
      const planType = order.orderType.replace("plan_", "") as "start" | "balans" | "transformacija";
      const pricing = PRICING[order.orderType as keyof typeof PRICING] as any;

      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + pricing.months);

      await db.insert(planPurchases).values({
        orderId: order.id,
        userId: req.user.userId,
        planType,
        consultationsTotal: pricing.consultations,
        consultationsUsed: 0,
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        status: "active",
        calendlyUrl: `https://calendly.com/nutriklub/${planType}-consultation`,
      });
    }

    res.json({
      message: "Payment successful!",
      order,
      redirectUrl: order.orderType.startsWith("plan_")
        ? `/dashboard/plan-success?orderId=${order.id}`
        : "/dashboard/success",
    });
  } catch (error) {
    console.error("Complete order error:", error);
    res.status(500).json({ error: "Failed to complete order" });
  }
});

/**
 * GET /api/payments/orders - Get user's order history
 */
router.get("/orders", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const orders = await db
      .select()
      .from(subscriptionOrders)
      .where(eq(subscriptionOrders.userId, req.user.userId))
      .orderBy(subscriptionOrders.createdAt);

    res.json({ orders });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ error: "Failed to get orders" });
  }
});

/**
 * GET /api/payments/plans - Get user's plan purchases
 */
router.get("/plans", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const plans = await db
      .select()
      .from(planPurchases)
      .where(eq(planPurchases.userId, req.user.userId))
      .orderBy(planPurchases.createdAt);

    res.json({ plans });
  } catch (error) {
    console.error("Get plans error:", error);
    res.status(500).json({ error: "Failed to get plans" });
  }
});

/**
 * POST /api/payments/cancel-subscription - Cancel subscription
 */
router.post("/cancel-subscription", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Update user subscription status
    await db
      .update(users)
      .set({
        subscriptionStatus: "cancelled",
      })
      .where(eq(users.id, req.user.userId));

    res.json({ message: "Subscription cancelled successfully" });
  } catch (error) {
    console.error("Cancel subscription error:", error);
    res.status(500).json({ error: "Failed to cancel subscription" });
  }
});

// Helper functions
function getSubscriptionExpiry(orderType: string): string {
  const now = new Date();
  if (orderType.includes("monthly")) {
    now.setMonth(now.getMonth() + 1);
  } else if (orderType.includes("yearly")) {
    now.setFullYear(now.getFullYear() + 1);
  } else {
    // Plans have their own expiry logic
    return "";
  }
  return now.toISOString();
}

export default router;
