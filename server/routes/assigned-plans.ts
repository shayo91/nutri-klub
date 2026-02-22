import { Router } from "express";
import { db } from "../db";
import { userAssignedPlans, users } from "@shared/schema-sqlite";
import { eq, desc } from "drizzle-orm";
import { authenticate, requireAdmin } from "../middleware/auth";
import { z } from "zod";

const router = Router();

const createPlanSchema = z.object({
  userId: z.number(),
  title: z.string().min(1),
  content: z.string().min(1),
  weekLabel: z.string().optional(),
});

/**
 * GET /api/me/assigned-plan – trenutni plan za ulogovanog korisnika (posljednji dodijeljeni)
 */
router.get("/me/assigned-plan", authenticate, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });

    const [plan] = await db
      .select()
      .from(userAssignedPlans)
      .where(eq(userAssignedPlans.userId, req.user.userId))
      .orderBy(desc(userAssignedPlans.createdAt))
      .limit(1);

    if (!plan) {
      return res.json({ plan: null });
    }

    res.json({
      plan: {
        id: plan.id,
        title: plan.title,
        content: plan.content,
        weekLabel: plan.weekLabel,
        createdAt: plan.createdAt,
      },
    });
  } catch (error) {
    console.error("Get assigned plan error:", error);
    res.status(500).json({ error: "Failed to get plan" });
  }
});

/**
 * GET /api/admin/users – lista korisnika (samo admin, za dropdown pri dodjeljivanju plana)
 */
router.get("/admin/users", authenticate, requireAdmin, async (_req, res) => {
  try {
    const list = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        role: users.role,
      })
      .from(users)
      .orderBy(users.email);

    res.json({ users: list });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Failed to get users" });
  }
});

/**
 * POST /api/admin/assigned-plans – kreira i dodjeljuje plan korisniku (samo admin)
 */
router.post(
  "/admin/assigned-plans",
  authenticate,
  requireAdmin,
  async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Not authenticated" });

      const body = createPlanSchema.parse(req.body);

      const [inserted] = await db
        .insert(userAssignedPlans)
        .values({
          userId: body.userId,
          createdBy: req.user.userId,
          title: body.title,
          content: body.content,
          weekLabel: body.weekLabel ?? null,
        })
        .returning();

      res.status(201).json({ plan: inserted });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0]?.message });
      }
      console.error("Create assigned plan error:", error);
      res.status(500).json({ error: "Failed to create plan" });
    }
  }
);

/**
 * GET /api/admin/assigned-plans – lista svih dodijeljenih planova (samo admin)
 */
router.get(
  "/admin/assigned-plans",
  authenticate,
  requireAdmin,
  async (_req, res) => {
    try {
      const list = await db
        .select()
        .from(userAssignedPlans)
        .orderBy(desc(userAssignedPlans.createdAt));

      res.json({ plans: list });
    } catch (error) {
      console.error("List assigned plans error:", error);
      res.status(500).json({ error: "Failed to list plans" });
    }
  }
);

export default router;
