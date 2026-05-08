import { Router } from "express";
import { RecipeService } from "../services/recipeService";
import { authenticate } from "../middleware/auth";
import { checkSubscription } from "../middleware/checkSubscription";
import { z } from "zod";

const router = Router();

// Validation schemas
const recipeFiltersSchema = z.object({
  category: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  maxPrepTime: z.coerce.number().optional(),
  maxCalories: z.coerce.number().optional(),
  minProtein: z.coerce.number().optional(),
  dietaryTags: z.array(z.string()).optional(),
  allergensFree: z.array(z.string()).optional(),
  search: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(15),
});

const createRecipeSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  imageUrl: z.string().url(),
  category: z.string(),
  prepTime: z.number().min(0),
  cookTime: z.number().min(0),
  servings: z.number().min(1),
  difficulty: z.enum(["easy", "medium", "hard"]),
  calories: z.number().min(0),
  protein: z.number().min(0),
  carbs: z.number().min(0),
  fats: z.number().min(0),
  ingredients: z.array(z.object({
    name: z.string(),
    quantity: z.number(),
    unit: z.string(),
  })),
  instructions: z.array(z.string()),
  dietaryTags: z.array(z.string()).optional(),
  allergens: z.array(z.string()).optional(),
});

/**
 * POST /api/recipes - Create a new recipe (Admin only)
 */
router.post("/", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Only admins can create recipes
    if (req.user.role !== "admin") {
      return res.status(403).json({ 
        error: "Forbidden",
        message: "Only administrators can create recipes" 
      });
    }

    const validatedData = createRecipeSchema.parse(req.body);
    const recipe = await RecipeService.createRecipe(validatedData);

    res.status(201).json({
      message: "Recipe created successfully",
      recipe,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: "Validation error",
        details: error.errors 
      });
    }
    console.error("Create recipe error:", error);
    res.status(500).json({ error: "Failed to create recipe" });
  }
});

/**
 * PUT /api/recipes/:id - Update a recipe (Admin only)
 */
router.put("/:id", authenticate, async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const recipeId = parseInt(req.params.id);
    const validatedData = createRecipeSchema.partial().parse(req.body);
    
    const updated = await RecipeService.updateRecipe(recipeId, validatedData);

    if (!updated) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json({
      message: "Recipe updated successfully",
      recipe: updated,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: "Validation error",
        details: error.errors 
      });
    }
    console.error("Update recipe error:", error);
    res.status(500).json({ error: "Failed to update recipe" });
  }
});

/**
 * DELETE /api/recipes/:id - Delete a recipe (Admin only)
 */
router.delete("/:id", authenticate, async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const recipeId = parseInt(req.params.id);
    await RecipeService.deleteRecipe(recipeId);

    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Delete recipe error:", error);
    res.status(500).json({ error: "Failed to delete recipe" });
  }
});

// Helper function to track recipe views for free users
async function trackRecipeView(userId: number) {
  const { db } = await import("../db");
  const { usageTracking } = await import("@shared/schema-sqlite");
  const { eq, and } = await import("drizzle-orm");

  const today = new Date().toISOString().split("T")[0];

  // Check if there's already a record for today
  const existing = await db
    .select()
    .from(usageTracking)
    .where(
      and(
        eq(usageTracking.userId, userId),
        eq(usageTracking.feature, "recipe_view"),
        eq(usageTracking.resetDate, today)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    // Update existing record
    const newCount = (existing[0].count || 0) + 1;
    await db
      .update(usageTracking)
      .set({
        count: newCount,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(usageTracking.id, existing[0].id));
    
    return newCount;
  } else {
    // Create new record
    await db.insert(usageTracking).values({
      userId: userId,
      feature: "recipe_view",
      count: 1,
      resetDate: today,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    return 1;
  }
}

// Helper function to check user's usage stats
async function checkUserUsage(userId: number) {
  const { db } = await import("../db");
  const { usageTracking } = await import("@shared/schema-sqlite");
  const { eq, and } = await import("drizzle-orm");

  const today = new Date().toISOString().split("T")[0];

  const usage = await db
    .select()
    .from(usageTracking)
    .where(
      and(
        eq(usageTracking.userId, userId),
        eq(usageTracking.feature, "recipe_view"),
        eq(usageTracking.resetDate, today)
      )
    )
    .limit(1);

  return {
    recipeViewCount: usage[0]?.count || 0,
  };
}

/**
 * GET /api/recipes - Get recipes with filters and pagination
 */
router.get("/", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const filters = recipeFiltersSchema.parse(req.query);
    const { page, limit, search, ...recipeFilters } = filters;

    // Check if user is premium
    const isPremium = req.user.role === "premium" || req.user.role === "admin";

    // Free users have limited access to search and filters
    if (!isPremium) {
      // Free users cannot use search or advanced filters
      if (search) {
        return res.status(403).json({
          error: "Search not available",
          message: "Pretraga je dostupna samo za Premium korisnike. Nadogradite svoj nalog!",
          upgradeUrl: "/dashboard/upgrade",
        });
      }

      // Get recipes for free users (no filters, but allow pagination)
      // Note: Limit tracking happens when they view individual recipes, not the list
      const result = await RecipeService.getRecipes({}, { page, limit: 15 });
      
      // Get current usage count to show in UI
      const { recipeViewCount } = await checkUserUsage(req.user.userId);

      return res.json({
        ...result,
        isFree: true,
        recipeViewCount: recipeViewCount,
        remainingViews: Math.max(0, 3 - recipeViewCount),
        hasReachedLimit: recipeViewCount >= 3,
      });
    }

    // Premium users get full access with all filters
    const result = await RecipeService.getRecipes({ search, ...recipeFilters }, { page, limit });

    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error("Get recipes error:", error);
    res.status(500).json({ error: "Failed to get recipes" });
  }
});

/**
 * GET /api/recipes/:id - Get recipe by ID
 */
router.get("/:id", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const recipeId = parseInt(req.params.id);
    const isPremium = req.user.role === "premium" || req.user.role === "admin";

    // For free users, check if they've reached the limit BEFORE viewing
    if (!isPremium) {
      const { recipeViewCount } = await checkUserUsage(req.user.userId);
      
      console.log(`[Recipe View] User ${req.user.userId} - Current count: ${recipeViewCount}`);
      
      if (recipeViewCount >= 3) {
        console.log(`[Recipe View] User ${req.user.userId} - LIMIT REACHED (${recipeViewCount}/3)`);
        return res.status(403).json({
          error: "Recipe limit reached",
          message: "Dostigli ste limit od 3 recepta. Nadogradite na Premium za neograničen pristup!",
          upgradeUrl: "/dashboard/upgrade",
          recipeViewCount,
        });
      }
    }

    const recipe = await RecipeService.getRecipeById(recipeId);

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // Check if favorited
    const isFavorited = await RecipeService.isFavorited(req.user.userId, recipeId);

    // Track the view for free users (only when they open individual recipe)
    if (!isPremium) {
      const newCount = await trackRecipeView(req.user.userId);
      console.log(`[Recipe View] User ${req.user.userId} - Tracked view, new count: ${newCount}`);
    }

    res.json({
      ...recipe,
      isFavorited,
    });
  } catch (error) {
    console.error("Get recipe error:", error);
    res.status(500).json({ error: "Failed to get recipe" });
  }
});

/**
 * DELETE /api/recipes/usage/reset - Reset recipe view tracking (Admin only)
 */
router.delete("/usage/reset", authenticate, async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { db } = await import("../db");
    const { usageTracking } = await import("@shared/schema-sqlite");
    const { eq } = await import("drizzle-orm");

    // Delete all recipe_view tracking
    await db
      .delete(usageTracking)
      .where(eq(usageTracking.feature, "recipe_view"));

    res.json({ 
      message: "Recipe view tracking reset successfully",
      success: true 
    });
  } catch (error) {
    console.error("Reset usage error:", error);
    res.status(500).json({ error: "Failed to reset usage tracking" });
  }
});

/**
 * GET /api/recipes/categories - Get all categories
 */
router.get("/meta/categories", async (req, res) => {
  try {
    const categories = await RecipeService.getCategories();
    res.json({ categories });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ error: "Failed to get categories" });
  }
});

/**
 * POST /api/recipes/search - Search recipes
 */
router.post("/search", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { query, limit = 10 } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    // All users can search recipes
    const results = await RecipeService.searchRecipes(query, limit);
    res.json({ results });
  } catch (error) {
    console.error("Search recipes error:", error);
    res.status(500).json({ error: "Failed to search recipes" });
  }
});

/**
 * GET /api/recipes/daily - Get recipe of the day
 */
router.get("/meta/daily", async (req, res) => {
  try {
    const { date } = req.query;
    const dailyRecipe = await RecipeService.getRecipeOfTheDay(date as string);

    if (!dailyRecipe) {
      return res.status(404).json({ error: "No recipe of the day found" });
    }

    res.json(dailyRecipe);
  } catch (error) {
    console.error("Get daily recipe error:", error);
    res.status(500).json({ error: "Failed to get recipe of the day" });
  }
});

/**
 * POST /api/recipes/:id/favorite - Add recipe to favorites (Premium only)
 */
router.post("/:id/favorite", authenticate, checkSubscription("premium"), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const recipeId = parseInt(req.params.id);
    const result = await RecipeService.addToFavorites(req.user.userId, recipeId);

    if (result.alreadyExists) {
      return res.status(200).json({
        message: "Recipe already in favorites",
        favorite: result.favorite,
      });
    }

    res.status(201).json({
      message: "Recipe added to favorites",
      favorite: result.favorite,
    });
  } catch (error) {
    console.error("Add to favorites error:", error);
    res.status(500).json({ error: "Failed to add to favorites" });
  }
});

/**
 * DELETE /api/recipes/:id/favorite - Remove recipe from favorites
 */
router.delete("/:id/favorite", authenticate, checkSubscription("premium"), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const recipeId = parseInt(req.params.id);
    const success = await RecipeService.removeFromFavorites(req.user.userId, recipeId);

    if (!success) {
      return res.status(404).json({ error: "Favorite not found" });
    }

    res.json({ message: "Recipe removed from favorites" });
  } catch (error) {
    console.error("Remove from favorites error:", error);
    res.status(500).json({ error: "Failed to remove from favorites" });
  }
});

/**
 * GET /api/recipes/favorites - Get user favorites (Premium only)
 */
router.get("/meta/favorites", authenticate, checkSubscription("premium"), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const favorites = await RecipeService.getUserFavorites(req.user.userId);
    res.json({ favorites });
  } catch (error) {
    console.error("Get favorites error:", error);
    res.status(500).json({ error: "Failed to get favorites" });
  }
});

/**
 * GET /api/recipes/collections - Get user collections (Premium only)
 */
router.get("/meta/collections", authenticate, checkSubscription("premium"), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const collections = await RecipeService.getUserCollections(req.user.userId);
    res.json({ collections });
  } catch (error) {
    console.error("Get collections error:", error);
    res.status(500).json({ error: "Failed to get collections" });
  }
});

/**
 * POST /api/recipes/collections - Create collection (Premium only)
 */
router.post("/collections", authenticate, checkSubscription("premium"), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { name, description, isPublic = false } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Collection name is required" });
    }

    const collection = await RecipeService.createCollection(
      req.user.userId,
      name,
      description,
      isPublic
    );

    res.status(201).json({ collection });
  } catch (error) {
    console.error("Create collection error:", error);
    res.status(500).json({ error: "Failed to create collection" });
  }
});

/**
 * POST /api/recipes/collections/:id/recipes - Add recipe to collection
 */
router.post("/collections/:id/recipes", authenticate, checkSubscription("premium"), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const collectionId = parseInt(req.params.id);
    const { recipeId, order = 0 } = req.body;

    if (!recipeId) {
      return res.status(400).json({ error: "Recipe ID is required" });
    }

    const collectionRecipe = await RecipeService.addRecipeToCollection(
      collectionId,
      recipeId,
      order
    );

    res.status(201).json({ collectionRecipe });
  } catch (error) {
    console.error("Add recipe to collection error:", error);
    res.status(500).json({ error: "Failed to add recipe to collection" });
  }
});

/**
 * GET /api/recipes/collections/:id/recipes - Get recipes in collection
 */
router.get("/collections/:id/recipes", authenticate, checkSubscription("premium"), async (req, res) => {
  try {
    const collectionId = parseInt(req.params.id);
    const recipes = await RecipeService.getCollectionRecipes(collectionId);

    res.json({ recipes });
  } catch (error) {
    console.error("Get collection recipes error:", error);
    res.status(500).json({ error: "Failed to get collection recipes" });
  }
});

/**
 * GET /api/recipes/recommendations - Get personalized recommendations (Premium only)
 */
router.get("/meta/recommendations", authenticate, checkSubscription("premium"), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const limit = parseInt(req.query.limit as string) || 10;
    const recommendations = await RecipeService.getRecommendations(req.user.userId, limit);

    res.json({ recommendations });
  } catch (error) {
    console.error("Get recommendations error:", error);
    res.status(500).json({ error: "Failed to get recommendations" });
  }
});

export default router;
