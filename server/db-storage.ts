import { db } from "./db";
import { eq, and } from "drizzle-orm";
import { getBlogPosts, getTestimonials, getAnnouncements } from "./notion";
import * as schema from "@shared/schema-sqlite";

const {
  users,
  userPreferences,
  subscriptions,
  userFavorites,
  contactMessages,
  newsletterSubscriptions,
} = schema;

// Type imports from SQLite schema
type User = typeof schema.users.$inferSelect;
type InsertUser = typeof schema.users.$inferInsert;
type UserPreferences = typeof schema.userPreferences.$inferSelect;
type InsertUserPreferences = typeof schema.userPreferences.$inferInsert;
type Subscription = typeof schema.subscriptions.$inferSelect;
type InsertSubscription = typeof schema.subscriptions.$inferInsert;
type UserFavorite = typeof schema.userFavorites.$inferSelect;
type InsertUserFavorite = typeof schema.userFavorites.$inferInsert;
type ContactMessage = typeof schema.contactMessages.$inferSelect;
type InsertContactMessage = typeof schema.contactMessages.$inferInsert;
type NewsletterSubscription = typeof schema.newsletterSubscriptions.$inferSelect;
type InsertNewsletterSubscription = typeof schema.newsletterSubscriptions.$inferInsert;

// Database storage implementation
export class DatabaseStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const result = await db.update(users)
      .set({ ...updates, updatedAt: new Date().toISOString() })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  // User preferences methods
  async getUserPreferences(userId: number): Promise<UserPreferences | undefined> {
    const result = await db.select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);
    return result[0];
  }

  async upsertUserPreferences(prefs: InsertUserPreferences): Promise<UserPreferences> {
    const existing = await this.getUserPreferences(prefs.userId);
    
    if (existing) {
      const result = await db.update(userPreferences)
        .set({ ...prefs, updatedAt: new Date().toISOString() })
        .where(eq(userPreferences.userId, prefs.userId))
        .returning();
      return result[0];
    } else {
      const result = await db.insert(userPreferences).values(prefs).returning();
      return result[0];
    }
  }

  // Subscription methods
  async getSubscriptionByUserId(userId: number): Promise<Subscription[]> {
    return await db.select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId));
  }

  async getActiveSubscription(userId: number, type: string): Promise<Subscription | undefined> {
    const result = await db.select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, userId),
          eq(subscriptions.type, type),
          eq(subscriptions.status, "active")
        )
      )
      .limit(1);
    return result[0];
  }

  async createSubscription(sub: InsertSubscription): Promise<Subscription> {
    const result = await db.insert(subscriptions).values(sub).returning();
    return result[0];
  }

  async updateSubscription(id: number, updates: Partial<Subscription>): Promise<Subscription> {
    const result = await db.update(subscriptions)
      .set(updates)
      .where(eq(subscriptions.id, id))
      .returning();
    return result[0];
  }

  // User favorites methods
  async getUserFavorites(userId: number): Promise<UserFavorite[]> {
    return await db.select()
      .from(userFavorites)
      .where(eq(userFavorites.userId, userId));
  }

  async addFavorite(favorite: InsertUserFavorite): Promise<UserFavorite> {
    const result = await db.insert(userFavorites).values(favorite).returning();
    return result[0];
  }

  async removeFavorite(userId: number, recipeId: string): Promise<void> {
    await db.delete(userFavorites)
      .where(
        and(
          eq(userFavorites.userId, userId),
          eq(userFavorites.recipeId, recipeId)
        )
      );
  }

  // Contact messages methods
  async saveContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const result = await db.insert(contactMessages).values(message).returning();
    return result[0];
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages);
  }

  // Newsletter subscriptions methods
  async saveSubscription(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription> {
    const result = await db.insert(newsletterSubscriptions).values(subscription).returning();
    return result[0];
  }

  // Notion CMS methods - these fetch from Notion
  async getBlogPosts() {
    try {
      return await getBlogPosts();
    } catch (error) {
      console.error("Error fetching blog posts from Notion:", error);
      return [];
    }
  }

  async getTestimonials() {
    try {
      return await getTestimonials();
    } catch (error) {
      console.error("Error fetching testimonials from Notion:", error);
      return [];
    }
  }

  async getAnnouncements() {
    try {
      return await getAnnouncements();
    } catch (error) {
      console.error("Error fetching announcements from Notion:", error);
      return [];
    }
  }
}

export const dbStorage = new DatabaseStorage();
