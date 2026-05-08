// User Types
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "premium" | "admin";
  subscriptionStatus: string;
  subscriptionTier: string | null;
  subscriptionExpiresAt: string | null;
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface UserPreferences {
  goal?: string;
  currentWeight?: number;
  targetWeight?: number;
  height?: number;
  age?: number;
  gender?: string;
  activityLevel?: string;
  allergies?: string[];
  dietaryRestrictions?: string[];
  dislikedFoods?: string[];
}

// Recipe Types
export interface Recipe {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: "easy" | "medium" | "hard";
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: Ingredient[];
  instructions: string[];
  source: "custom" | "spoonacular" | "themealdb";
  sourceId?: string;
  dietaryTags?: string[];
  allergens?: string[];
  isPremium?: boolean;
  isFavorited?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Ingredient {
  name: string;
  quantity: string | number;
  unit: string;
}

export interface RecipeFilters {
  category?: string;
  difficulty?: string;
  maxPrepTime?: number;
  maxCalories?: number;
  minProtein?: number;
  dietaryTags?: string[];
  allergensFree?: string[];
  search?: string;
}

export interface RecipePagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface RecipeCollection {
  id: number;
  userId: number;
  name: string;
  description?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MealPlan {
  id: number;
  userId: number;
  date: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  recipeId?: number;
  customMeal?: string;
  recipe?: Recipe;
}

// Subscription Types
export interface Subscription {
  status: string;
  tier: string | null;
  expiresAt: string | null;
  trialEndsAt: string | null;
  isActive: boolean;
  isPremium: boolean;
  daysRemaining: number;
}

export interface UsageStats {
  recipe_view: number;
  ai_message: number;
  ebook_download: number;
}

// Blog (marketing site — aligns with BlogSection props / API Markdown shape)
export interface BlogPost {
  id: number | string
  title: string
  excerpt: string
  description?: string
  category: string
  categories?: string[]
  image: string
  author?: string
  date: string
  slug: string
  publishedAt?: string
  readTime?: string
  content?: string
  tags?: string[]
}

// Other Types
export interface Testimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
  image?: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  privacyAgreed: boolean;
}
