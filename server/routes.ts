import type { Express } from "express";
import { createServer, type Server } from "http";
import type { ServeSpa } from "./vite.js";
import { storage } from "./storage.js";
import { sendContactEmail, sendComingSoonNotification, sendNewsletterNotification } from "./email.js";
import { getMarkdownBlogList, getMarkdownBlogPostBySlug } from "./blog.js";
import { getTestimonials, getAnnouncements, getVideos, getPodcasts, getSocialMedia } from "./notion.js";
import { toUrlSlug } from "../shared/url-slug.js";
import { z } from "zod";

export async function registerRoutes(
  app: Express,
  options?: { serveSpa?: ServeSpa; server?: Server }
): Promise<Server> {
  app.get(["/robots.txt", "/api/robots.txt"], (_req, res) => {
    res.type("text/plain").send(`User-agent: *
Allow: /

# API nije javni HTML sadržaj
Disallow: /api/

Sitemap: https://nutricionistajelena.ba/sitemap.xml
`);
  });

  /** Banja Luka prva + viši priority u sitemap-u (lokalni SEO). */
  const LOCATION_SLUGS_SITEMAP = [
    "banja-luka",
    "sarajevo",
    "tuzla",
    "zenica",
    "mostar",
    "prijedor",
    "bih",
  ] as const;

  const sitemapHandler = async (_req: any, res: any) => {
    let blogUrls = "";
    try {
      const result = getMarkdownBlogList();
      if (result.posts?.length) {
        blogUrls = result.posts.map((post: { slug: string; date: string }) => `  <url>
    <loc>https://nutricionistajelena.ba/clanci/${post.slug}</loc>${post.date ? `\n    <lastmod>${post.date}</lastmod>` : ''}
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join("\n");
      }
    } catch (e) {}

    const today = new Date().toISOString().split("T")[0];
    const locationUrls = LOCATION_SLUGS_SITEMAP.map((slug) => {
      const priority = slug === "banja-luka" ? "0.9" : "0.8";
      return `  <url>
    <loc>https://nutricionistajelena.ba/nutricionista-${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`;
    }).join("\n");

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
    <loc>https://nutricionistajelena.ba/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
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
${locationUrls}
${blogUrls}
</urlset>`;
    res.type("application/xml").send(sitemap);
  };
  app.get(["/sitemap.xml", "/api/sitemap.xml"], sitemapHandler);

  // API Routes

  // Markdown files in content/blog/ (see content/blog/README.md)
  app.get("/api/blog-posts", (_req, res) => {
    try {
      const result = getMarkdownBlogList();
      res.set("Cache-Control", "public, max-age=300");
      res.json(result);
    } catch (error) {
      console.error("Error loading markdown blog posts:", error);
      res.json({ posts: [], categories: [] });
    }
  });

  // Get single blog post by slug (must be before :id route)
  app.get("/api/blog-posts/by-slug/:slug", (req, res) => {
    try {
      const slug = decodeURIComponent(req.params.slug).trim();
      if (!slug) {
        res.status(404).json({ message: "Blog post not found" });
        return;
      }
      const normalizedSlug = toUrlSlug(slug);
      const post = getMarkdownBlogPostBySlug(normalizedSlug);
      if (post) {
        res.json(post);
        return;
      }
      res.status(404).json({ message: "Blog post not found" });
    } catch (error) {
      console.error("Error fetching blog post by slug:", error);
      res.status(500).json({ message: "Error fetching blog post" });
    }
  });

  // Legacy :id route (Notion UUIDs no longer used; slug works)
  app.get("/api/blog-posts/:id", (req, res) => {
    try {
      const post = getMarkdownBlogPostBySlug(req.params.id);
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

  // Redirect old /nutricionista/:location format to new hyphen format
  app.get("/nutricionista/:location", (req, res) => {
    res.redirect(301, `/nutricionista-${req.params.location}`);
  });

  // Handle /nutricionista-:location* as SPA (explicit route for SEO)
  app.get("/nutricionista-:location*", async (req, res) => {
    const loc = (req.params as any)["location*"] || (req.params as any).location;
    if (options?.serveSpa) {
      return options.serveSpa(req, res);
    }
    res.status(404).send("Not found");
  });

  if (options?.serveSpa) {
    app.get("*", options.serveSpa);
  }

  const httpServer = options?.server ?? createServer(app);
  return httpServer;
}
