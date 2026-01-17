/**
 * Seed tracking data for development
 * Run: npx tsx server/seed-tracking.ts
 */

import { db } from "./db";
import { weightTracking, waterIntake, mealLogs, goals, streaks, users } from "@shared/schema";
import { eq } from "drizzle-orm";

async function seedTracking() {
  console.log("📊 Seeding tracking data...\n");

  try {
    // Get test users
    const [freeUser] = await db.select().from(users).where(eq(users.email, "test@example.com")).limit(1);
    const [premiumUser] = await db.select().from(users).where(eq(users.email, "premium@example.com")).limit(1);

    if (!freeUser || !premiumUser) {
      console.error("❌ Test users not found. Run seed-users.ts first!");
      return;
    }

    console.log("✅ Found test users");

    // Seed weight tracking for premium user (last 30 days)
    const weightEntries = [];
    const today = new Date();
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      
      // Simulate weight loss trend: 80kg -> 77kg over 30 days
      const baseWeight = 80;
      const weightLoss = (30 - i) * 0.1; // 0.1kg per day
      const randomVariation = (Math.random() - 0.5) * 0.3; // ±0.15kg random
      const weight = (baseWeight - weightLoss + randomVariation).toFixed(1);
      
      const moods = ["great", "good", "okay", "bad"];
      const mood = moods[Math.floor(Math.random() * moods.length)];
      const energyLevel = Math.floor(Math.random() * 5) + 1;
      
      weightEntries.push({
        userId: premiumUser.id,
        date: dateStr,
        weight: weight,
        mood: mood as any,
        energyLevel,
        notes: i % 7 === 0 ? "Nedeljno merenje" : undefined,
      });
    }

    await db.insert(weightTracking).values(weightEntries);
    console.log(`✅ Inserted ${weightEntries.length} weight entries for premium user`);

    // Seed water intake for premium user (last 7 days)
    const waterEntries = [];
    for (let i = 7; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      
      // Random 4-8 water logs per day (250ml each)
      const logsPerDay = Math.floor(Math.random() * 5) + 4;
      for (let j = 0; j < logsPerDay; j++) {
        waterEntries.push({
          userId: premiumUser.id,
          date: dateStr,
          amount: 250,
        });
      }
    }

    await db.insert(waterIntake).values(waterEntries);
    console.log(`✅ Inserted ${waterEntries.length} water intake entries`);

    // Seed meal logs for today
    const todayStr = today.toISOString().split("T")[0];
    const meals = [
      {
        userId: premiumUser.id,
        date: todayStr,
        mealType: "breakfast",
        mealName: "Ovsena kaša sa voćem",
        calories: 350,
        protein: 12,
        carbs: 55,
        fats: 8,
      },
      {
        userId: premiumUser.id,
        date: todayStr,
        mealType: "lunch",
        mealName: "Piletina sa povrćem",
        calories: 450,
        protein: 35,
        carbs: 30,
        fats: 15,
      },
      {
        userId: premiumUser.id,
        date: todayStr,
        mealType: "snack",
        mealName: "Voćna salata",
        calories: 120,
        protein: 2,
        carbs: 28,
        fats: 1,
      },
    ];

    await db.insert(mealLogs).values(meals);
    console.log(`✅ Inserted ${meals.length} meal logs`);

    // Seed goals
    const goalsData = [
      {
        userId: premiumUser.id,
        goalType: "weight",
        targetValue: "75",
        currentValue: "77",
        startDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        targetDate: new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        title: "Izgubiti 5kg",
        description: "Cilj je da smršam 5kg za 3 meseca zdravim načinom.",
        status: "active",
      },
      {
        userId: premiumUser.id,
        goalType: "custom",
        targetValue: "2000",
        currentValue: "1500",
        startDate: todayStr,
        targetDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        title: "Piti 2L vode dnevno",
        description: "Povećati unos vode na 2L dnevno.",
        status: "active",
      },
    ];

    await db.insert(goals).values(goalsData);
    console.log(`✅ Inserted ${goalsData.length} goals`);

    // Seed streaks
    const streaksData = [
      {
        userId: premiumUser.id,
        streakType: "weight_log",
        currentStreak: 7,
        longestStreak: 15,
        lastActivity: todayStr,
      },
      {
        userId: premiumUser.id,
        streakType: "water",
        currentStreak: 5,
        longestStreak: 10,
        lastActivity: todayStr,
      },
      {
        userId: premiumUser.id,
        streakType: "meal_log",
        currentStreak: 3,
        longestStreak: 7,
        lastActivity: todayStr,
      },
    ];

    await db.insert(streaks).values(streaksData);
    console.log(`✅ Inserted ${streaksData.length} streaks`);

    console.log("\n🎉 Tracking data seeded successfully!");
    console.log("\n📊 Summary:");
    console.log(`   Weight entries: ${weightEntries.length}`);
    console.log(`   Water entries: ${waterEntries.length}`);
    console.log(`   Meal logs: ${meals.length}`);
    console.log(`   Goals: ${goalsData.length}`);
    console.log(`   Streaks: ${streaksData.length}`);
    console.log("\n💡 Login as premium@example.com to see the tracking data!");
  } catch (error) {
    console.error("❌ Error seeding tracking data:", error);
    throw error;
  }
}

// Run seeding
seedTracking()
  .then(() => {
    console.log("\n✅ Seeding complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Seeding failed:", error);
    process.exit(1);
  });

export { seedTracking };
