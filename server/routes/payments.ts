import { Router, Request, Response } from "express";
import { db } from "../db";
import { subscriptionOrders, planPurchases, users } from "@shared/schema-sqlite";
import { eq } from "drizzle-orm";
import { authenticate } from "../middleware/auth";
import { z } from "zod";
import Stripe from "stripe";

const router = Router();

// Stripe isključen za BiH – korisnici plaćaju mobilnim bankarstvom ili uplatnicom
// const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(...) : null;
const stripe = null;

// Cijene u KM – usklađeno sa web sekcijom (PricingSection)
const PRICING: Record<string, { amount: string; currency: string; name: string; mode: "subscription" | "payment"; consultations?: number; months?: number }> = {
  plan_konsultacije: {
    amount: "80",
    currency: "KM",
    name: "Konsultacije",
    mode: "payment",
    consultations: 1,
    months: 1,
  },
  plan_mjesecni: {
    amount: "200",
    currency: "KM",
    name: "Mjesečni mentorski program",
    mode: "payment",
    consultations: 2,
    months: 1,
  },
  plan_visemjesecni: {
    amount: "400",
    currency: "KM",
    name: "Višemjesečni mentorski program",
    mode: "payment",
    consultations: 6,
    months: 3,
  },
  // Premium pristup aplikaciji (opciono) – aktivacija putem emaila
  premium_monthly: {
    amount: "15",
    currency: "KM",
    name: "Premium mjesečno",
    mode: "subscription",
  },
  premium_yearly: {
    amount: "150",
    currency: "KM",
    name: "Premium godišnje",
    mode: "subscription",
  },
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

    const pricing = PRICING[orderType];

    // BiH: Stripe isključen – uvijek mock / kontakt za uplatu
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

    const checkoutUrl = `/dashboard/checkout?orderId=${order.id}&orderType=${orderType}`;

    return res.json({
      sessionId: order.stripeSessionId,
      checkoutUrl,
      order,
      mockMode: true,
    });

    // Stripe isključen za BiH – plaćanje mobilnim bankarstvom/uplatnicom
    // Get user email ... stripe.checkout.sessions.create(...) ...
  } catch (error) {
    console.error("Create checkout session error:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

/**
 * POST /api/payments/webhook
 * Stripe webhook handler (processes payment events)
 * NOTE: This route must be registered BEFORE any JSON body parsing middleware
 */
router.post("/webhook", async (_req: Request, res: Response) => {
  // Stripe isključen za BiH – plaćanje mobilnim bankarstvom/uplatnicom
  res.status(200).send("Stripe disabled for BiH");
  return;
  /*
  if (!stripe) return res.status(400).send("Stripe not configured");
  const sig = req.headers["stripe-signature"];
  if (!sig) return res.status(400).send("No signature");
  let event = stripe.webhooks.constructEvent(...);
  switch (event.type) { ... }
  */
});

// Helper function to handle checkout completion
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = parseInt(session.metadata?.userId || "0");
  const orderType = session.metadata?.orderType;

  if (!userId || !orderType) {
    console.error("Missing metadata in checkout session:", session.id);
    return;
  }

  console.log(`Processing checkout for user ${userId}, order type: ${orderType}`);

  // Find the pending order
  const [order] = await db
    .select()
    .from(subscriptionOrders)
    .where(eq(subscriptionOrders.stripeSessionId, session.id))
    .limit(1);

  if (!order) {
    console.error(`Order not found for session: ${session.id}`);
    return;
  }

  // Update order status
  await db
    .update(subscriptionOrders)
    .set({
      status: "completed",
      completedAt: new Date().toISOString(),
      stripePaymentIntentId: session.payment_intent as string || "",
    })
    .where(eq(subscriptionOrders.id, order.id));

  // Update user role to premium
  await db
    .update(users)
    .set({
      role: "premium",
      subscriptionStatus: "active",
      subscriptionTier: orderType.includes("monthly") ? "monthly" : "yearly",
      subscriptionExpiresAt: getSubscriptionExpiry(orderType),
    })
    .where(eq(users.id, userId));

  // If it's a plan purchase, create plan purchase record
  if (orderType.startsWith("plan_")) {
    const planType = orderType.replace("plan_", "") as "start" | "balans" | "transformacija";
    const pricing = PRICING[orderType as keyof typeof PRICING] as any;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + pricing.months);

    await db.insert(planPurchases).values({
      orderId: order.id,
      userId,
      planType,
      consultationsTotal: pricing.consultations,
      consultationsUsed: 0,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      status: "active",
      calendlyUrl: process.env.CALENDLY_EVENT_TYPE_URL || `https://calendly.com/nutriklub/${planType}-consultation`,
    });
  }

  console.log(`Successfully processed checkout for user ${userId}`);
}

// Helper function to handle subscription changes
async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  // Find user by Stripe customer ID (you'd need to store this in the users table)
  // For now, we'll log it
  console.log(`Subscription ${subscription.id} for customer ${customerId} changed to status: ${subscription.status}`);
  
  if (subscription.status === "canceled" || subscription.status === "unpaid") {
    // Handle subscription cancellation or payment failure
    console.log(`Subscription ${subscription.id} is no longer active`);
  }
}

// Helper function to handle payment failures
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log(`Payment failed for intent: ${paymentIntent.id}`);
  
  // You could send an email to the user or update order status
  // Find order by payment intent ID and mark as failed
}

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