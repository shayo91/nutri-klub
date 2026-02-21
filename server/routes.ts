import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { sendContactEmail, sendComingSoonNotification, sendNewsletterNotification } from "./email.js";
import { getBlogPosts, getBlogPostById, getBlogPostBySlug, getTestimonials, getAnnouncements, getVideos, getPodcasts, getSocialMedia, toUrlSlug } from "./notion.js";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get(["/robots.txt", "/api/robots.txt"], (_req, res) => {
    res.type("text/plain").send(`User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://nutricionistajelena.ba/sitemap.xml
`);
  });

  const sitemapHandler = async (_req: any, res: any) => {
    let blogUrls = "";
    try {
      const result = await getBlogPosts();
      if (result.posts) {
        blogUrls = result.posts.map((post: any) => `  <url>
    <loc>https://nutricionistajelena.ba/clanci/${post.slug}</loc>${post.date ? `\n    <lastmod>${post.date}</lastmod>` : ''}
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join("\n");
      }
    } catch (e) {}

    const today = new Date().toISOString().split('T')[0];
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://nutricionistajelena.ba/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://nutricionistajelena.ba/o-meni</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://nutricionistajelena.ba/pravila-privatnosti</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://nutricionistajelena.ba/uslovi-poslovanja</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://nutricionistajelena.ba/kolacici</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
${blogUrls}
</urlset>`;
    res.type("application/xml").send(sitemap);
  };
  app.get(["/sitemap.xml", "/api/sitemap.xml"], sitemapHandler);

  // API Routes
  
  // Get blog posts from Notion
  app.get("/api/blog-posts", async (req, res) => {
    try {
      const result = await getBlogPosts();
      res.set("Cache-Control", "public, max-age=300");
      res.json(result);
    } catch (error) {
      console.error("Error fetching blog posts from Notion:", error);
      // Fallback to storage if Notion fails
      const posts = await storage.getBlogPosts();
      res.json({ posts, categories: [] });
    }
  });

  // Fallback blog posts (must match BlogSection fallbackPosts slugs exactly)
  const FALLBACK_BLOG_POSTS: Record<string, { id: string; title: string; excerpt: string; category: string; image: string; date: string; slug: string; author: { name: string }; content: any[] }> = {
    "supermoc-napraviti-od-nicega-rucak": {
      id: "fallback-1",
      title: "Supermoć: napraviti od ničega ručak",
      excerpt: "Kažu da nisu svi heroji u plaštovima. Neki nose kecelju, u jednoj ruci drže varjaču.",
      category: "Recepti",
      image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      date: "2025-05-27",
      slug: "supermoc-napraviti-od-nicega-rucak",
      author: { name: "NutriHub Team" },
      content: [{ id: "1", type: "paragraph", content: [{ text: "Sadržaj članka će uskoro biti dostupan." }] }],
    },
    "razumijevanje-makronutrijenata": {
      id: "fallback-2",
      title: "Razumijevanje makronutrijenata",
      excerpt: "Saznajte o proteinima, ugljenim hidratima i mastima - šta rade u vašem tijelu i kako ih balansirati za optimalno zdravlje.",
      category: "Savjeti",
      image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      date: "2023-06-08",
      slug: "razumijevanje-makronutrijenata",
      author: { name: "NutriHub Team" },
      content: [{ id: "1", type: "paragraph", content: [{ text: "Sadržaj članka će uskoro biti dostupan." }] }],
    },
    "stres-i-ishrana": {
      id: "fallback-3",
      title: "Kako stres utiče na vašu ishranu",
      excerpt: "Otkrijte složenu vezu između stresa i obrazaca ishrane, i naučite strategije za održavanje zdravih navika tokom stresnih trenutaka.",
      category: "Zdravlje",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      date: "2023-06-01",
      slug: "stres-i-ishrana",
      author: { name: "NutriHub Team" },
      content: [{ id: "1", type: "paragraph", content: [{ text: "Sadržaj članka će uskoro biti dostupan." }] }],
    },
  };

  function textToContentBlocks(text: string) {
    return [{ id: "main", type: "paragraph", content: [{ text }] }];
  }

  // Get single blog post by slug (must be before :id route)
  app.get("/api/blog-posts/by-slug/:slug", async (req, res) => {
    try {
      const slug = decodeURIComponent(req.params.slug).trim();
      if (!slug) {
        res.status(404).json({ message: "Blog post not found" });
        return;
      }
      const normalizedSlug = toUrlSlug(slug);

      // 1. Try Notion
      const notionPost = await getBlogPostBySlug(normalizedSlug);
      if (notionPost) {
        res.json(notionPost);
        return;
      }

      // 2. Try storage fallback (when Notion fails or returns empty)
      const storagePosts = await storage.getBlogPosts();
      const storagePost = storagePosts.find(
        (p: { slug: string }) => toUrlSlug(p.slug) === normalizedSlug
      );
      if (storagePost) {
        const content = typeof storagePost.content === "string"
          ? textToContentBlocks(storagePost.content)
          : [];
        const rawDate = storagePost.date as string | Date;
        const dateStr = typeof rawDate === "string"
          ? (rawDate.includes("T") ? rawDate.split("T")[0] : rawDate)
          : new Date(rawDate).toISOString().split("T")[0];
        res.json({
          id: String(storagePost.id),
          title: storagePost.title,
          excerpt: storagePost.excerpt || "",
          category: storagePost.category || "Savjeti",
          image: storagePost.image || "",
          date: dateStr,
          slug: storagePost.slug,
          author: { name: "NutriHub Team" },
          content,
        });
        return;
      }

      // 3. Try fallback posts (from BlogSection when API is loading)
      const fallbackPost = FALLBACK_BLOG_POSTS[normalizedSlug];
      if (fallbackPost) {
        res.json(fallbackPost);
        return;
      }

      res.status(404).json({ message: "Blog post not found" });
    } catch (error) {
      console.error("Error fetching blog post by slug:", error);
      res.status(500).json({ message: "Error fetching blog post" });
    }
  });

  // Get single blog post with full content by ID
  app.get("/api/blog-posts/:id", async (req, res) => {
    try {
      const post = await getBlogPostById(req.params.id);
      if (!post) {
        res.status(404).json({ message: "Blog post not found" });
        return;
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Error fetching blog post" });
    }
  });

  // Get testimonials from Notion
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await getTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials from Notion:", error);
      // Fallback to storage if Notion fails
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    }
  });

  // Get announcements from Notion
  app.get("/api/announcements", async (req, res) => {
    res.set("Cache-Control", "public, max-age=300");
    try {
      const announcements = await getAnnouncements();
      res.json(announcements);
    } catch (error) {
      console.error("Error fetching announcements from Notion:", error);
      res.status(500).json({ message: "Error fetching announcements" });
    }
  });

  // Get videos from Notion
  app.get("/api/videos", async (req, res) => {
    try {
      const videos = await getVideos();
      res.json(videos);
    } catch (error) {
      console.error("Error fetching videos from Notion:", error);
      res.status(500).json({ message: "Error fetching videos" });
    }
  });

  // Get podcasts from Notion
  app.get("/api/podcasts", async (req, res) => {
    try {
      const podcasts = await getPodcasts();
      res.json(podcasts);
    } catch (error) {
      console.error("Error fetching podcasts from Notion:", error);
      res.status(500).json({ message: "Error fetching podcasts" });
    }
  });

  // Get social media from Notion
  app.get("/api/social-media", async (req, res) => {
    try {
      const socialPosts = await getSocialMedia();
      res.json(socialPosts);
    } catch (error) {
      console.error("Error fetching social media from Notion:", error);
      res.status(500).json({ message: "Error fetching social media" });
    }
  });

  // Contact form submission
  const contactSchema = z.object({
    name: z.string().min(1, "Ime je obavezno."),
    email: z.string().email("Unesite ispravnu email adresu."),
    subject: z.string().min(1, "Naslov je obavezan."),
    message: z.string().min(10, "Poruka je prekratka, molimo unesite 10 ili više karaktera."),
    privacyAgreed: z.boolean().refine(val => val === true, {
      message: "Morate prihvatiti politiku privatnosti.",
    }),
  });

  const contactTo = process.env.CONTACT_TO ?? "planishrane@nutricionistajelena.ba";
  const comingSoonTo = process.env.COMING_SOON_TO ?? "info@nutricionistajelena.ba";
  const newsletterTo = process.env.NEWSLETTER_TO ?? "info@nutricionistajelena.ba";

  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = contactSchema.parse(req.body);
      await sendContactEmail({
        to: contactTo,
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message,
      });
      await storage.saveContactMessage(validatedData);
      res.json({ success: true, message: "Message sent successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstMessage =
          error.errors[0]?.message ?? "Podaci nisu ispravni. Provjerite formu.";
        res.status(400).json({
          success: false,
          message: firstMessage,
          errors: error.errors,
        });
      } else {
        console.error("Contact form email error:", error);
        res.status(500).json({
          success: false,
          message: "Poruka nije poslata. Pokušajte ponovo.",
        });
      }
    }
  });

  // Newsletter subscription
  const subscribeSchema = z.object({
    email: z.string().email("Unesite ispravnu email adresu."),
  });

  app.post("/api/subscribe", async (req, res) => {
    try {
      const validatedData = subscribeSchema.parse(req.body);
      await storage.saveSubscription(validatedData);
      res.json({ success: true, message: "Subscription successful" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstMessage =
          error.errors[0]?.message ?? "Podaci nisu ispravni.";
        res.status(400).json({
          success: false,
          message: firstMessage,
          errors: error.errors,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Pretplata nije uspjela. Pokušajte ponovo.",
        });
      }
    }
  });

  // Coming soon signup (storage + email to info@)
  const comingSoonSchema = z.object({
    email: z.string().email("Unesite ispravnu email adresu."),
  });

  app.post("/api/coming-soon", async (req, res) => {
    try {
      const { email } = comingSoonSchema.parse(req.body);
      await storage.saveComingSoonSignup(email);
      await sendComingSoonNotification({ to: comingSoonTo, email });
      res.json({ success: true, message: "Subscription successful" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstMessage =
          error.errors[0]?.message ?? "Podaci nisu ispravni.";
        res.status(400).json({
          success: false,
          message: firstMessage,
          errors: error.errors,
        });
      } else {
        console.error("Coming soon signup error:", error);
        res.status(500).json({
          success: false,
          message: "Prijava nije uspjela. Pokušajte ponovo.",
        });
      }
    }
  });

  // Newsletter signup (storage + email to info@)
  const newsletterSchema = z.object({
    email: z.string().email("Unesite ispravnu email adresu."),
  });

  app.post("/api/newsletter", async (req, res) => {
    try {
      const { email } = newsletterSchema.parse(req.body);
      await storage.saveNewsletterSignup(email);
      await sendNewsletterNotification({ to: newsletterTo, email });
      res.json({ success: true, message: "Pretplata uspješna." });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstMessage =
          error.errors[0]?.message ?? "Podaci nisu ispravni.";
        res.status(400).json({
          success: false,
          message: firstMessage,
          errors: error.errors,
        });
      } else {
        console.error("Newsletter signup error:", error);
        res.status(500).json({
          success: false,
          message: "Pretplata nije uspjela. Pokušajte ponovo.",
        });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
