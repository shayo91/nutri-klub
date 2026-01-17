/**
 * Spoonacular API Service
 * FREE tier: 150 requests/day
 * Docs: https://spoonacular.com/food-api/docs
 */

interface SpoonacularRecipe {
  id: number;
  title: string;
  image: string;
  imageType: string;
  readyInMinutes: number;
  servings: number;
  summary?: string;
  instructions?: string;
  extendedIngredients?: Array<{
    original: string;
    name: string;
    amount: number;
    unit: string;
  }>;
  nutrition?: {
    nutrients: Array<{
      name: string;
      amount: number;
      unit: string;
    }>;
  };
  diets?: string[];
  cuisines?: string[];
  dishTypes?: string[];
}

export class SpoonacularService {
  private static readonly BASE_URL = "https://api.spoonacular.com";
  private static readonly API_KEY = process.env.SPOONACULAR_API_KEY;

  /**
   * Search recipes by query
   */
  static async searchRecipes(query: string, options: {
    diet?: string;
    intolerances?: string;
    cuisine?: string;
    type?: string;
    maxReadyTime?: number;
    number?: number;
  } = {}): Promise<any[]> {
    if (!this.API_KEY) {
      console.warn("SPOONACULAR_API_KEY not set, skipping Spoonacular search");
      return [];
    }

    try {
      const params = new URLSearchParams({
        apiKey: this.API_KEY,
        query,
        number: (options.number || 10).toString(),
        addRecipeInformation: "true",
        fillIngredients: "true",
      });

      if (options.diet) params.append("diet", options.diet);
      if (options.intolerances) params.append("intolerances", options.intolerances);
      if (options.cuisine) params.append("cuisine", options.cuisine);
      if (options.type) params.append("type", options.type);
      if (options.maxReadyTime) params.append("maxReadyTime", options.maxReadyTime.toString());

      const response = await fetch(
        `${this.BASE_URL}/recipes/complexSearch?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`Spoonacular API error: ${response.status}`);
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error("Spoonacular search error:", error);
      return [];
    }
  }

  /**
   * Get recipe information by ID
   */
  static async getRecipeById(id: number): Promise<SpoonacularRecipe | null> {
    if (!this.API_KEY) {
      console.warn("SPOONACULAR_API_KEY not set");
      return null;
    }

    try {
      const params = new URLSearchParams({
        apiKey: this.API_KEY,
        includeNutrition: "true",
      });

      const response = await fetch(
        `${this.BASE_URL}/recipes/${id}/information?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`Spoonacular API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Spoonacular get recipe error:", error);
      return null;
    }
  }

  /**
   * Get random recipes
   */
  static async getRandomRecipes(options: {
    tags?: string;
    number?: number;
  } = {}): Promise<any[]> {
    if (!this.API_KEY) {
      console.warn("SPOONACULAR_API_KEY not set");
      return [];
    }

    try {
      const params = new URLSearchParams({
        apiKey: this.API_KEY,
        number: (options.number || 5).toString(),
      });

      if (options.tags) params.append("tags", options.tags);

      const response = await fetch(
        `${this.BASE_URL}/recipes/random?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`Spoonacular API error: ${response.status}`);
      }

      const data = await response.json();
      return data.recipes || [];
    } catch (error) {
      console.error("Spoonacular random recipes error:", error);
      return [];
    }
  }

  /**
   * Parse Spoonacular recipe to our format
   */
  static parseRecipe(spoonacularRecipe: any): {
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
    // Extract nutrition
    const nutrition = spoonacularRecipe.nutrition?.nutrients || [];
    const calories = nutrition.find((n: any) => n.name === "Calories")?.amount || 0;
    const protein = nutrition.find((n: any) => n.name === "Protein")?.amount || 0;
    const carbs = nutrition.find((n: any) => n.name === "Carbohydrates")?.amount || 0;
    const fats = nutrition.find((n: any) => n.name === "Fat")?.amount || 0;

    // Parse ingredients
    const ingredients = (spoonacularRecipe.extendedIngredients || []).map((ing: any) => ({
      name: ing.name,
      quantity: ing.amount,
      unit: ing.unit,
    }));

    // Parse instructions
    let instructions: string[] = [];
    if (spoonacularRecipe.analyzedInstructions?.length > 0) {
      instructions = spoonacularRecipe.analyzedInstructions[0].steps.map(
        (step: any) => step.step
      );
    } else if (spoonacularRecipe.instructions) {
      // Simple string instructions
      instructions = [spoonacularRecipe.instructions];
    }

    // Determine category from dish types
    let category = "dinner";
    const dishTypes = spoonacularRecipe.dishTypes || [];
    if (dishTypes.includes("breakfast") || dishTypes.includes("morning meal")) {
      category = "breakfast";
    } else if (dishTypes.includes("lunch") || dishTypes.includes("main course")) {
      category = "lunch";
    } else if (dishTypes.includes("dessert")) {
      category = "dessert";
    } else if (dishTypes.includes("snack") || dishTypes.includes("appetizer")) {
      category = "snack";
    }

    // Determine difficulty (heuristic based on prep time and number of ingredients)
    let difficulty = "medium";
    const prepTime = spoonacularRecipe.readyInMinutes || 30;
    const ingredientCount = ingredients.length;

    if (prepTime <= 20 && ingredientCount <= 5) {
      difficulty = "easy";
    } else if (prepTime > 60 || ingredientCount > 15) {
      difficulty = "hard";
    }

    // Extract dietary tags
    const dietaryTags = spoonacularRecipe.diets || [];

    // Strip HTML from summary
    const description = spoonacularRecipe.summary
      ? spoonacularRecipe.summary.replace(/<[^>]*>/g, "").substring(0, 200)
      : "";

    return {
      title: spoonacularRecipe.title,
      description,
      imageUrl: spoonacularRecipe.image || "",
      category,
      prepTime: Math.round(prepTime * 0.3), // Estimate prep time as 30% of total
      cookTime: Math.round(prepTime * 0.7), // Estimate cook time as 70% of total
      servings: spoonacularRecipe.servings || 2,
      difficulty,
      calories: Math.round(calories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fats: Math.round(fats),
      ingredients: JSON.stringify(ingredients),
      instructions: JSON.stringify(instructions),
      source: "spoonacular",
      sourceId: spoonacularRecipe.id.toString(),
      dietaryTags: JSON.stringify(dietaryTags),
      allergens: JSON.stringify([]), // Would need separate API call for allergens
    };
  }
}
