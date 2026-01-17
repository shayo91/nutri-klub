import { db } from "../db";
import { recipes, userFavorites, recipeCollections, collectionRecipes, mealPlans, recipeOfTheDay } from "@shared/schema";
import { eq, and, sql, desc, or, inArray } from "drizzle-orm";

interface RecipeFilters {
  category?: string;
  difficulty?: string;
  maxPrepTime?: number;
  maxCalories?: number;
  minProtein?: number;
  dietaryTags?: string[];
  allergensFree?: string[];
  search?: string;
}

interface PaginationOptions {
  page: number;
  limit: number;
}

export class RecipeService {
  /**
   * Get paginated recipes with filters
   */
  static async getRecipes(
    filters: RecipeFilters = {},
    pagination: PaginationOptions = { page: 1, limit: 15 }
  ) {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    // Build WHERE conditions
    const conditions: any[] = [];

    if (filters.category) {
      conditions.push(eq(recipes.category, filters.category));
    }

    if (filters.difficulty) {
      conditions.push(eq(recipes.difficulty, filters.difficulty));
    }

    if (filters.maxPrepTime) {
      conditions.push(sql`${recipes.prepTime} <= ${filters.maxPrepTime}`);
    }

    if (filters.maxCalories) {
      conditions.push(sql`${recipes.calories} <= ${filters.maxCalories}`);
    }

    if (filters.minProtein) {
      conditions.push(sql`${recipes.protein} >= ${filters.minProtein}`);
    }

    if (filters.search) {
      // Use LIKE with LOWER for SQLite compatibility
      const searchTerm = `%${filters.search.toLowerCase()}%`;
      conditions.push(
        or(
          sql`LOWER(${recipes.title}) LIKE ${searchTerm}`,
          sql`LOWER(${recipes.description}) LIKE ${searchTerm}`
        )
      );
    }

    // Get recipes
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [recipesList, totalCountResult] = await Promise.all([
      db
        .select()
        .from(recipes)
        .where(whereClause)
        .orderBy(desc(recipes.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(recipes)
        .where(whereClause),
    ]);

    const totalCount = Number(totalCountResult[0]?.count || 0);
    const totalPages = Math.ceil(totalCount / limit);

    return {
      recipes: recipesList,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  /**
   * Get recipe by ID
   */
  static async getRecipeById(id: number) {
    const [recipe] = await db
      .select()
      .from(recipes)
      .where(eq(recipes.id, id))
      .limit(1);

    return recipe;
  }

  /**
   * Get recipe categories
   */
  static async getCategories() {
    const categories = await db
      .selectDistinct({ category: recipes.category })
      .from(recipes)
      .where(sql`${recipes.category} IS NOT NULL`);

    return categories.map((c) => c.category).filter(Boolean);
  }

  /**
   * Search recipes
   */
  static async searchRecipes(query: string, limit: number = 10) {
    const results = await db
      .select()
      .from(recipes)
      .where(
        or(
          ilike(recipes.title, `%${query}%`),
          ilike(recipes.description, `%${query}%`)
        )
      )
      .limit(limit);

    return results;
  }

  /**
   * Get user favorites
   */
  static async getUserFavorites(userId: number) {
    const favorites = await db
      .select({
        favoriteId: userFavorites.id,
        recipeId: recipes.id,
        title: recipes.title,
        description: recipes.description,
        imageUrl: recipes.imageUrl,
        category: recipes.category,
        prepTime: recipes.prepTime,
        calories: recipes.calories,
        createdAt: userFavorites.createdAt,
      })
      .from(userFavorites)
      .innerJoin(recipes, eq(userFavorites.recipeId, recipes.id))
      .where(eq(userFavorites.userId, userId))
      .orderBy(desc(userFavorites.createdAt));

    return favorites;
  }

  /**
   * Add recipe to favorites
   */
  static async addToFavorites(userId: number, recipeId: number) {
    // Check if already favorited
    const [existing] = await db
      .select()
      .from(userFavorites)
      .where(
        and(
          eq(userFavorites.userId, userId),
          eq(userFavorites.recipeId, recipeId)
        )
      )
      .limit(1);

    if (existing) {
      return { alreadyExists: true, favorite: existing };
    }

    const [favorite] = await db
      .insert(userFavorites)
      .values({ userId, recipeId })
      .returning();

    return { alreadyExists: false, favorite };
  }

  /**
   * Remove recipe from favorites
   */
  static async removeFromFavorites(userId: number, recipeId: number) {
    const deleted = await db
      .delete(userFavorites)
      .where(
        and(
          eq(userFavorites.userId, userId),
          eq(userFavorites.recipeId, recipeId)
        )
      )
      .returning();

    return deleted.length > 0;
  }

  /**
   * Check if recipe is favorited by user
   */
  static async isFavorited(userId: number, recipeId: number) {
    const [favorite] = await db
      .select()
      .from(userFavorites)
      .where(
        and(
          eq(userFavorites.userId, userId),
          eq(userFavorites.recipeId, recipeId)
        )
      )
      .limit(1);

    return !!favorite;
  }

  /**
   * Get user collections
   */
  static async getUserCollections(userId: number) {
    const collections = await db
      .select()
      .from(recipeCollections)
      .where(eq(recipeCollections.userId, userId))
      .orderBy(desc(recipeCollections.createdAt));

    return collections;
  }

  /**
   * Create collection
   */
  static async createCollection(
    userId: number,
    name: string,
    description?: string,
    isPublic: boolean = false
  ) {
    const [collection] = await db
      .insert(recipeCollections)
      .values({ userId, name, description, isPublic })
      .returning();

    return collection;
  }

  /**
   * Add recipe to collection
   */
  static async addRecipeToCollection(collectionId: number, recipeId: number, order: number = 0) {
    const [collectionRecipe] = await db
      .insert(collectionRecipes)
      .values({ collectionId, recipeId, order })
      .returning();

    return collectionRecipe;
  }

  /**
   * Get recipes in collection
   */
  static async getCollectionRecipes(collectionId: number) {
    const collectionRecipesList = await db
      .select({
        collectionRecipeId: collectionRecipes.id,
        order: collectionRecipes.order,
        recipeId: recipes.id,
        title: recipes.title,
        description: recipes.description,
        imageUrl: recipes.imageUrl,
        category: recipes.category,
        prepTime: recipes.prepTime,
        calories: recipes.calories,
      })
      .from(collectionRecipes)
      .innerJoin(recipes, eq(collectionRecipes.recipeId, recipes.id))
      .where(eq(collectionRecipes.collectionId, collectionId))
      .orderBy(collectionRecipes.order);

    return collectionRecipesList;
  }

  /**
   * Get recipe of the day
   */
  static async getRecipeOfTheDay(date?: string) {
    const targetDate = date || new Date().toISOString().split("T")[0];

    const [dailyRecipe] = await db
      .select({
        id: recipeOfTheDay.id,
        date: recipeOfTheDay.date,
        recipeId: recipes.id,
        title: recipes.title,
        description: recipes.description,
        imageUrl: recipes.imageUrl,
        category: recipes.category,
        prepTime: recipes.prepTime,
        cookTime: recipes.cookTime,
        servings: recipes.servings,
        difficulty: recipes.difficulty,
        calories: recipes.calories,
        protein: recipes.protein,
        carbs: recipes.carbs,
        fats: recipes.fats,
        ingredients: recipes.ingredients,
        instructions: recipes.instructions,
      })
      .from(recipeOfTheDay)
      .innerJoin(recipes, eq(recipeOfTheDay.recipeId, recipes.id))
      .where(eq(recipeOfTheDay.date, targetDate))
      .limit(1);

    return dailyRecipe;
  }

  /**
   * Set recipe of the day
   */
  static async setRecipeOfTheDay(recipeId: number, date?: string) {
    const targetDate = date || new Date().toISOString().split("T")[0];

    // Delete existing if any
    await db.delete(recipeOfTheDay).where(eq(recipeOfTheDay.date, targetDate));

    const [dailyRecipe] = await db
      .insert(recipeOfTheDay)
      .values({ recipeId, date: targetDate })
      .returning();

    return dailyRecipe;
  }

  /**
   * Get meal plan for user
   */
  static async getMealPlan(userId: number, startDate: string, endDate: string) {
    const plan = await db
      .select({
        id: mealPlans.id,
        date: mealPlans.date,
        mealType: mealPlans.mealType,
        customMeal: mealPlans.customMeal,
        recipeId: recipes.id,
        recipeTitle: recipes.title,
        recipeImage: recipes.imageUrl,
        recipeCalories: recipes.calories,
        recipePrepTime: recipes.prepTime,
      })
      .from(mealPlans)
      .leftJoin(recipes, eq(mealPlans.recipeId, recipes.id))
      .where(
        and(
          eq(mealPlans.userId, userId),
          sql`${mealPlans.date} >= ${startDate}`,
          sql`${mealPlans.date} <= ${endDate}`
        )
      )
      .orderBy(mealPlans.date, mealPlans.mealType);

    return plan;
  }

  /**
   * Add meal to plan
   */
  static async addMealToPlan(
    userId: number,
    date: string,
    mealType: string,
    recipeId?: number,
    customMeal?: string
  ) {
    const [meal] = await db
      .insert(mealPlans)
      .values({ userId, date, mealType, recipeId, customMeal })
      .returning();

    return meal;
  }

  /**
   * Remove meal from plan
   */
  static async removeMealFromPlan(id: number, userId: number) {
    const deleted = await db
      .delete(mealPlans)
      .where(and(eq(mealPlans.id, id), eq(mealPlans.userId, userId)))
      .returning();

    return deleted.length > 0;
  }

  /**
   * Get personalized recipe recommendations
   */
  static async getRecommendations(userId: number, limit: number = 10) {
    // Get user preferences
    const [userPrefs] = await db
      .select()
      .from(sql`user_preferences`)
      .where(sql`user_id = ${userId}`)
      .limit(1);

    // For now, return random recipes
    // TODO: Implement ML-based recommendations based on preferences, favorites, and meal history
    const recommendations = await db
      .select()
      .from(recipes)
      .orderBy(sql`RANDOM()`)
      .limit(limit);

    return recommendations;
  }
}
