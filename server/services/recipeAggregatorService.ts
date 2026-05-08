/**
 * Recipe Aggregator Service
 * Combines recipes from multiple sources (custom DB, Spoonacular, TheMealDB)
 */

import { db } from "../db";
import { recipes } from "@shared/schema-sqlite";
import { SpoonacularService } from "./spoonacularService";
import { TheMealDBService } from "./themealdbService";
import { eq, sql, or } from "drizzle-orm";

export class RecipeAggregatorService {
  /**
   * Search recipes from all sources
   * Priority: Custom DB → TheMealDB (free) → Spoonacular (limited)
   */
  static async searchRecipes(query: string, limit: number = 20): Promise<any[]> {
    const results: any[] = [];

    try {
      // 1. Search in custom database first (instant, no API cost)
      const searchTerm = `%${query.toLowerCase()}%`;
      const dbRecipes = await db
        .select()
        .from(recipes)
        .where(
          or(
            sql`LOWER(${recipes.title}) LIKE ${searchTerm}`,
            sql`LOWER(${recipes.description}) LIKE ${searchTerm}`
          )
        )
        .limit(Math.ceil(limit / 2));

      results.push(...dbRecipes.map((r) => ({ ...r, source: "custom" })));

      // If we have enough results, return early
      if (results.length >= limit) {
        return results.slice(0, limit);
      }

      // 2. Search TheMealDB (100% free, no rate limits)
      const mealdbResults = await TheMealDBService.searchByName(query);
      const mealdbParsed = mealdbResults
        .slice(0, Math.ceil(limit / 3))
        .map((meal) => TheMealDBService.parseRecipe(meal));

      results.push(...mealdbParsed);

      // If we have enough results, return
      if (results.length >= limit) {
        return results.slice(0, limit);
      }

      // 3. Search Spoonacular (150 requests/day limit - use sparingly)
      const spoonacularResults = await SpoonacularService.searchRecipes(query, {
        number: Math.min(5, limit - results.length),
      });

      const spoonacularParsed = spoonacularResults.map((recipe) =>
        SpoonacularService.parseRecipe(recipe)
      );

      results.push(...spoonacularParsed);

      return results.slice(0, limit);
    } catch (error) {
      console.error("Recipe aggregation error:", error);
      return results.slice(0, limit);
    }
  }

  /**
   * Get random recipe from any source
   */
  static async getRandomRecipe(): Promise<any | null> {
    try {
      // Randomly choose source (60% custom, 30% MealDB, 10% Spoonacular)
      const random = Math.random();

      if (random < 0.6) {
        // Custom DB
        const [randomRecipe] = await db
          .select()
          .from(recipes)
          .orderBy(sql`RANDOM()`)
          .limit(1);

        return randomRecipe || null;
      } else if (random < 0.9) {
        // TheMealDB (free)
        const mealdbRecipe = await TheMealDBService.getRandomRecipe();
        return mealdbRecipe ? TheMealDBService.parseRecipe(mealdbRecipe) : null;
      } else {
        // Spoonacular (rare to save API quota)
        const spoonacularRecipes = await SpoonacularService.getRandomRecipes({ number: 1 });
        return spoonacularRecipes[0]
          ? SpoonacularService.parseRecipe(spoonacularRecipes[0])
          : null;
      }
    } catch (error) {
      console.error("Get random recipe error:", error);
      return null;
    }
  }

  /**
   * Fetch and cache recipe from external API
   */
  static async fetchAndCacheRecipe(source: string, sourceId: string): Promise<any | null> {
    try {
      // Check if already cached in DB
      const [cached] = await db
        .select()
        .from(recipes)
        .where(eq(recipes.sourceId, sourceId))
        .limit(1);

      if (cached) {
        return cached;
      }

      // Fetch from API
      let recipeData: any = null;

      if (source === "spoonacular") {
        const spoonacularRecipe = await SpoonacularService.getRecipeById(parseInt(sourceId));
        if (spoonacularRecipe) {
          recipeData = SpoonacularService.parseRecipe(spoonacularRecipe);
        }
      } else if (source === "themealdb") {
        const mealdbRecipe = await TheMealDBService.getRecipeById(sourceId);
        if (mealdbRecipe) {
          recipeData = TheMealDBService.parseRecipe(mealdbRecipe);
        }
      }

      if (!recipeData) {
        return null;
      }

      // Cache in database
      const [cachedRecipe] = await db.insert(recipes).values(recipeData).returning();

      return cachedRecipe;
    } catch (error) {
      console.error("Fetch and cache recipe error:", error);
      return null;
    }
  }

  /**
   * Discover and import new recipes from APIs
   * Run this periodically to populate database
   */
  static async discoverRecipes(options: {
    category?: string;
    count?: number;
  } = {}): Promise<number> {
    const { category, count = 10 } = options;
    let imported = 0;

    try {
      // Import from TheMealDB by category
      if (category) {
        const mealdbRecipes = await TheMealDBService.filterByCategory(category);

        for (const meal of mealdbRecipes.slice(0, count)) {
          const fullRecipe = await TheMealDBService.getRecipeById(meal.idMeal);

          if (fullRecipe) {
            const parsed = TheMealDBService.parseRecipe(fullRecipe);

            // Check if already exists
            const [existing] = await db
              .select()
              .from(recipes)
              .where(eq(recipes.sourceId, fullRecipe.idMeal))
              .limit(1);

            if (!existing) {
              await db.insert(recipes).values(parsed);
              imported++;
            }
          }

          // Small delay to be nice to API
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      // Import random recipes from Spoonacular (use sparingly)
      if (imported < count) {
        const tags = category ? `${category}` : undefined;
        const spoonacularRecipes = await SpoonacularService.getRandomRecipes({
          tags,
          number: Math.min(5, count - imported),
        });

        for (const recipe of spoonacularRecipes) {
          const parsed = SpoonacularService.parseRecipe(recipe);

          // Check if already exists
          const [existing] = await db
            .select()
            .from(recipes)
            .where(eq(recipes.sourceId, recipe.id.toString()))
            .limit(1);

          if (!existing) {
            await db.insert(recipes).values(parsed);
            imported++;
          }
        }
      }

      console.log(`✅ Discovered and imported ${imported} new recipes`);
      return imported;
    } catch (error) {
      console.error("Discover recipes error:", error);
      return imported;
    }
  }
}
