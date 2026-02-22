/**
 * Import recipes from TheMealDB API (free, no API key)
 * Usage: npx tsx server/scripts/import-themealdb.ts [count]
 * Example: npx tsx server/scripts/import-themealdb.ts 50
 */

import { db } from "../db";
import { recipes } from "@shared/schema-sqlite";
import { TheMealDBService } from "../services/themealdbService";
import { eq } from "drizzle-orm";

async function importRecipesFromTheMealDB(count: number = 50) {
  console.log(`Starting import of ${count} recipes from TheMealDB...`);

  let imported = 0;
  let skipped = 0;
  let errors = 0;

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
    "Vegan",
  ];

  try {
    for (const category of categories) {
      if (imported >= count) break;

      console.log(`\nFetching recipes from category: ${category}...`);
      const categoryRecipes = await TheMealDBService.filterByCategory(category);
      console.log(`   Found ${categoryRecipes.length} recipes in ${category}`);

      for (const meal of categoryRecipes) {
        if (imported >= count) break;

        try {
          const fullRecipe = await TheMealDBService.getRecipeById(meal.idMeal);
          if (!fullRecipe) {
            errors++;
            continue;
          }

          const [existing] = await db
            .select()
            .from(recipes)
            .where(eq(recipes.sourceId, fullRecipe.idMeal))
            .limit(1);

          if (existing) {
            skipped++;
            continue;
          }

          const parsed = TheMealDBService.parseRecipe(fullRecipe);
          await db.insert(recipes).values(parsed);
          imported++;
          console.log(`   Imported [${imported}/${count}]: ${fullRecipe.strMeal}`);

          await new Promise((resolve) => setTimeout(resolve, 200));
        } catch (err: unknown) {
          console.error(`   Error importing ${meal.strMeal}:`, (err as Error).message);
          errors++;
        }
      }
    }

    if (imported < count) {
      console.log("\nFetching random recipes to reach target...");
      while (imported < count) {
        try {
          const randomRecipe = await TheMealDBService.getRandomRecipe();
          if (!randomRecipe) {
            errors++;
            continue;
          }

          const [existing] = await db
            .select()
            .from(recipes)
            .where(eq(recipes.sourceId, randomRecipe.idMeal))
            .limit(1);

          if (existing) {
            skipped++;
            continue;
          }

          const parsed = TheMealDBService.parseRecipe(randomRecipe);
          await db.insert(recipes).values(parsed);
          imported++;
          console.log(`   Imported [${imported}/${count}]: ${randomRecipe.strMeal}`);

          await new Promise((resolve) => setTimeout(resolve, 200));
        } catch (err: unknown) {
          console.error("   Error importing random recipe:", (err as Error).message);
          errors++;
        }
      }
    }

    console.log("\nImport Summary:");
    console.log(`   Imported: ${imported}`);
    console.log(`   Skipped (duplicates): ${skipped}`);
    console.log(`   Errors: ${errors}`);
    console.log("\nImport complete.");
  } catch (error) {
    console.error("Fatal error during import:", error);
    throw error;
  }
}

const args = process.argv.slice(2);
const count = args[0] ? parseInt(args[0], 10) : 50;

if (isNaN(count) || count <= 0) {
  console.error("Invalid count. Usage: npx tsx server/scripts/import-themealdb.ts [count]");
  process.exit(1);
}

importRecipesFromTheMealDB(count)
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
