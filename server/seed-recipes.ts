// Seed script for recipes
import { db } from "./db";
import { recipes, recipeOfTheDay } from "@shared/schema";

const sampleRecipes = [
  {
    title: "Proteinsko Smoothie Bowl",
    description: "Osvežavajući i hranjivi smoothie bowl bogat proteinima, savršen za energičan početak dana.",
    imageUrl: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800",
    category: "breakfast",
    prepTime: 10,
    cookTime: 0,
    servings: 1,
    difficulty: "easy",
    calories: 350,
    protein: 25,
    carbs: 45,
    fats: 8,
    ingredients: JSON.stringify([
      { name: "Banana", quantity: 1, unit: "kom" },
      { name: "Whey protein", quantity: 30, unit: "g" },
      { name: "Grč ki jogurt", quantity: 150, unit: "g" },
      { name: "Borovnice", quantity: 50, unit: "g" },
      { name: "Granola", quantity: 30, unit: "g" },
      { name: "Med", quantity: 1, unit: "kašika" },
    ]),
    instructions: JSON.stringify([
      "Stavite bananu, protein i jogurt u blender.",
      "Blendajte dok ne dobijete glatku teksturu.",
      "Sipajte u činiju.",
      "Ukrasite borovnicama, granolom i medom.",
    ]),
    source: "custom",
    sourceId: null,
    dietaryTags: JSON.stringify(["high_protein", "vegetarian"]),
    allergens: JSON.stringify(["dairy"]),
  },
  {
    title: "Piletina sa Povrćem",
    description: "Zdravo i ukusno jelo sa pečenom piletinom i sezonskim povrćem, idealno za ručak.",
    imageUrl: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800",
    category: "lunch",
    prepTime: 15,
    cookTime: 30,
    servings: 2,
    difficulty: "medium",
    calories: 450,
    protein: 40,
    carbs: 35,
    fats: 15,
    ingredients: JSON.stringify([
      { name: "Pileća prsa", quantity: 300, unit: "g" },
      { name: "Brokoli", quantity: 200, unit: "g" },
      { name: "Paprika", quantity: 1, unit: "kom" },
      { name: "Cherry paradajz", quantity: 150, unit: "g" },
      { name: "Maslinovo ulje", quantity: 2, unit: "kašike" },
      { name: "Beli luk", quantity: 2, unit: "čena" },
      { name: "So, biber", quantity: "po ukusu", unit: "" },
    ]),
    instructions: JSON.stringify([
      "Zagrejte rernu na 200°C.",
      "Isite čte piletinu i povrće na kocke.",
      "Pomešajte sa uljem, belim lukom i začinima.",
      "Rasporedite na pleh.",
      "Pecite 25-30 minuta dok piletina ne postane zlatna.",
    ]),
    source: "custom",
    sourceId: null,
    dietaryTags: JSON.stringify(["high_protein", "low_carb"]),
    allergens: JSON.stringify([]),
  },
  {
    title: "Losos sa Avokadom i Quinoa",
    description: "Savršena kombinacija omega-3 masnih kiselina iz lososa i zdravih masti iz avokada.",
    imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800",
    category: "dinner",
    prepTime: 15,
    cookTime: 20,
    servings: 2,
    difficulty: "medium",
    calories: 520,
    protein: 35,
    carbs: 45,
    fats: 22,
    ingredients: JSON.stringify([
      { name: "Losos file", quantity: 200, unit: "g" },
      { name: "Avokado", quantity: 1, unit: "kom" },
      { name: "Quinoa", quantity: 100, unit: "g" },
      { name: "Limun", quantity: 1, unit: "kom" },
      { name: "Maslinovo ulje", quantity: 1, unit: "kašika" },
      { name: "So, biber", quantity: "po ukusu", unit: "" },
    ]),
    instructions: JSON.stringify([
      "Skuvajte quinou prema uputstvu na pakovanju.",
      "Začinite losos sa solju, biberom i limunovim sokom.",
      "Pecite losos na tiganju 4-5 minuta sa svake strane.",
      "Ise čite avokado na kriške.",
      "Servirati sa quinoom i avokadom.",
    ]),
    source: "custom",
    sourceId: null,
    dietaryTags: JSON.stringify(["high_protein", "omega_3"]),
    allergens: JSON.stringify(["fish"]),
  },
  {
    title: "Zobene Palačinke",
    description: "Zdrave i ukusne palačinke od zobenih pahuljica, bez rafinisanog šećera.",
    imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800",
    category: "breakfast",
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    difficulty: "easy",
    calories: 320,
    protein: 18,
    carbs: 42,
    fats: 10,
    ingredients: JSON.stringify([
      { name: "Zobene pahuljice", quantity: 100, unit: "g" },
      { name: "Jaja", quantity: 2, unit: "kom" },
      { name: "Mleko", quantity: 150, unit: "ml" },
      { name: "Banana", quantity: 1, unit: "kom" },
      { name: "Cimet", quantity: 1, unit: "kašičica" },
      { name: "Med ili voće za posluživanje", quantity: "po ukusu", unit: "" },
    ]),
    instructions: JSON.stringify([
      "Sameljite zobene pahuljice u brašno.",
      "Izmešajte sa jajima, mlekom, izmrvljenom bananom i cimetom.",
      "Zagrejte tiganj sa malo ulja.",
      "Sipajte smesu i pecite 2-3 minuta sa svake strane.",
      "Poslužite sa medom ili svežim voćem.",
    ]),
    source: "custom",
    sourceId: null,
    dietaryTags: JSON.stringify(["vegetarian", "whole_grain"]),
    allergens: JSON.stringify(["gluten", "dairy", "eggs"]),
  },
  {
    title: "Čorbast Pasulj",
    description: "Tradicionalno srpsko jelo, bogato proteinima i vlaknima, idealno za hladne dane.",
    imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800",
    category: "lunch",
    prepTime: 15,
    cookTime: 90,
    servings: 4,
    difficulty: "medium",
    calories: 380,
    protein: 22,
    carbs: 55,
    fats: 8,
    ingredients: JSON.stringify([
      { name: "Pasulj", quantity: 300, unit: "g" },
      { name: "Crni luk", quantity: 2, unit: "kom" },
      { name: "Šargarepa", quantity: 2, unit: "kom" },
      { name: "Celer", quantity: 1, unit: "stapka" },
      { name: "Paradajz pire", quantity: 3, unit: "kašike" },
      { name: "Beli luk", quantity: 3, unit: "čena" },
      { name: "Lovorov list", quantity: 2, unit: "kom" },
      { name: "Aleva paprika", quantity: 1, unit: "kašika" },
      { name: "So, biber", quantity: "po ukusu", unit: "" },
    ]),
    instructions: JSON.stringify([
      "Namočite pasulj preko noći.",
      "Prokuvajte pasulj u svežoj vodi 45-60 minuta.",
      "Na ulju propržite luk, šargarepu i celer.",
      "Dodajte paradajz pire i začine.",
      "Sipajte proprženo povrće u pasulj.",
      "Kuvajte još 30 minuta.",
      "Začinite po ukusu i poslužite toplo.",
    ]),
    source: "custom",
    sourceId: null,
    dietaryTags: JSON.stringify(["vegan", "high_fiber", "traditional"]),
    allergens: JSON.stringify([]),
  },
];

async function seedRecipes() {
  console.log("🌱 Seeding recipes...");

  try {
    // Insert recipes
    const insertedRecipes = await db.insert(recipes).values(sampleRecipes).returning();
    console.log(`✅ Inserted ${insertedRecipes.length} recipes`);

    // Set recipe of the day
    if (insertedRecipes.length > 0) {
      const today = new Date().toISOString().split("T")[0];
      await db.insert(recipeOfTheDay).values({
        recipeId: insertedRecipes[2].id, // Losos sa Avokadom
        date: today,
      });
      console.log(`✅ Set recipe of the day: ${insertedRecipes[2].title}`);
    }

    console.log("🎉 Recipes seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding recipes:", error);
    throw error;
  }
}

// Run seeding if called directly
seedRecipes()
  .then(() => {
    console.log("✅ Seeding complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  });

export { seedRecipes };
