// PostgreSQL schema for production
import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  role: text("role").notNull().default("free"), // 'free' | 'premium' | 'admin'
  subscriptionStatus: text("subscription_status").default("inactive"), // 'inactive' | 'active' | 'cancelled' | 'expired'
  subscriptionTier: text("subscription_tier"), // 'monthly' | 'yearly'
  subscriptionExpiresAt: timestamp("subscription_expires_at"),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  lastLogin: timestamp("last_login"),
  onboardingCompleted: boolean("onboarding_completed").default(false),
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
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  goal: text("goal"), // 'lose_weight' | 'gain_muscle' | 'maintain' | 'health'
  targetWeight: decimal("target_weight"),
  currentWeight: decimal("current_weight"),
  height: decimal("height"),
  age: integer("age"),
  gender: text("gender"), // 'male' | 'female' | 'other'
  activityLevel: text("activity_level"), // 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  allergies: text("allergies").array(),
  dietaryRestrictions: text("dietary_restrictions").array(),
  dislikedFoods: text("disliked_foods").array(),
  mealPreferences: text("meal_preferences").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;

// Subscriptions table
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // 'premium_monthly' | 'premium_yearly' | 'plan'
  planType: text("plan_type"), // null for premium, 'start' | 'balans' | 'transformacija' for plans
  stripeSubscriptionId: text("stripe_subscription_id"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  status: text("status").notNull(), // 'active' | 'cancelled' | 'expired' | 'pending'
  amountPaid: decimal("amount_paid").notNull(),
  currency: text("currency").default("EUR"),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  purchasedAt: timestamp("purchased_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at"),
  cancelledAt: timestamp("cancelled_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  purchasedAt: true,
});

export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;

// User favorites (linked to recipes table)
export const userFavorites = pgTable("user_favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  recipeId: integer("recipe_id").references(() => recipes.id).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserFavoriteSchema = createInsertSchema(userFavorites).omit({
  id: true,
  createdAt: true,
});

export type InsertUserFavorite = z.infer<typeof insertUserFavoriteSchema>;
export type UserFavorite = typeof userFavorites.$inferSelect;

// Contact messages
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  read: boolean("read").notNull().default(false),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  date: true,
  read: true,
});

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

// Newsletter subscriptions
export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  date: timestamp("date").notNull().defaultNow(),
  active: boolean("active").notNull().default(true),
});

export const insertNewsletterSubscriptionSchema = createInsertSchema(newsletterSubscriptions).omit({
  id: true,
  date: true,
  active: true,
});

export type InsertNewsletterSubscription = z.infer<typeof insertNewsletterSubscriptionSchema>;
export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;

// Usage tracking (rate limiting for Free tier)
export const usageTracking = pgTable("usage_tracking", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  feature: text("feature").notNull(), // 'recipe_view' | 'ai_message' | 'ebook_download'
  count: integer("count").default(0),
  resetDate: timestamp("reset_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUsageTrackingSchema = createInsertSchema(usageTracking).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUsageTracking = z.infer<typeof insertUsageTrackingSchema>;
export type UsageTracking = typeof usageTracking.$inferSelect;

// AI Chat History
export const aiChatHistory = pgTable("ai_chat_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  message: text("message").notNull(),
  response: text("response").notNull(),
  context: jsonb("context"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAiChatHistorySchema = createInsertSchema(aiChatHistory).omit({
  id: true,
  createdAt: true,
});

export type InsertAiChatHistory = z.infer<typeof insertAiChatHistorySchema>;
export type AiChatHistory = typeof aiChatHistory.$inferSelect;

// Referrals
export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: integer("referrer_id").references(() => users.id).notNull(),
  referredId: integer("referred_id").references(() => users.id).notNull(),
  status: text("status").default("pending"), // 'pending' | 'completed'
  rewardGranted: boolean("reward_granted").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertReferralSchema = createInsertSchema(referrals).omit({
  id: true,
  createdAt: true,
});

export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type Referral = typeof referrals.$inferSelect;

// Achievements
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  achievementType: text("achievement_type").notNull(), // 'first_recipe' | '7_day_streak' | 'lost_5kg'
  unlockedAt: timestamp("unlocked_at").notNull().defaultNow(),
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  unlockedAt: true,
});

export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievements.$inferSelect;

// Streaks
export const streaks = pgTable("streaks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  streakType: text("streak_type").notNull(), // 'login' | 'meal_log' | 'water'
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  lastActivity: timestamp("last_activity"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertStreakSchema = createInsertSchema(streaks).omit({
  id: true,
  updatedAt: true,
});

export type InsertStreak = z.infer<typeof insertStreakSchema>;
export type Streak = typeof streaks.$inferSelect;

// Products
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  category: text("category").notNull(),
  image: text("image").notNull(),
  inStock: boolean("in_stock").notNull().default(true),
  featured: boolean("featured").notNull().default(false),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Cart items
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  userId: integer("user_id").references(() => users.id),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull().default(1),
  isGift: boolean("is_gift").notNull().default(false),
  giftMessage: text("gift_message"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
});

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;

// Orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  shippingAddress: text("shipping_address").notNull(),
  totalAmount: integer("total_amount").notNull(),
  status: text("status").notNull().default("pending"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Order items
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(),
  isGift: boolean("is_gift").notNull().default(false),
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
export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
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
  ingredients: jsonb("ingredients"), // Array of {name, quantity, unit}
  instructions: jsonb("instructions"), // Array of steps
  source: text("source"), // 'custom' | 'edamam' | 'spoonacular' | 'themealdb'
  sourceId: text("source_id"), // External API ID
  dietaryTags: text("dietary_tags").array(), // ['vegetarian', 'vegan', 'keto']
  allergens: text("allergens").array(), // ['gluten', 'dairy', 'nuts']
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertRecipeSchema = createInsertSchema(recipes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertRecipe = z.infer<typeof insertRecipeSchema>;
export type Recipe = typeof recipes.$inferSelect;

// Recipe Collections table
export const recipeCollections = pgTable("recipe_collections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertRecipeCollectionSchema = createInsertSchema(recipeCollections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertRecipeCollection = z.infer<typeof insertRecipeCollectionSchema>;
export type RecipeCollection = typeof recipeCollections.$inferSelect;

// Collection Recipes (many-to-many)
export const collectionRecipes = pgTable("collection_recipes", {
  id: serial("id").primaryKey(),
  collectionId: integer("collection_id").references(() => recipeCollections.id).notNull(),
  recipeId: integer("recipe_id").references(() => recipes.id).notNull(),
  order: integer("order").default(0),
  addedAt: timestamp("added_at").defaultNow(),
});

export const insertCollectionRecipeSchema = createInsertSchema(collectionRecipes).omit({
  id: true,
  addedAt: true,
});

export type InsertCollectionRecipe = z.infer<typeof insertCollectionRecipeSchema>;
export type CollectionRecipe = typeof collectionRecipes.$inferSelect;

// Meal Plans table
export const mealPlans = pgTable("meal_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  date: date("date").notNull(), // DATE type
  mealType: text("meal_type").notNull(), // 'breakfast' | 'lunch' | 'dinner' | 'snack'
  recipeId: integer("recipe_id").references(() => recipes.id),
  customMeal: text("custom_meal"), // Ako nije recept iz baze
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMealPlanSchema = createInsertSchema(mealPlans).omit({
  id: true,
  createdAt: true,
});

export type InsertMealPlan = z.infer<typeof insertMealPlanSchema>;
export type MealPlan = typeof mealPlans.$inferSelect;

// Recipe of the Day table
export const recipeOfTheDay = pgTable("recipe_of_the_day", {
  id: serial("id").primaryKey(),
  recipeId: integer("recipe_id").references(() => recipes.id).notNull(),
  date: date("date").notNull().unique(), // DATE type
  createdAt: timestamp("created_at").defaultNow(),
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
export const ebooks = pgTable("ebooks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  author: text("author").default("Jelena Matijaš"),
  category: text("category"), // 'meal_prep' | 'keto' | 'guides' | 'recipes' | 'weight_loss'
  pages: integer("pages"),
  coverImageUrl: text("cover_image_url"),
  pdfUrl: text("pdf_url").notNull(),
  fileSize: integer("file_size"), // u KB
  isPremium: boolean("is_premium").default(true),
  isFeatured: boolean("is_featured").default(false),
  downloadCount: integer("download_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertEbookSchema = createInsertSchema(ebooks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertEbook = z.infer<typeof insertEbookSchema>;
export type Ebook = typeof ebooks.$inferSelect;

// E-book Downloads tracking
export const ebookDownloads = pgTable("ebook_downloads", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  ebookId: integer("ebook_id").references(() => ebooks.id).notNull(),
  downloadedAt: timestamp("downloaded_at").defaultNow(),
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
export const weightTracking = pgTable("weight_tracking", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  date: date("date").notNull(),
  weight: decimal("weight").notNull(),
  notes: text("notes"),
  mood: text("mood"), // 'great' | 'good' | 'okay' | 'bad'
  energyLevel: integer("energy_level"), // 1-5
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWeightTrackingSchema = createInsertSchema(weightTracking).omit({
  id: true,
  createdAt: true,
});

export type InsertWeightTracking = z.infer<typeof insertWeightTrackingSchema>;
export type WeightTracking = typeof weightTracking.$inferSelect;

// Body Measurements
export const bodyMeasurements = pgTable("body_measurements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  date: date("date").notNull(),
  waist: decimal("waist"), // cm
  chest: decimal("chest"),
  hips: decimal("hips"),
  arms: decimal("arms"),
  thighs: decimal("thighs"),
  bodyFat: decimal("body_fat"), // %
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBodyMeasurementsSchema = createInsertSchema(bodyMeasurements).omit({
  id: true,
  createdAt: true,
});

export type InsertBodyMeasurements = z.infer<typeof insertBodyMeasurementsSchema>;
export type BodyMeasurements = typeof bodyMeasurements.$inferSelect;

// Progress Photos
export const progressPhotos = pgTable("progress_photos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  photoUrl: text("photo_url").notNull(),
  photoType: text("photo_type"), // 'front' | 'side' | 'back'
  date: date("date").notNull(),
  weight: decimal("weight"),
  notes: text("notes"),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProgressPhotosSchema = createInsertSchema(progressPhotos).omit({
  id: true,
  createdAt: true,
});

export type InsertProgressPhotos = z.infer<typeof insertProgressPhotosSchema>;
export type ProgressPhotos = typeof progressPhotos.$inferSelect;

// Goals
export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  goalType: text("goal_type").notNull(), // 'weight' | 'body_fat' | 'waist' | 'custom'
  targetValue: decimal("target_value"),
  currentValue: decimal("current_value"),
  startDate: date("start_date"),
  targetDate: date("target_date"),
  status: text("status").default("active"), // 'active' | 'completed' | 'abandoned'
  title: text("title"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertGoalsSchema = createInsertSchema(goals).omit({
  id: true,
  createdAt: true,
});

export type InsertGoals = z.infer<typeof insertGoalsSchema>;
export type Goals = typeof goals.$inferSelect;

// Meal Logs (for tracking daily meals)
export const mealLogs = pgTable("meal_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  date: date("date").notNull(),
  mealType: text("meal_type").notNull(), // 'breakfast' | 'lunch' | 'dinner' | 'snack'
  recipeId: integer("recipe_id").references(() => recipes.id),
  mealName: text("meal_name"),
  calories: integer("calories"),
  protein: integer("protein"),
  carbs: integer("carbs"),
  fats: integer("fats"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMealLogsSchema = createInsertSchema(mealLogs).omit({
  id: true,
  createdAt: true,
});

export type InsertMealLogs = z.infer<typeof insertMealLogsSchema>;
export type MealLogs = typeof mealLogs.$inferSelect;

// Water Intake
export const waterIntake = pgTable("water_intake", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  date: date("date").notNull(),
  amount: integer("amount").notNull(), // ml
  createdAt: timestamp("created_at").defaultNow(),
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
export const subscriptionOrders = pgTable("subscription_orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  orderType: text("order_type").notNull(), // 'premium_monthly' | 'premium_yearly' | 'plan_start' | 'plan_balans' | 'plan_transformacija'
  amount: decimal("amount").notNull(),
  currency: text("currency").default("EUR"),
  status: text("status").default("pending"), // 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded'
  stripeSessionId: text("stripe_session_id"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  stripeCustomerId: text("stripe_customer_id"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertSubscriptionOrdersSchema = createInsertSchema(subscriptionOrders).omit({
  id: true,
  createdAt: true,
});

export type InsertSubscriptionOrders = z.infer<typeof insertSubscriptionOrdersSchema>;
export type SubscriptionOrders = typeof subscriptionOrders.$inferSelect;

// Plan Purchases table (for consultation appointments)
export const planPurchases = pgTable("plan_purchases", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => subscriptionOrders.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  planType: text("plan_type").notNull(), // 'start' | 'balans' | 'transformacija'
  consultationsTotal: integer("consultations_total").notNull(), // 1, 3, 6
  consultationsUsed: integer("consultations_used").default(0),
  startDate: date("start_date"),
  endDate: date("end_date"),
  status: text("status").default("active"), // 'active' | 'completed' | 'cancelled'
  calendlyUrl: text("calendly_url"), // Unique Calendly link for this purchase
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPlanPurchasesSchema = createInsertSchema(planPurchases).omit({
  id: true,
  createdAt: true,
});

export type InsertPlanPurchases = z.infer<typeof insertPlanPurchasesSchema>;
export type PlanPurchases = typeof planPurchases.$inferSelect;

// Consultations table (for tracking appointments)
export const consultations = pgTable("consultations", {
  id: serial("id").primaryKey(),
  planPurchaseId: integer("plan_purchase_id").references(() => planPurchases.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  scheduledDate: timestamp("scheduled_date"),
  duration: integer("duration").default(60), // minutes
  status: text("status").default("scheduled"), // 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
  calendlyEventUri: text("calendly_event_uri"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertConsultationsSchema = createInsertSchema(consultations).omit({
  id: true,
  createdAt: true,
});

export type InsertConsultations = z.infer<typeof insertConsultationsSchema>;
export type Consultations = typeof consultations.$inferSelect;
