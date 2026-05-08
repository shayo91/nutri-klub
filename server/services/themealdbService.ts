/**
 * TheMealDB API Service
 * 100% FREE - no API key required
 * Docs: https://www.themealdb.com/api.php
 */

interface MealDBRecipe {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strYoutube?: string;
  strIngredient1?: string;
  strMeasure1?: string;
  // ... up to strIngredient20 and strMeasure20
}

export class TheMealDBService {
  private static readonly BASE_URL = "https://www.themealdb.com/api/json/v1/1";

  /**
   * Search recipes by name
   */
  static async searchByName(query: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/search.php?s=${encodeURIComponent(query)}`);

      if (!response.ok) {
        throw new Error(`TheMealDB API error: ${response.status}`);
      }

      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error("TheMealDB search error:", error);
      return [];
    }
  }

  /**
   * Get recipe by ID
   */
  static async getRecipeById(id: string): Promise<any | null> {
    try {
      const response = await fetch(`${this.BASE_URL}/lookup.php?i=${id}`);

      if (!response.ok) {
        throw new Error(`TheMealDB API error: ${response.status}`);
      }

      const data = await response.json();
      return data.meals?.[0] || null;
    } catch (error) {
      console.error("TheMealDB get recipe error:", error);
      return null;
    }
  }

  /**
   * Get random recipe
   */
  static async getRandomRecipe(): Promise<any | null> {
    try {
      const response = await fetch(`${this.BASE_URL}/random.php`);

      if (!response.ok) {
        throw new Error(`TheMealDB API error: ${response.status}`);
      }

      const data = await response.json();
      return data.meals?.[0] || null;
    } catch (error) {
      console.error("TheMealDB random recipe error:", error);
      return null;
    }
  }

  /**
   * Filter by category
   */
  static async filterByCategory(category: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);

      if (!response.ok) {
        throw new Error(`TheMealDB API error: ${response.status}`);
      }

      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error("TheMealDB filter error:", error);
      return [];
    }
  }

  /**
   * Parse MealDB recipe to our format
   */
  static parseRecipe(mealdbRecipe: any): {
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    prepTime: number;
    cookTime: number;
    servings: number;
    difficulty: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    ingredients: any;
    instructions: any;
    source: string;
    sourceId: string;
    dietaryTags: any;
    allergens: any;
  } {
    // Extract ingredients (MealDB has up to 20 ingredients)
    const ingredients: any[] = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = mealdbRecipe[`strIngredient${i}`];
      const measure = mealdbRecipe[`strMeasure${i}`];

      if (ingredient && ingredient.trim()) {
        ingredients.push({
          name: ingredient.trim(),
          quantity: measure?.trim() || "",
          unit: "",
        });
      }
    }

    // Parse instructions (split by line breaks or periods)
    const instructionsText = mealdbRecipe.strInstructions || "";
    const instructions = instructionsText
      .split(/\r?\n/)
      .filter((line: string) => line.trim().length > 0)
      .map((line: string) => line.trim());

    // Map MealDB category to our categories
    const mealdbCategory = (mealdbRecipe.strCategory || "").toLowerCase();
    let category = "dinner";

    if (mealdbCategory.includes("breakfast")) {
      category = "breakfast";
    } else if (mealdbCategory.includes("dessert")) {
      category = "dessert";
    } else if (mealdbCategory.includes("starter") || mealdbCategory.includes("side")) {
      category = "snack";
    }

    // Estimate prep/cook time (MealDB doesn't provide this)
    const ingredientCount = ingredients.length;
    let totalTime = 30; // default 30 minutes

    if (ingredientCount <= 5) {
      totalTime = 20;
    } else if (ingredientCount > 12) {
      totalTime = 60;
    }

    // Estimate difficulty
    let difficulty = "medium";
    if (ingredientCount <= 5 && totalTime <= 20) {
      difficulty = "easy";
    } else if (ingredientCount > 12 || totalTime > 60) {
      difficulty = "hard";
    }

    // Determine dietary tags based on category and area
    const dietaryTags: string[] = [];
    if (mealdbCategory.includes("vegetarian")) dietaryTags.push("vegetarian");
    if (mealdbCategory.includes("vegan")) dietaryTags.push("vegan");
    if (mealdbCategory.includes("seafood")) dietaryTags.push("pescatarian");

    // Note: MealDB doesn't provide nutrition info, so we estimate
    // based on category and ingredients
    let calories = 400;
    let protein = 20;
    let carbs = 40;
    let fats = 15;

    if (mealdbCategory.includes("dessert")) {
      calories = 350;
      protein = 5;
      carbs = 60;
      fats = 12;
    } else if (mealdbCategory.includes("chicken") || mealdbCategory.includes("beef")) {
      calories = 500;
      protein = 35;
      carbs = 30;
      fats = 20;
    }

    return {
      title: mealdbRecipe.strMeal,
      description: instructionsText.substring(0, 200) + "...",
      imageUrl: mealdbRecipe.strMealThumb || "",
      category,
      prepTime: Math.round(totalTime * 0.3),
      cookTime: Math.round(totalTime * 0.7),
      servings: 4, // MealDB doesn't specify, assume 4
      difficulty,
      calories,
      protein,
      carbs,
      fats,
      ingredients: JSON.stringify(ingredients),
      instructions: JSON.stringify(instructions),
      source: "themealdb",
      sourceId: mealdbRecipe.idMeal,
      dietaryTags: JSON.stringify(dietaryTags),
      allergens: JSON.stringify([]),
    };
  }
}
