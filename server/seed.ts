import "dotenv/config";
import { db } from "./db";
import * as schema from "@shared/schema-sqlite";
import bcrypt from "bcrypt";

const { users, userPreferences, newsletterSubscriptions } = schema;

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Create a test user (optional - for development)
    const hashedPassword = await bcrypt.hash("test123", 10);
    
    const [testUser] = await db.insert(users).values({
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      passwordHash: hashedPassword,
      role: "free",
      subscriptionStatus: "inactive",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }).returning();

    console.log("✅ Created test user:", testUser.email);

    // Create user preferences for test user
    if (testUser) {
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
    }

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
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
