/**
 * External Recipe API Routes
 * For searching and importing recipes from external sources
 */

import { Router } from "express";
import { RecipeAggregatorService } from "../services/recipeAggregatorService";
import { SpoonacularService } from "../services/spoonacularService";
import { TheMealDBService } from "../services/themealdbService";
import { authenticate } from "../middleware/auth";

const router = Router();

/**
 * POST /api/recipes-external/search - Search recipes from all sources
 */
router.post("/search", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { query, limit = 20 } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    // Only premium users can search external APIs
    const isPremium = req.user.role === "premium" || req.user.role === "admin";

    if (!isPremium) {
      return res.status(403).json({
        error: "Premium feature",
        message: "External recipe search is only available for Premium members.",
        upgradeUrl: "/dashboard/upgrade",
      });
    }

    const results = await RecipeAggregatorService.searchRecipes(query, limit);

    res.json({
      results,
      count: results.length,
      sources: {
        custom: results.filter((r) => r.source === "custom").length,
        themealdb: results.filter((r) => r.source === "themealdb").length,
        spoonacular: results.filter((r) => r.source === "spoonacular").length,
      },
    });
  } catch (error) {
    console.error("External search error:", error);
    res.status(500).json({ error: "Failed to search recipes" });
  }
});

/**
 * GET /api/recipes-external/random - Get random recipe from any source
 */
router.get("/random", async (req, res) => {
  try {
    const recipe = await RecipeAggregatorService.getRandomRecipe();

    if (!recipe) {
      return res.status(404).json({ error: "No recipe found" });
    }

    res.json(recipe);
  } catch (error) {
    console.error("Random recipe error:", error);
    res.status(500).json({ error: "Failed to get random recipe" });
  }
});

/**
 * POST /api/recipes-external/discover - Import recipes from APIs (Admin only)
 */
router.post("/discover", authenticate, async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { category, count = 10 } = req.body;

    const imported = await RecipeAggregatorService.discoverRecipes({
      category,
      count: Math.min(count, 50), // Max 50 at a time
    });

    res.json({
      message: `Successfully discovered and imported ${imported} new recipes`,
      imported,
    });
  } catch (error) {
    console.error("Discover recipes error:", error);
    res.status(500).json({ error: "Failed to discover recipes" });
  }
});

/**
 * POST /api/recipes-external/cache - Fetch and cache a specific recipe
 */
router.post("/cache", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { source, sourceId } = req.body;

    if (!source || !sourceId) {
      return res.status(400).json({ error: "Source and sourceId are required" });
    }

    if (!["spoonacular", "themealdb"].includes(source)) {
      return res.status(400).json({ error: "Invalid source" });
    }

    const recipe = await RecipeAggregatorService.fetchAndCacheRecipe(source, sourceId);

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json({
      message: "Recipe cached successfully",
      recipe,
    });
  } catch (error) {
    console.error("Cache recipe error:", error);
    res.status(500).json({ error: "Failed to cache recipe" });
  }
});

/**
 * GET /api/recipes-external/sources - Get available recipe sources info
 */
router.get("/sources", async (req, res) => {
  res.json({
    sources: [
      {
        name: "custom",
        displayName: "Nutri Klub Recepti",
        description: "Recepti kreirani od strane nutricioniste Jelene Matijaš",
        free: true,
        unlimited: true,
      },
      {
        name: "themealdb",
        displayName: "TheMealDB",
        description: "Besplatna baza internacionalnih recepata",
        free: true,
        unlimited: true,
        url: "https://www.themealdb.com",
      },
      {
        name: "spoonacular",
        displayName: "Spoonacular",
        description: "Napredna baza recepata sa nutricionističkim podacima",
        free: false,
        dailyLimit: 150,
        url: "https://spoonacular.com",
      },
    ],
  });
});

export default router;
