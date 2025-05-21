import { 
  users, type User, type InsertUser,
  type Testimonial, type BlogPost,
  type ContactMessage, type Subscription
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getTestimonials(): Promise<Testimonial[]>;
  getBlogPosts(): Promise<BlogPost[]>;
  saveContactMessage(message: any): Promise<void>;
  saveSubscription(subscription: { email: string }): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private testimonials: Testimonial[];
  private blogPosts: BlogPost[];
  private contactMessages: ContactMessage[];
  private subscriptions: Map<string, Subscription>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.testimonials = [
      {
        id: 1,
        name: "Sarah Johnson",
        role: "Weight Loss Client",
        content: "Working with Jelena transformed not just my eating habits but my entire relationship with food. I've lost 15kg in 6 months and, most importantly, have kept it off. Her approach is sustainable and life-changing!",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        rating: 5
      },
      {
        id: 2,
        name: "Mark Thompson",
        role: "Sports Performance",
        content: "As an amateur triathlete, I needed a nutrition plan that would fuel my training. Jelena created a perfect balance of nutrients that improved my energy levels and recovery time. My performance has improved dramatically!",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        rating: 5
      },
      {
        id: 3,
        name: "Emily Chen",
        role: "Digestive Health",
        content: "After years of digestive issues, I finally found relief through Jelena's nutrition program. She identified my food sensitivities and created a plan that eliminated my symptoms while still being delicious and varied.",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        rating: 4
      },
      {
        id: 4,
        name: "David Rodriguez",
        role: "Family Nutrition",
        content: "Jelena helped our whole family adopt healthier eating habits. Her kid-friendly approach made the transition easy, and now our children are enthusiastic about eating vegetables! Our energy levels are up and we're all sleeping better.",
        avatar: "https://images.unsplash.com/photo-1546456073-92b9f0a8d413?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        rating: 5
      }
    ];
    this.blogPosts = [
      {
        id: 1,
        title: "Protein-Packed Breakfast Bowl",
        excerpt: "Start your day right with this nutrient-dense breakfast bowl featuring Greek yogurt, berries, and homemade granola.",
        content: "Full recipe and nutrition information here...",
        category: "recipes",
        image: "https://images.unsplash.com/photo-1494859802809-d069c3b71a8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        date: new Date("2023-06-15").toISOString(),
        slug: "protein-packed-breakfast-bowl",
        authorId: 1
      },
      {
        id: 2,
        title: "Understanding Macronutrients",
        excerpt: "Learn about proteins, carbs, and fats - what they do in your body and how to balance them for optimal health.",
        content: "Detailed information about macronutrients...",
        category: "nutrition",
        image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        date: new Date("2023-06-08").toISOString(),
        slug: "understanding-macronutrients",
        authorId: 1
      },
      {
        id: 3,
        title: "How Stress Affects Your Nutrition",
        excerpt: "Discover the intricate relationship between stress and eating patterns, and learn strategies to maintain healthy habits during stressful times.",
        content: "Detailed article about stress and nutrition...",
        category: "wellness",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        date: new Date("2023-06-01").toISOString(),
        slug: "stress-and-nutrition",
        authorId: 1
      }
    ];
    this.contactMessages = [];
    this.subscriptions = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return this.testimonials;
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return this.blogPosts;
  }

  async saveContactMessage(message: any): Promise<void> {
    const id = this.contactMessages.length + 1;
    const newMessage = {
      id,
      name: message.name,
      email: message.email,
      subject: message.subject,
      message: message.message,
      date: new Date(),
      read: false
    };
    this.contactMessages.push(newMessage as ContactMessage);
  }

  async saveSubscription(subscription: { email: string }): Promise<void> {
    const id = this.subscriptions.size + 1;
    const newSubscription = {
      id,
      email: subscription.email,
      date: new Date().toISOString(),
      active: true
    };
    this.subscriptions.set(subscription.email, newSubscription as Subscription);
  }
}

export const storage = new MemStorage();
