import "dotenv/config";
import { eq } from "drizzle-orm";
import * as schema from "@shared/schema-sqlite";
import bcrypt from "bcrypt";
import { db } from "./db";

const { users, userPreferences } = schema;

const TEST_EMAIL = "test@example.com";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, TEST_EMAIL))
      .limit(1);

    let testUser = existingUser;
    if (!testUser) {
      const hashedPassword = await bcrypt.hash("test123", 10);
      const [created] = await db
        .insert(users)
        .values({
          email: TEST_EMAIL,
          firstName: "Test",
          lastName: "User",
          passwordHash: hashedPassword,
          role: "free",
          subscriptionStatus: "inactive",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .returning();
      testUser = created;
      console.log("✅ Created test user:", testUser.email);
    } else {
      console.log("ℹ️ Test user already present:", TEST_EMAIL);
    }

    const [existingPrefs] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, testUser.id))
      .limit(1);

    if (!existingPrefs) {
      await db.insert(userPreferences).values({
        userId: testUser.id,
        goal: "lose_weight",
        allergies: JSON.stringify(["Kikiriki"]),
        dietaryRestrictions: JSON.stringify(["Bezglutenska"]),
        dislikedFoods: JSON.stringify([]),
        mealPreferences: JSON.stringify([]),
        activityLevel: "moderate",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      console.log("✅ Created user preferences");
    } else {
      console.log(
        "ℹ️ User preferences already present for user id:",
        String(testUser.id),
      );
    }

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code?: string }).code === "SQLITE_ERROR" &&
      error.message.includes("no such table")
    ) {
      console.error(
        "SQLite schema missing. Run npm run db:push first — or " +
        "npm run db:bootstrap to push + seed in one step.",
      );
    }
    throw error;
  }
}

seed()
  .then(() => {
    console.log("Seed completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
