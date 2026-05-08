/**
 * API Client for Recipe Endpoints
 */

import type { Recipe, RecipeFilters, RecipePagination } from "./types";

export interface RecipesResponse {
  recipes: Recipe[];
  pagination: RecipePagination;
  remainingViews?: number;
  isFree?: boolean;
}

export class RecipeAPI {
  private static baseUrl = "/api/recipes";

  /**
   * Get recipes with filters and pagination
   */
  static async getRecipes(
    filters: RecipeFilters = {},
    page: number = 1,
    limit: number = 15
  ): Promise<RecipesResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== "") {
          acc[key] = Array.isArray(value) ? value.join(",") : value.toString();
        }
        return acc;
      }, {} as Record<string, string>),
    });

    const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch recipes");
    }

    return await response.json();
  }

  /**
   * Get recipe by ID
   */
  static async getRecipeById(id: number): Promise<Recipe> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch recipe");
    }

    return await response.json();
  }

  /**
   * Search recipes (Premium only)
   */
  static async searchRecipes(query: string, limit: number = 10): Promise<Recipe[]> {
    const response = await fetch(`${this.baseUrl}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ query, limit }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to search recipes");
    }

    const data = await response.json();
    return data.results;
  }

  /**
   * Get recipe of the day
   */
  static async getRecipeOfTheDay(date?: string): Promise<Recipe> {
    const url = date ? `${this.baseUrl}/meta/daily?date=${date}` : `${this.baseUrl}/meta/daily`;
    
    const response = await fetch(url, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch recipe of the day");
    }

    return await response.json();
  }

  /**
   * Toggle favorite status
   */
  static async toggleFavorite(recipeId: number, isFavorited: boolean): Promise<void> {
    const method = isFavorited ? "DELETE" : "POST";
    
    const response = await fetch(`${this.baseUrl}/${recipeId}/favorite`, {
      method,
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to toggle favorite");
    }
  }

  /**
   * Get user favorites (Premium only)
   */
  static async getFavorites(): Promise<Recipe[]> {
    const response = await fetch(`${this.baseUrl}/meta/favorites`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch favorites");
    }

    const data = await response.json();
    return data.favorites;
  }

  /**
   * Get recipe categories
   */
  static async getCategories(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/meta/categories`);

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const data = await response.json();
    return data.categories;
  }

  /**
   * Get personalized recommendations (Premium only)
   */
  static async getRecommendations(limit: number = 10): Promise<Recipe[]> {
    const response = await fetch(`${this.baseUrl}/meta/recommendations?limit=${limit}`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch recommendations");
    }

    const data = await response.json();
    return data.recommendations;
  }
}
