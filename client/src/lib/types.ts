// Common types used across the application

// Contact form data
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  privacyAgreed: boolean;
}

// BMI calculator data
export interface BMIFormData {
  weight: number;
  weightUnit: 'kg' | 'lb';
  height: number;
  heightUnit: 'cm' | 'in';
  age: number;
  gender: 'male' | 'female';
}

export interface BMIResult {
  bmi: number;
  category: string;
  indicatorPosition: number;
  message: string;
}

// Blog post
export interface BlogPost {
  id: number | string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  categories?: string[];
  image: string;
  date: string;
  slug: string;
  author?: {
    name: string;
    avatar?: string;
  };
}

// Testimonial
export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}

// Newsletter subscription
export interface NewsletterSubscription {
  email: string;
}

// User (dashboard/auth)
export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  subscriptionStatus?: string;
  subscriptionTier?: string | null;
  subscriptionExpiresAt?: string | null;
  onboardingCompleted?: boolean;
  createdAt?: string;
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

// Recipe (dashboard)
export interface Recipe {
  id: number;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  category?: string | null;
  prepTime?: number | null;
  cookTime?: number | null;
  servings?: number | null;
  difficulty?: string | null;
  calories?: number | null;
  protein?: number | null;
  carbs?: number | null;
  fats?: number | null;
  ingredients?: unknown;
  instructions?: unknown;
  source?: string | null;
  sourceId?: string | null;
  dietaryTags?: string[] | null;
  allergens?: string[] | null;
  isPremium?: boolean;
  isFavorited?: boolean;
  createdAt?: string;
  updatedAt?: string;
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
  description?: string | null;
  isPublic?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MealPlan {
  id: number;
  userId: number;
  date: string;
  mealType: string;
  recipeId?: number | null;
  customMeal?: string | null;
  recipe?: Recipe;
}

export interface Subscription {
  status: string;
  tier: string | null;
  expiresAt: string | null;
  trialEndsAt?: string | null;
  isActive: boolean;
  isPremium: boolean;
  daysRemaining?: number;
}

export interface UsageStats {
  recipe_view: number;
  ai_message: number;
  ebook_download: number;
}
