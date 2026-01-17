/**
 * Seed gamification data (badges)
 * Run: npx tsx server/seed-gamification.ts
 */

import { db } from "./db";
import { badgeDefinitions } from "@shared/schema";

const badges = [
  {
    badgeKey: "first_recipe",
    name: "Prvi Recept",
    description: "Sačuvao si svoj prvi recept!",
    icon: "🍳",
    rarity: "common",
    points: 10,
    requirement: JSON.stringify({ type: "recipe_saved", count: 1 }),
    category: "recipes",
  },
  {
    badgeKey: "recipe_master",
    name: "Majstor Recepata",
    description: "Sačuvao si 50 recepata!",
    icon: "👨‍🍳",
    rarity: "epic",
    points: 100,
    requirement: JSON.stringify({ type: "recipe_saved", count: 50 }),
    category: "recipes",
  },
  {
    badgeKey: "streak_7",
    name: "Nedelja Posvećenosti",
    description: "7 dana uzastopnog prijavljivanja!",
    icon: "🔥",
    rarity: "rare",
    points: 50,
    requirement: JSON.stringify({ type: "login_streak", days: 7 }),
    category: "streaks",
  },
  {
    badgeKey: "streak_30",
    name: "Mesec Discipline",
    description: "30 dana uzastopnog prijavljivanja!",
    icon: "💎",
    rarity: "epic",
    points: 200,
    requirement: JSON.stringify({ type: "login_streak", days: 30 }),
    category: "streaks",
  },
  {
    badgeKey: "weight_loss_5kg",
    name: "Prvih 5kg",
    description: "Izgubio si prvih 5kg!",
    icon: "🎯",
    rarity: "rare",
    points: 150,
    requirement: JSON.stringify({ type: "weight_loss", kg: 5 }),
    category: "weight_loss",
  },
  {
    badgeKey: "premium_member",
    name: "Premium Član",
    description: "Postao si Premium član!",
    icon: "👑",
    rarity: "legendary",
    points: 500,
    requirement: JSON.stringify({ type: "subscription", tier: "premium" }),
    category: "membership",
  },
  {
    badgeKey: "ebook_collector",
    name: "Kolekcionar Znanja",
    description: "Preuzeo si 10 e-bookova!",
    icon: "📚",
    rarity: "rare",
    points: 75,
    requirement: JSON.stringify({ type: "ebook_download", count: 10 }),
    category: "ebooks",
  },
  {
    badgeKey: "water_warrior",
    name: "Ratnik Vode",
    description: "7 dana uzastopnog unosa vode!",
    icon: "💧",
    rarity: "rare",
    points: 50,
    requirement: JSON.stringify({ type: "water_streak", days: 7 }),
    category: "streaks",
  },
  {
    badgeKey: "early_bird",
    name: "Rana Ptica",
    description: "Prijavljivao si se pre 7h ujutru 7 dana uzastopno!",
    icon: "🌅",
    rarity: "epic",
    points: 100,
    requirement: JSON.stringify({ type: "early_login", days: 7, before: "07:00" }),
    category: "streaks",
  },
  {
    badgeKey: "ai_enthusiast",
    name: "AI Entuzijasta",
    description: "Postavio si 100 pitanja AI asistentu!",
    icon: "🤖",
    rarity: "rare",
    points: 75,
    requirement: JSON.stringify({ type: "ai_messages", count: 100 }),
    category: "ai",
  },
];

async function seedGamification() {
  console.log("🎮 Seeding gamification data...\n");

  try {
    const insertedBadges = await db.insert(badgeDefinitions).values(badges).returning();

    console.log(`✅ Inserted ${insertedBadges.length} badge definitions:`);
    insertedBadges.forEach((badge) => {
      console.log(`   ${badge.icon} ${badge.name} (${badge.rarity}) - ${badge.points} points`);
    });

    console.log("\n🎉 Gamification data seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding gamification data:", error);
    throw error;
  }
}

seedGamification()
  .then(() => {
    console.log("\n✅ Seeding complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Seeding failed:", error);
    process.exit(1);
  });

export { seedGamification };
