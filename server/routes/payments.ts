import { Router, Request, Response } from "express";
import { db } from "../db";
import { subscriptionOrders, planPurchases, users } from "@shared/schema-sqlite";
import { eq } from "drizzle-orm";
import { authenticate } from "../middleware/auth";
import { z } from "zod";
import Stripe from "stripe";

const router = Router();

// Initialize Stripe only if API key is provided
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-08-27.basil",
    })
  : null;

// Pricing configuration
const PRICING = {
  premium_monthly: { 
    amount: "4.00", 
    currency: "EUR", 
    name: "Premium Mesečno",
    stripePriceId: process.env.STRIPE_PRICE_PREMIUM_MONTHLY,
    mode: "subscription" as const,
  },
  premium_yearly: { 
    amount: "35.00", 
    currency: "EUR", 
    name: "Premium Godišnje",
    stripePriceId: process.env.STRIPE_PRICE_PREMIUM_YEARLY,
    mode: "subscription" as const,
  },
  plan_start: { 
    amount: "46.00", 
    currency: "EUR", 
    name: "Start Plan", 
    consultations: 1, 
    months: 1,
    stripePriceId: process.env.STRIPE_PRICE_PLAN_START,
    mode: "payment" as const,
  },
  plan_balans: { 
    amount: "97.00", 
    currency: "EUR", 
    name: "Balans Plan", 
    consultations: 3, 
    months: 3,
    stripePriceId: process.env.STRIPE_PRICE_PLAN_BALANS,
    mode: "payment" as const,
  },
  plan_transformacija: { 
    amount: "199.00", 
    currency: "EUR", 
    name: "Transformacija Plan", 
    consultations: 6, 
    months: 6,
    stripePriceId: process.env.STRIPE_PRICE_PLAN_TRANSFORMACIJA,
    mode: "payment" as const,
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

    const pricing = PRICING[orderType as keyof typeof PRICING];

    // Check if Stripe is configured
    if (!stripe || !pricing.stripePriceId) {
      console.warn(`Stripe not configured or Price ID missing for ${orderType}, using mock mode`);
      
      // Fallback to mock mode
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

      const checkoutUrl = `/dashboard/checkout-mock?orderId=${order.id}&orderType=${orderType}`;

      return res.json({
        sessionId: order.stripeSessionId,
        checkoutUrl,
        order,
        mockMode: true,
      });
    }

    // Get user email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user.userId))
      .limit(1);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price: pricing.stripePriceId,
          quantity: 1,
        },
      ],
      mode: pricing.mode,
      success_url: `${process.env.APP_URL || "http://localhost:5000"}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL || "http://localhost:5000"}/dashboard/upgrade`,
      metadata: {
        userId: req.user.userId.toString(),
        orderType,
      },
    });

    // Create pending order
    const [order] = await db
      .insert(subscriptionOrders)
      .values({
        userId: req.user.userId,
        orderType,
        amount: pricing.amount,
        currency: pricing.currency,
        status: "pending",
        stripeSessionId: session.id,
        metadata: JSON.stringify({ pricing }),
      })
      .returning();

    res.json({
      sessionId: session.id,
      checkoutUrl: session.url,
      order,
      mockMode: false,
    });
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
router.post("/webhook", async (req: Request, res: Response) => {
  // Check if Stripe is configured
  if (!stripe) {
    console.error("Stripe webhook called but Stripe is not configured");
    return res.status(400).send("Stripe not configured");
  }

  const sig = req.headers["stripe-signature"];

  if (!sig) {
    console.error("No Stripe signature found");
    return res.status(400).send("No signature");
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`Received Stripe event: ${event.type}`);

  try {
    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("PaymentIntent succeeded:", paymentIntent.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("PaymentIntent failed:", paymentIntent.id);
        await handlePaymentFailed(paymentIntent);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    res.status(500).json({ error: "Webhook handler failed" });
  }
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
        ? "/dashboard/my-plan"
        : "/dashboard/payment-success",
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