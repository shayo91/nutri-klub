/**
 * Import recipes from TheMealDB API
 * Usage: npx tsx server/scripts/import-themealdb.ts [count]
 * Example: npx tsx server/scripts/import-themealdb.ts 50
 */

import { db } from "../db";
import { recipes } from "@shared/schema-sqlite";
import { TheMealDBService } from "../services/themealdbService";
import { eq } from "drizzle-orm";

async function importRecipesFromTheMealDB(count: number = 50) {
  console.log(`🚀 Starting import of ${count} recipes from TheMealDB...`);
  
  let imported = 0;
  let skipped = 0;
  let errors = 0;

  try {
    // TheMealDB categories to import from
    const categories = [
      "Chicken",
      "Beef",
      "Seafood",
      "Vegetarian",
      "Pasta",
      "Dessert",
      "Breakfast",
      "Pork",
      "Lamb",
      "Vegan"
    ];

    for (const category of categories) {
      if (imported >= count) break;

      console.log(`\n📂 Fetching recipes from category: ${category}...`);
      
      // Get recipes from this category
      const categoryRecipes = await TheMealDBService.filterByCategory(category);
      console.log(`   Found ${categoryRecipes.length} recipes in ${category}`);

      // Import each recipe
      for (const meal of categoryRecipes) {
        if (imported >= count) break;

        try {
          // Get full recipe details
          const fullRecipe = await TheMealDBService.getRecipeById(meal.idMeal);
          
          if (!fullRecipe) {
            console.log(`   ⚠️  Could not fetch details for ${meal.strMeal}`);
            errors++;
            continue;
          }

          // Check if recipe already exists
          const [existing] = await db
            .select()
            .from(recipes)
            .where(eq(recipes.sourceId, fullRecipe.idMeal))
            .limit(1);

          if (existing) {
            console.log(`   ⏭️  Skipped (already exists): ${fullRecipe.strMeal}`);
            skipped++;
            continue;
          }

          // Parse and insert recipe
          const parsed = TheMealDBService.parseRecipe(fullRecipe);
          
          await db.insert(recipes).values(parsed);
          
          imported++;
          console.log(`   ✅ Imported [${imported}/${count}]: ${fullRecipe.strMeal}`);

          // Small delay to be nice to the API (though TheMealDB is free and doesn't have strict limits)
          await new Promise((resolve) => setTimeout(resolve, 200));

        } catch (error: any) {
          console.error(`   ❌ Error importing ${meal.strMeal}:`, error.message);
          errors++;
        }
      }
    }

    // If we still need more recipes, get random ones
    if (imported < count) {
      console.log(`\n🎲 Fetching random recipes to reach target count...`);
      
      while (imported < count) {
        try {
          const randomRecipe = await TheMealDBService.getRandomRecipe();
          
          if (!randomRecipe) {
            console.log(`   ⚠️  Could not fetch random recipe`);
            errors++;
            continue;
          }

          // Check if recipe already exists
          const [existing] = await db
            .select()
            .from(recipes)
            .where(eq(recipes.sourceId, randomRecipe.idMeal))
            .limit(1);

          if (existing) {
            skipped++;
            continue;
          }

          // Parse and insert recipe
          const parsed = TheMealDBService.parseRecipe(randomRecipe);
          
          await db.insert(recipes).values(parsed);
          
          imported++;
          console.log(`   ✅ Imported [${imported}/${count}]: ${randomRecipe.strMeal}`);

          // Small delay
          await new Promise((resolve) => setTimeout(resolve, 200));

        } catch (error: any) {
          console.error(`   ❌ Error importing random recipe:`, error.message);
          errors++;
        }
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log("📊 Import Summary:");
    console.log("=".repeat(60));
    console.log(`✅ Successfully imported: ${imported} recipes`);
    console.log(`⏭️  Skipped (duplicates): ${skipped} recipes`);
    console.log(`❌ Errors: ${errors}`);
    console.log("=".repeat(60));
    console.log("\n🎉 Import complete!");
    console.log("💡 Tip: You can now edit these recipes in the admin panel at /dashboard/admin/recipes");

  } catch (error) {
    console.error("\n❌ Fatal error during import:", error);
    throw error;
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const count = args[0] ? parseInt(args[0]) : 50;

if (isNaN(count) || count <= 0) {
  console.error("❌ Invalid count. Please provide a positive number.");
  console.log("Usage: npx tsx server/scripts/import-themealdb.ts [count]");
  console.log("Example: npx tsx server/scripts/import-themealdb.ts 50");
  process.exit(1);
}

// Run import
importRecipesFromTheMealDB(count)
  .then(() => {
    console.log("\n✨ All done! Exiting...");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Import failed:", error);
    process.exit(1);
  });
