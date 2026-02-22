// SQLite-specific schema for local development
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  role: text("role").notNull().default("free"), // 'free' | 'premium' | 'admin'
  subscriptionStatus: text("subscription_status").default("inactive"), // 'inactive' | 'active' | 'cancelled' | 'expired'
  subscriptionTier: text("subscription_tier"), // 'monthly' | 'yearly'
  subscriptionExpiresAt: text("subscription_expires_at"),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
  lastLogin: text("last_login"),
  onboardingCompleted: integer("onboarding_completed", { mode: "boolean" }).default(false),
  referralCode: text("referral_code").unique(),
  referredBy: integer("referred_by"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// User preferences table
export const userPreferences = sqliteTable("user_preferences", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  goal: text("goal"), // 'lose_weight' | 'gain_muscle' | 'maintain' | 'health'
  targetWeight: text("target_weight"), // Using text for decimal in SQLite
  currentWeight: text("current_weight"),
  height: text("height"),
  age: integer("age"),
  gender: text("gender"), // 'male' | 'female' | 'other'
  activityLevel: text("activity_level"), // 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  allergies: text("allergies"), // JSON array stored as text
  dietaryRestrictions: text("dietary_restrictions"), // JSON array
  dislikedFoods: text("disliked_foods"), // JSON array
  mealPreferences: text("meal_preferences"), // JSON array
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;

// Subscriptions table
export const subscriptions = sqliteTable("subscriptions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // 'premium_monthly' | 'premium_yearly' | 'plan'
  planType: text("plan_type"), // null for premium, 'start' | 'balans' | 'transformacija' for plans
  stripeSubscriptionId: text("stripe_subscription_id"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  status: text("status").notNull(), // 'active' | 'cancelled' | 'expired' | 'pending'
  amountPaid: text("amount_paid").notNull(), // Using text for decimal in SQLite
  currency: text("currency").default("EUR"),
  currentPeriodStart: text("current_period_start"),
  currentPeriodEnd: text("current_period_end"),
  cancelAtPeriodEnd: integer("cancel_at_period_end", { mode: "boolean" }).default(false),
  purchasedAt: text("purchased_at").notNull().$defaultFn(() => new Date().toISOString()),
  expiresAt: text("expires_at"),
  cancelledAt: text("cancelled_at"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  purchasedAt: true,
});

export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;

// User favorites (linked to recipes table)
export const userFavorites = sqliteTable("user_favorites", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  recipeId: integer("recipe_id").references(() => recipes.id).notNull(),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const insertUserFavoriteSchema = createInsertSchema(userFavorites).omit({
  id: true,
  createdAt: true,
});

export type InsertUserFavorite = z.infer<typeof insertUserFavoriteSchema>;
export type UserFavorite = typeof userFavorites.$inferSelect;

// Contact messages
export const contactMessages = sqliteTable("contact_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  date: text("date").notNull().$defaultFn(() => new Date().toISOString()),
  read: integer("read", { mode: "boolean" }).notNull().default(false),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  date: true,
  read: true,
});

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

// Newsletter subscriptions
export const newsletterSubscriptions = sqliteTable("newsletter_subscriptions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  date: text("date").notNull().$defaultFn(() => new Date().toISOString()),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
});

export const insertNewsletterSubscriptionSchema = createInsertSchema(newsletterSubscriptions).omit({
  id: true,
  date: true,
  active: true,
});

export type InsertNewsletterSubscription = z.infer<typeof insertNewsletterSubscriptionSchema>;
export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;

// Usage tracking (rate limiting for Free tier)
export const usageTracking = sqliteTable("usage_tracking", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  feature: text("feature").notNull(), // 'recipe_view' | 'ai_message' | 'ebook_download'
  count: integer("count").default(0),
  resetDate: text("reset_date"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const insertUsageTrackingSchema = createInsertSchema(usageTracking).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUsageTracking = z.infer<typeof insertUsageTrackingSchema>;
export type UsageTracking = typeof usageTracking.$inferSelect;

// AI Chat History
export const aiChatHistory = sqliteTable("ai_chat_history", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  message: text("message").notNull(),
  response: text("response").notNull(),
  context: text("context"), // JSON stored as text
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const insertAiChatHistorySchema = createInsertSchema(aiChatHistory).omit({
  id: true,
  createdAt: true,
});

export type InsertAiChatHistory = z.infer<typeof insertAiChatHistorySchema>;
export type AiChatHistory = typeof aiChatHistory.$inferSelect;

// Referrals
export const referrals = sqliteTable("referrals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  referrerId: integer("referrer_id").references(() => users.id).notNull(),
  referredId: integer("referred_id").references(() => users.id).notNull(),
  status: text("status").default("pending"), // 'pending' | 'completed'
  rewardGranted: integer("reward_granted", { mode: "boolean" }).default(false),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const insertReferralSchema = createInsertSchema(referrals).omit({
  id: true,
  createdAt: true,
});

export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type Referral = typeof referrals.$inferSelect;

// Achievements
export const achievements = sqliteTable("achievements", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  achievementType: text("achievement_type").notNull(), // 'first_recipe' | '7_day_streak' | 'lost_5kg'
  unlockedAt: text("unlocked_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  unlockedAt: true,
});

export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievements.$inferSelect;

// Streaks
export const streaks = sqliteTable("streaks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  streakType: text("streak_type").notNull(), // 'login' | 'meal_log' | 'water'
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  lastActivity: text("last_activity"),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const insertStreakSchema = createInsertSchema(streaks).omit({
  id: true,
  updatedAt: true,
});

export type InsertStreak = z.infer<typeof insertStreakSchema>;
export type Streak = typeof streaks.$inferSelect;

// User Points (for gamification)
export const userPoints = sqliteTable("user_points", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  totalPoints: integer("total_points").default(0),
  monthlyPoints: integer("monthly_points").default(0),
  level: integer("level").default(1),
  lastPointsReset: text("last_points_reset"),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const insertUserPointsSchema = createInsertSchema(userPoints).omit({
  id: true,
  updatedAt: true,
});

export type InsertUserPoints = z.infer<typeof insertUserPointsSchema>;
export type UserPoints = typeof userPoints.$inferSelect;

// Points History
export const pointsHistory = sqliteTable("points_history", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  points: integer("points").notNull(),
  action: text("action").notNull(),
  description: text("description"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const insertPointsHistorySchema = createInsertSchema(pointsHistory).omit({
  id: true,
  createdAt: true,
});

export type InsertPointsHistory = z.infer<typeof insertPointsHistorySchema>;
export type PointsHistory = typeof pointsHistory.$inferSelect;

// Badge Definitions
export const badgeDefinitions = sqliteTable("badge_definitions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  badgeKey: text("badge_key").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  rarity: text("rarity").notNull(),
  points: integer("points").default(0),
  requirement: text("requirement"),
  category: text("category"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const insertBadgeDefinitionsSchema = createInsertSchema(badgeDefinitions).omit({
  id: true,
  createdAt: true,
});

export type InsertBadgeDefinitions = z.infer<typeof insertBadgeDefinitionsSchema>;
export type BadgeDefinitions = typeof badgeDefinitions.$inferSelect;

// User Badges
export const userBadges = sqliteTable("user_badges", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  badgeId: integer("badge_id").references(() => badgeDefinitions.id).notNull(),
  earnedAt: text("earned_at").notNull().$defaultFn(() => new Date().toISOString()),
  displayOnProfile: integer("display_on_profile", { mode: "boolean"}).default(true),
});

export const insertUserBadgesSchema = createInsertSchema(userBadges).omit({
  id: true,
  earnedAt: true,
});

export type InsertUserBadges = z.infer<typeof insertUserBadgesSchema>;
export type UserBadges = typeof userBadges.$inferSelect;

// Products
export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  category: text("category").notNull(),
  image: text("image").notNull(),
  inStock: integer("in_stock", { mode: "boolean" }).notNull().default(true),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Cart items
export const cartItems = sqliteTable("cart_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sessionId: text("session_id").notNull(),
  userId: integer("user_id").references(() => users.id),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull().default(1),
  isGift: integer("is_gift", { mode: "boolean" }).notNull().default(false),
  giftMessage: text("gift_message"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
});

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;

// Orders
export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  shippingAddress: text("shipping_address").notNull(),
  totalAmount: integer("total_amount").notNull(),
  status: text("status").notNull().default("pending"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Order items
export const orderItems = sqliteTable("order_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(),
  isGift: integer("is_gift", { mode: "boolean" }).notNull().default(false),
  giftMessage: text("gift_message"),
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
});

export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

// ============================================
// RECIPES FEATURE
// ============================================

// Recipes table
export const recipes = sqliteTable("recipes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  category: text("category"), // 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert'
  prepTime: integer("prep_time"), // u minutima
  cookTime: integer("cook_time"),
  servings: integer("servings"),
  difficulty: text("difficulty"), // 'easy' | 'medium' | 'hard'
  calories: integer("calories"),
  protein: integer("protein"),
  carbs: integer("carbs"),
  fats: integer("fats"),
  ingredients: text("ingredients"), // JSON array stored as text
  instructions: text("instructions"), // JSON array stored as text
  source: text("source"), // 'custom' | 'edamam' | 'spoonacular' | 'themealdb'
  sourceId: text("source_id"), // External API ID
  dietaryTags: text("dietary_tags"), // JSON array ['vegetarian', 'vegan', 'keto']
  allergens: text("allergens"), // JSON array ['gluten', 'dairy', 'nuts']
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const insertRecipeSchema = createInsertSchema(recipes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertRecipe = z.infer<typeof insertRecipeSchema>;
export type Recipe = typeof recipes.$inferSelect;

// Recipe Collections table
export const recipeCollections = sqliteTable("recipe_collections", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  isPublic: integer("is_public", { mode: "boolean" }).default(false),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const insertRecipeCollectionSchema = createInsertSchema(recipeCollections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertRecipeCollection = z.infer<typeof insertRecipeCollectionSchema>;
export type RecipeCollection = typeof recipeCollections.$inferSelect;

// Collection Recipes (many-to-many)
export const collectionRecipes = sqliteTable("collection_recipes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  collectionId: integer("collection_id").references(() => recipeCollections.id).notNull(),
  recipeId: integer("recipe_id").references(() => recipes.id).notNull(),
  order: integer("order").default(0),
  addedAt: text("added_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const insertCollectionRecipeSchema = createInsertSchema(collectionRecipes).omit({
  id: true,
  addedAt: true,
});

export type InsertCollectionRecipe = z.infer<typeof insertCollectionRecipeSchema>;
export type CollectionRecipe = typeof collectionRecipes.$inferSelect;

// Meal Plans table
export const mealPlans = sqliteTable("meal_plans", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  date: text("date").notNull(), // YYYY-MM-DD format
  mealType: text("meal_type").notNull(), // 'breakfast' | 'lunch' | 'dinner' | 'snack'
  recipeId: integer("recipe_id").references(() => recipes.id),
  customMeal: text("custom_meal"), // Ako nije recept iz baze
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const insertMealPlanSchema = createInsertSchema(mealPlans).omit({
  id: true,
  createdAt: true,
});

export type InsertMealPlan = z.infer<typeof insertMealPlanSchema>;
export type MealPlan = typeof mealPlans.$inferSelect;

// Recipe of the Day table
export const recipeOfTheDay = sqliteTable("recipe_of_the_day", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  recipeId: integer("recipe_id").references(() => recipes.id).notNull(),
  date: text("date").notNull().unique(), // YYYY-MM-DD format
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const insertRecipeOfTheDaySchema = createInsertSchema(recipeOfTheDay).omit({
  id: true,
  createdAt: true,
});

export type InsertRecipeOfTheDay = z.infer<typeof insertRecipeOfTheDaySchema>;
export type RecipeOfTheDay = typeof recipeOfTheDay.$inferSelect;

// ============================================
// E-BOOKS FEATURE
// ============================================

// E-books table
export const ebooks = sqliteTable("ebooks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  author: text("author").default("Jelena Matijaš"),
  category: text("category"), // 'meal_prep' | 'keto' | 'guides' | 'recipes' | 'weight_loss'
  pages: integer("pages"),
  coverImageUrl: text("cover_image_url"),
  pdfUrl: text("pdf_url").notNull(),
  fileSize: integer("file_size"), // u KB
  isPremium: integer("is_premium", { mode: "boolean" }).default(true),
  isFeatured: integer("is_featured", { mode: "boolean" }).default(false),
  downloadCount: integer("download_count").default(0),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const insertEbookSchema = createInsertSchema(ebooks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertEbook = z.infer<typeof insertEbookSchema>;
export type Ebook = typeof ebooks.$inferSelect;

// E-book Downloads tracking
export const ebookDownloads = sqliteTable("ebook_downloads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  ebookId: integer("ebook_id").references(() => ebooks.id).notNull(),
  downloadedAt: text("downloaded_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const insertEbookDownloadSchema = createInsertSchema(ebookDownloads).omit({
  id: true,
  downloadedAt: true,
});

export type InsertEbookDownload = z.infer<typeof insertEbookDownloadSchema>;
export type EbookDownload = typeof ebookDownloads.$inferSelect;

// ============================================
// TRACKING & PROGRESS FEATURE
// ============================================

// Weight Tracking
export const weightTracking = sqliteTable("weight_tracking", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  date: text("date").notNull(), // ISO date string
  weight: text("weight").notNull(), // Stored as text for decimal precision
  notes: text("notes"),
  mood: text("mood"), // 'great' | 'good' | 'okay' | 'bad'
  energyLevel: integer("energy_level"), // 1-5
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const insertWeightTrackingSchema = createInsertSchema(weightTracking).omit({
  id: true,
  createdAt: true,
});

export type InsertWeightTracking = z.infer<typeof insertWeightTrackingSchema>;
export type WeightTracking = typeof weightTracking.$inferSelect;

// Body Measurements
export const bodyMeasurements = sqliteTable("body_measurements", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  date: text("date").notNull(),
  waist: text("waist"), // cm
  chest: text("chest"),
  hips: text("hips"),
  arms: text("arms"),
  thighs: text("thighs"),
  bodyFat: text("body_fat"), // %
  notes: text("notes"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const insertBodyMeasurementsSchema = createInsertSchema(bodyMeasurements).omit({
  id: true,
  createdAt: true,
});

export type InsertBodyMeasurements = z.infer<typeof insertBodyMeasurementsSchema>;
export type BodyMeasurements = typeof bodyMeasurements.$inferSelect;

// Progress Photos
export const progressPhotos = sqliteTable("progress_photos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  photoUrl: text("photo_url").notNull(),
  photoType: text("photo_type"), // 'front' | 'side' | 'back'
  date: text("date").notNull(),
  weight: text("weight"),
  notes: text("notes"),
  isPublic: integer("is_public", { mode: "boolean" }).default(false),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const insertProgressPhotosSchema = createInsertSchema(progressPhotos).omit({
  id: true,
  createdAt: true,
});

export type InsertProgressPhotos = z.infer<typeof insertProgressPhotosSchema>;
export type ProgressPhotos = typeof progressPhotos.$inferSelect;

// Goals
export const goals = sqliteTable("goals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  goalType: text("goal_type").notNull(), // 'weight' | 'body_fat' | 'waist' | 'custom'
  targetValue: text("target_value"),
  currentValue: text("current_value"),
  startDate: text("start_date"),
  targetDate: text("target_date"),
  status: text("status").default("active"), // 'active' | 'completed' | 'abandoned'
  title: text("title"),
  description: text("description"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  completedAt: text("completed_at"),
});

export const insertGoalsSchema = createInsertSchema(goals).omit({
  id: true,
  createdAt: true,
});

export type InsertGoals = z.infer<typeof insertGoalsSchema>;
export type Goals = typeof goals.$inferSelect;

// Meal Logs (for tracking daily meals)
export const mealLogs = sqliteTable("meal_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  date: text("date").notNull(),
  mealType: text("meal_type").notNull(), // 'breakfast' | 'lunch' | 'dinner' | 'snack'
  recipeId: integer("recipe_id").references(() => recipes.id),
  mealName: text("meal_name"),
  calories: integer("calories"),
  protein: integer("protein"),
  carbs: integer("carbs"),
  fats: integer("fats"),
  notes: text("notes"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const insertMealLogsSchema = createInsertSchema(mealLogs).omit({
  id: true,
  createdAt: true,
});

export type InsertMealLogs = z.infer<typeof insertMealLogsSchema>;
export type MealLogs = typeof mealLogs.$inferSelect;

// Water Intake
export const waterIntake = sqliteTable("water_intake", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  date: text("date").notNull(),
  amount: integer("amount").notNull(), // ml
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const insertWaterIntakeSchema = createInsertSchema(waterIntake).omit({
  id: true,
  createdAt: true,
});

export type InsertWaterIntake = z.infer<typeof insertWaterIntakeSchema>;
export type WaterIntake = typeof waterIntake.$inferSelect;

// ============================================
// PAYMENTS & SUBSCRIPTIONS FEATURE
// ============================================

// Subscription Orders table
export const subscriptionOrders = sqliteTable("subscription_orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  orderType: text("order_type").notNull(), // 'premium_monthly' | 'premium_yearly' | 'plan_start' | 'plan_balans' | 'plan_transformacija'
  amount: text("amount").notNull(), // Stored as text for decimal precision
  currency: text("currency").default("EUR"),
  status: text("status").default("pending"), // 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded'
  stripeSessionId: text("stripe_session_id"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  stripeCustomerId: text("stripe_customer_id"),
  metadata: text("metadata"), // JSON string
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  completedAt: text("completed_at"),
});

export const insertSubscriptionOrdersSchema = createInsertSchema(subscriptionOrders).omit({
  id: true,
  createdAt: true,
});

export type InsertSubscriptionOrders = z.infer<typeof insertSubscriptionOrdersSchema>;
export type SubscriptionOrders = typeof subscriptionOrders.$inferSelect;

// Plan Purchases table (for consultation appointments)
export const planPurchases = sqliteTable("plan_purchases", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: integer("order_id").references(() => subscriptionOrders.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  planType: text("plan_type").notNull(), // 'start' | 'balans' | 'transformacija'
  consultationsTotal: integer("consultations_total").notNull(), // 1, 3, 6
  consultationsUsed: integer("consultations_used").default(0),
  startDate: text("start_date"),
  endDate: text("end_date"),
  status: text("status").default("active"), // 'active' | 'completed' | 'cancelled'
  calendlyUrl: text("calendly_url"), // Unique Calendly link for this purchase
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const insertPlanPurchasesSchema = createInsertSchema(planPurchases).omit({
  id: true,
  createdAt: true,
});

export type InsertPlanPurchases = z.infer<typeof insertPlanPurchasesSchema>;
export type PlanPurchases = typeof planPurchases.$inferSelect;

// Consultations table (for tracking appointments)
export const consultations = sqliteTable("consultations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  planPurchaseId: integer("plan_purchase_id").references(() => planPurchases.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  scheduledDate: text("scheduled_date"),
  duration: integer("duration").default(60), // minutes
  status: text("status").default("scheduled"), // 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
  calendlyEventUri: text("calendly_event_uri"),
  notes: text("notes"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  completedAt: text("completed_at"),
});

export const insertConsultationsSchema = createInsertSchema(consultations).omit({
  id: true,
  createdAt: true,
});

export type InsertConsultations = z.infer<typeof insertConsultationsSchema>;
export type Consultations = typeof consultations.$inferSelect;

// Personalizovani plan ishrane – nutricionista kreira i dodjeljuje korisniku (vidi u Moj plan)
export const userAssignedPlans = sqliteTable("user_assigned_plans", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  createdBy: integer("created_by").references(() => users.id).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  weekLabel: text("week_label"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const insertUserAssignedPlanSchema = createInsertSchema(userAssignedPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUserAssignedPlan = z.infer<typeof insertUserAssignedPlanSchema>;
export type UserAssignedPlan = typeof userAssignedPlans.$inferSelect;
