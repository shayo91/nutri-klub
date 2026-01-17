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

/**
 * GET /api/recipes - Get recipes with filters and pagination
 */
router.get("/", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const filters = recipeFiltersSchema.parse(req.query);
    const { page, limit, ...recipeFilters } = filters;

    // Check if user is premium for advanced filters
    const isPremium = req.user.role === "premium" || req.user.role === "admin";

    if (!isPremium) {
      // Free users: limit to 3 recipes total (check usage)
      const { usageStats } = await checkUserUsage(req.user.userId);
      
      if (usageStats.recipe_view >= 3) {
        return res.status(403).json({
          error: "Recipe limit reached",
          message: "You've reached your free trial limit of 3 recipes. Upgrade to Premium for unlimited access!",
          upgradeUrl: "/dashboard/upgrade",
        });
      }

      // Free users get only basic recipes, no filters
      const result = await RecipeService.getRecipes({}, { page: 1, limit: 3 });
      
      // Track usage
      await trackUsage(req.user.userId, "recipe_view");

      return res.json({
        ...result,
        isFree: true,
        remainingViews: 3 - (usageStats.recipe_view + 1),
      });
    }

    // Premium users get full access with filters
    const result = await RecipeService.getRecipes(recipeFilters, { page, limit });

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
    const recipe = await RecipeService.getRecipeById(recipeId);

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // Check if favorited
    const isFavorited = await RecipeService.isFavorited(req.user.userId, recipeId);

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

    // Only premium users can search
    const isPremium = req.user.role === "premium" || req.user.role === "admin";

    if (!isPremium) {
      return res.status(403).json({
        error: "Premium feature",
        message: "Search is only available for Premium members. Upgrade now!",
        upgradeUrl: "/dashboard/upgrade",
      });
    }

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

// Helper functions
async function checkUserUsage(userId: number) {
  const { db } = await import("../db");
  const { usageTracking } = await import("@shared/schema");
  const { eq } = await import("drizzle-orm");

  const usage = await db
    .select()
    .from(usageTracking)
    .where(eq(usageTracking.userId, userId));

  const usageStats: any = {
    recipe_view: 0,
    ai_message: 0,
    ebook_download: 0,
  };

  usage.forEach((u) => {
    usageStats[u.feature] = u.count;
  });

  return { usageStats };
}

async function trackUsage(userId: number, feature: string) {
  const { db } = await import("../db");
  const { usageTracking } = await import("@shared/schema");
  const { eq, and, sql } = await import("drizzle-orm");

  const [existing] = await db
    .select()
    .from(usageTracking)
    .where(and(eq(usageTracking.userId, userId), eq(usageTracking.feature, feature)))
    .limit(1);

  if (existing) {
    await db
      .update(usageTracking)
      .set({ count: sql`${usageTracking.count} + 1` })
      .where(eq(usageTracking.id, existing.id));
  } else {
    await db.insert(usageTracking).values({
      userId,
      feature,
      count: 1,
      resetDate: new Date().toISOString(),
    });
  }
}

export default router;
