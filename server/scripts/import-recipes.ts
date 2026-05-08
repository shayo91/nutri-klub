/**
 * Script to import recipes from external APIs
 * Run: npx tsx server/scripts/import-recipes.ts
 */

import { RecipeAggregatorService } from "../services/recipeAggregatorService";

const CATEGORIES = [
  "Breakfast",
  "Lunch", 
  "Dinner",
  "Dessert",
  "Vegetarian",
  "Seafood",
  "Chicken",
  "Beef",
  "Pasta",
  "Side",
];

async function importRecipes() {
  console.log("🌍 Starting recipe import from external APIs...\n");

  let totalImported = 0;

  for (const category of CATEGORIES) {
    console.log(`📁 Importing ${category} recipes...`);

    try {
      const imported = await RecipeAggregatorService.discoverRecipes({
        category,
        count: 5, // Import 5 recipes per category
      });

      totalImported += imported;
      console.log(`✅ Imported ${imported} ${category} recipes\n`);

      // Delay between categories to respect API rate limits
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`❌ Error importing ${category} recipes:`, error);
    }
  }

  console.log(`\n🎉 Import complete! Total recipes imported: ${totalImported}`);
}

// Run import
importRecipes()
  .then(() => {
    console.log("\n✅ All done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Import failed:", error);
    process.exit(1);
  });
