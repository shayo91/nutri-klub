/**
 * Seed test users for development
 * Run: npx tsx server/seed-users.ts
 */

import { db } from "./db";
import { users } from "@shared/schema";
import { hashPassword } from "./utils/password";

const testUsers = [
  {
    email: "test@example.com",
    password: "password123",
    firstName: "Test",
    lastName: "User",
    role: "user",
    subscriptionStatus: "trial",
    subscriptionTier: null,
    onboardingCompleted: false,
  },
  {
    email: "premium@example.com",
    password: "password123",
    firstName: "Premium",
    lastName: "User",
    role: "premium",
    subscriptionStatus: "active",
    subscriptionTier: "yearly",
    subscriptionExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
    onboardingCompleted: true,
  },
  {
    email: "admin@example.com",
    password: "admin123",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    subscriptionStatus: "active",
    subscriptionTier: null,
    onboardingCompleted: true,
  },
];

async function seedUsers() {
  console.log("👤 Seeding test users...\n");

  try {
    for (const userData of testUsers) {
      const hashedPassword = await hashPassword(userData.password);
      const { password, ...userDataWithoutPassword } = userData;
      
      const [user] = await db
        .insert(users)
        .values({
          ...userDataWithoutPassword,
          passwordHash: hashedPassword,
        })
        .returning();

      console.log(`✅ Created user: ${userData.email} (${userData.role})`);
      console.log(`   Password: ${password}`);
      console.log(`   Name: ${userData.firstName} ${userData.lastName}\n`);
    }

    console.log("🎉 Users seeded successfully!\n");
    console.log("📋 Login credentials:");
    console.log("   Free user:    test@example.com / password123");
    console.log("   Premium user: premium@example.com / password123");
    console.log("   Admin user:   admin@example.com / admin123");
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    throw error;
  }
}

// Run seeding
seedUsers()
  .then(() => {
    console.log("\n✅ Seeding complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Seeding failed:", error);
    process.exit(1);
  });

export { seedUsers };
