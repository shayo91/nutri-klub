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
  saveComingSoonSignup(email: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private testimonials: Testimonial[];
  private blogPosts: BlogPost[];
  private contactMessages: ContactMessage[];
  private subscriptions: Map<string, Subscription>;
  private comingSoonSignups: Array<{ email: string; date: Date }>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.testimonials = [
      {
        id: 1,
        name: "Igor",
        role: "Klijent",
        content: "Iznad svih ocekivanja. Par mjeseci sam saradjivao sa Jelenom i rezultati su impresivni. Profesionalna usluga, konstantna podrska i komunikacija na veoma visokom nivou. Sve preporuke za sve one koji su spremni da izgrade disciplinu, promjene nacin ishrane i budu u odlicnoj formi!",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        rating: 5
      },
      {
        id: 2,
        name: "Dusko",
        role: "Klijent",
        content: "Profesionalnost na najvišem nivou! Detaljno i razumljivim jezikom su mi objašnjeni svi akcioni koraci koje treba da poduzmem kako bi poboljšao svoje zdravlje. Profesionalnost i stručnost osoblja je uočljivo na prvi pogled. Sve preporuke!",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        rating: 5
      },
      {
        id: 3,
        name: "David",
        role: "Klijent",
        content: "Izuzetno sam zadovoljan saradnjom! Pomogli su mi da bolje razumem ishranu i postignem značajne promene. Preporučujem svakome ko želi da poboljša svoje zdravlje i ishranu",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        rating: 5
      },
      {
        id: 4,
        name: "Djole",
        role: "Klijent",
        content: "Sve preporuke za ovaj Nutri Centar. Uz strucno i profesionalno savetovanje mozete rijesiti vase probleme, izgraditi kvalitetnu ishranu i stvoriti dobre zivotne navike. Posveceni su klijentima, imaju dobar program rada i pristupacne cijene. Sve pohvale za Jelenu, uvek prijatna i ljubazna!",
        avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        rating: 5
      },
      {
        id: 5,
        name: "Milena",
        role: "Klijent",
        content: "Jako su ljubazni i posveceni svom poslu. Ako zelite da smrsate javite se na pravo mjesto",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        rating: 5
      },
      {
        id: 6,
        name: "Snjezana",
        role: "Klijent",
        content: "Izuzetno zadovoljna novim jelovnikom i ukupnim radom i podrskom Jelene. Sve pohvale!",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        rating: 5
      },
      {
        id: 7,
        name: "Dragana",
        role: "Klijent",
        content: "Em sto znaju, em.sto imaju pristup osobi. Toplo ih preporucujem!!!",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        rating: 5
      },
      {
        id: 8,
        name: "Jovana",
        role: "Klijent",
        content: "Odlicno iskustvo❤️",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
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
        date: new Date("2023-06-15"),
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
        date: new Date("2023-06-08"),
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
        date: new Date("2023-06-01"),
        slug: "stress-and-nutrition",
        authorId: 1
      }
    ];
    this.contactMessages = [];
    this.subscriptions = new Map();
    this.comingSoonSignups = [];
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
    const newSubscription: Subscription = {
      id,
      email: subscription.email,
      date: new Date(),
      active: true
    };
    this.subscriptions.set(subscription.email, newSubscription);
  }

  async saveComingSoonSignup(email: string): Promise<void> {
    this.comingSoonSignups.push({ email, date: new Date() });
  }
}

export const storage = new MemStorage();
