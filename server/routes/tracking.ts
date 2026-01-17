import { Router } from "express";
import { db } from "../db";
import {
  weightTracking,
  bodyMeasurements,
  waterIntake,
  mealLogs,
  goals,
  progressPhotos,
  streaks,
} from "@shared/schema";
import { eq, and, gte, lte, desc, sql, asc } from "drizzle-orm";
import { authenticate } from "../middleware/auth";
import { z } from "zod";

const router = Router();

// ======================
// WEIGHT TRACKING
// ======================

const weightSchema = z.object({
  date: z.string(),
  weight: z.union([z.string(), z.number()]),
  notes: z.string().optional(),
  mood: z.enum(["great", "good", "okay", "bad"]).optional(),
  energyLevel: z.number().min(1).max(5).optional(),
});

/**
 * POST /api/tracking/weight - Log weight
 */
router.post("/weight", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const data = weightSchema.parse(req.body);

    const [weight] = await db
      .insert(weightTracking)
      .values({
        userId: req.user.userId,
        date: data.date,
        weight: data.weight.toString(),
        notes: data.notes,
        mood: data.mood,
        energyLevel: data.energyLevel,
      })
      .returning();

    // Update streak
    await updateStreak(req.user.userId, "weight_log");

    res.status(201).json({ weight });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error("Log weight error:", error);
    res.status(500).json({ error: "Failed to log weight" });
  }
});

/**
 * GET /api/tracking/weight - Get weight history
 */
router.get("/weight", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;
    const limit = parseInt(req.query.limit as string) || 30;

    let query = db
      .select()
      .from(weightTracking)
      .where(eq(weightTracking.userId, req.user.userId));

    if (startDate) {
      query = query.where(
        and(
          eq(weightTracking.userId, req.user.userId),
          gte(weightTracking.date, startDate)
        )
      ) as any;
    }

    if (endDate) {
      query = query.where(
        and(
          eq(weightTracking.userId, req.user.userId),
          lte(weightTracking.date, endDate)
        )
      ) as any;
    }

    const weights = await query
      .orderBy(desc(weightTracking.date))
      .limit(limit);

    res.json({ weights });
  } catch (error) {
    console.error("Get weight error:", error);
    res.status(500).json({ error: "Failed to get weight history" });
  }
});

/**
 * DELETE /api/tracking/weight/:id - Delete weight entry
 */
router.delete("/weight/:id", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const id = parseInt(req.params.id);

    await db
      .delete(weightTracking)
      .where(
        and(
          eq(weightTracking.id, id),
          eq(weightTracking.userId, req.user.userId)
        )
      );

    res.json({ message: "Weight entry deleted" });
  } catch (error) {
    console.error("Delete weight error:", error);
    res.status(500).json({ error: "Failed to delete weight entry" });
  }
});

// ======================
// WATER INTAKE
// ======================

/**
 * POST /api/tracking/water - Log water intake
 */
router.post("/water", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { date, amount } = req.body;

    if (!date || !amount) {
      return res.status(400).json({ error: "Date and amount are required" });
    }

    const [water] = await db
      .insert(waterIntake)
      .values({
        userId: req.user.userId,
        date,
        amount: parseInt(amount),
      })
      .returning();

    // Update streak
    await updateStreak(req.user.userId, "water");

    res.status(201).json({ water });
  } catch (error) {
    console.error("Log water error:", error);
    res.status(500).json({ error: "Failed to log water intake" });
  }
});

/**
 * GET /api/tracking/water - Get water intake for a date range
 */
router.get("/water", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: "Start and end dates are required" });
    }

    const waters = await db
      .select()
      .from(waterIntake)
      .where(
        and(
          eq(waterIntake.userId, req.user.userId),
          gte(waterIntake.date, startDate),
          lte(waterIntake.date, endDate)
        )
      )
      .orderBy(asc(waterIntake.date));

    // Aggregate by date
    const dailyIntake = waters.reduce((acc: any, water: any) => {
      const date = water.date;
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += water.amount;
      return acc;
    }, {});

    res.json({ waters, dailyIntake });
  } catch (error) {
    console.error("Get water error:", error);
    res.status(500).json({ error: "Failed to get water intake" });
  }
});

// ======================
// MEAL LOGS
// ======================

/**
 * POST /api/tracking/meals - Log meal
 */
router.post("/meals", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { date, mealType, recipeId, mealName, calories, protein, carbs, fats, notes } = req.body;

    if (!date || !mealType) {
      return res.status(400).json({ error: "Date and meal type are required" });
    }

    const [meal] = await db
      .insert(mealLogs)
      .values({
        userId: req.user.userId,
        date,
        mealType,
        recipeId: recipeId || null,
        mealName,
        calories: calories ? parseInt(calories) : null,
        protein: protein ? parseInt(protein) : null,
        carbs: carbs ? parseInt(carbs) : null,
        fats: fats ? parseInt(fats) : null,
        notes,
      })
      .returning();

    // Update streak
    await updateStreak(req.user.userId, "meal_log");

    res.status(201).json({ meal });
  } catch (error) {
    console.error("Log meal error:", error);
    res.status(500).json({ error: "Failed to log meal" });
  }
});

/**
 * GET /api/tracking/meals - Get meal logs
 */
router.get("/meals", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const date = req.query.date as string;

    if (!date) {
      return res.status(400).json({ error: "Date is required" });
    }

    const meals = await db
      .select()
      .from(mealLogs)
      .where(
        and(
          eq(mealLogs.userId, req.user.userId),
          eq(mealLogs.date, date)
        )
      )
      .orderBy(asc(mealLogs.createdAt));

    // Calculate daily totals
    const totals = meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + (meal.calories || 0),
        protein: acc.protein + (meal.protein || 0),
        carbs: acc.carbs + (meal.carbs || 0),
        fats: acc.fats + (meal.fats || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );

    res.json({ meals, totals });
  } catch (error) {
    console.error("Get meals error:", error);
    res.status(500).json({ error: "Failed to get meal logs" });
  }
});

// ======================
// GOALS
// ======================

/**
 * POST /api/tracking/goals - Create goal
 */
router.post("/goals", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { goalType, targetValue, currentValue, startDate, targetDate, title, description } = req.body;

    const [goal] = await db
      .insert(goals)
      .values({
        userId: req.user.userId,
        goalType,
        targetValue: targetValue?.toString(),
        currentValue: currentValue?.toString(),
        startDate,
        targetDate,
        title,
        description,
      })
      .returning();

    res.status(201).json({ goal });
  } catch (error) {
    console.error("Create goal error:", error);
    res.status(500).json({ error: "Failed to create goal" });
  }
});

/**
 * GET /api/tracking/goals - Get user goals
 */
router.get("/goals", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const status = req.query.status as string | undefined;

    let query = db
      .select()
      .from(goals)
      .where(eq(goals.userId, req.user.userId));

    if (status) {
      query = query.where(
        and(
          eq(goals.userId, req.user.userId),
          eq(goals.status, status)
        )
      ) as any;
    }

    const userGoals = await query.orderBy(desc(goals.createdAt));

    res.json({ goals: userGoals });
  } catch (error) {
    console.error("Get goals error:", error);
    res.status(500).json({ error: "Failed to get goals" });
  }
});

/**
 * PUT /api/tracking/goals/:id - Update goal
 */
router.put("/goals/:id", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const id = parseInt(req.params.id);
    const { currentValue, status } = req.body;

    const updates: any = {};
    if (currentValue !== undefined) {
      updates.currentValue = currentValue.toString();
    }
    if (status) {
      updates.status = status;
      if (status === "completed") {
        updates.completedAt = new Date().toISOString();
      }
    }

    const [goal] = await db
      .update(goals)
      .set(updates)
      .where(
        and(
          eq(goals.id, id),
          eq(goals.userId, req.user.userId)
        )
      )
      .returning();

    res.json({ goal });
  } catch (error) {
    console.error("Update goal error:", error);
    res.status(500).json({ error: "Failed to update goal" });
  }
});

// ======================
// STATISTICS & INSIGHTS
// ======================

/**
 * GET /api/tracking/stats - Get overall statistics
 */
router.get("/stats", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Get latest weight
    const [latestWeight] = await db
      .select()
      .from(weightTracking)
      .where(eq(weightTracking.userId, req.user.userId))
      .orderBy(desc(weightTracking.date))
      .limit(1);

    // Get weight change (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split("T")[0];

    const [oldWeight] = await db
      .select()
      .from(weightTracking)
      .where(
        and(
          eq(weightTracking.userId, req.user.userId),
          lte(weightTracking.date, thirtyDaysAgoStr)
        )
      )
      .orderBy(desc(weightTracking.date))
      .limit(1);

    const weightChange = latestWeight && oldWeight
      ? parseFloat(latestWeight.weight) - parseFloat(oldWeight.weight)
      : null;

    // Get streaks
    const userStreaks = await db
      .select()
      .from(streaks)
      .where(eq(streaks.userId, req.user.userId));

    res.json({
      latestWeight: latestWeight?.weight || null,
      weightChange,
      streaks: userStreaks,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ error: "Failed to get statistics" });
  }
});

// ======================
// HELPER FUNCTIONS
// ======================

async function updateStreak(userId: number, streakType: string) {
  try {
    const today = new Date().toISOString().split("T")[0];

    const [streak] = await db
      .select()
      .from(streaks)
      .where(
        and(
          eq(streaks.userId, userId),
          eq(streaks.streakType, streakType)
        )
      )
      .limit(1);

    if (!streak) {
      // Create new streak
      await db.insert(streaks).values({
        userId,
        streakType,
        currentStreak: 1,
        longestStreak: 1,
        lastActivity: today,
      });
    } else {
      // Update existing streak
      const lastActivity = streak.lastActivity ? new Date(streak.lastActivity) : new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      let newCurrentStreak = streak.currentStreak || 0;

      if (streak.lastActivity === today) {
        // Already logged today, no change
        return;
      } else if (streak.lastActivity === yesterdayStr) {
        // Consecutive day
        newCurrentStreak += 1;
      } else {
        // Streak broken
        newCurrentStreak = 1;
      }

      const newLongestStreak = Math.max(newCurrentStreak, streak.longestStreak || 0);

      await db
        .update(streaks)
        .set({
          currentStreak: newCurrentStreak,
          longestStreak: newLongestStreak,
          lastActivity: today,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(streaks.id, streak.id));
    }
  } catch (error) {
    console.error("Update streak error:", error);
  }
}

export default router;
