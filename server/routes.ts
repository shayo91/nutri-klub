import type { Express } from "express";
import { createServer, type Server } from "http";
import type { ServeSpa } from "./vite.js";
import { storage } from "./storage.js";
import { sendContactEmail, sendComingSoonNotification, sendNewsletterNotification } from "./email.js";
import { getMarkdownBlogList, getMarkdownBlogPostBySlug } from "./blog.js";
import { toUrlSlug } from "../shared/url-slug.js";
import { z } from "zod";
import { isDashboardEnabled } from "./feature-flags.js";

const DASHBOARD_API_PREFIXES = [
	"/api/auth",
	"/api/subscription",
	"/api/onboarding",
	"/api/recipes",
	"/api/recipes-external",
	"/api/ai",
	"/api/ebooks",
	"/api/tracking",
	"/api/payments",
] as const;

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

  app.get("/api/public-config", (_req, res) => {
    res.set("Cache-Control", "no-store");
    res.json({ dashboardEnabled: isDashboardEnabled() });
  });

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

  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ message: "Error fetching testimonials" });
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

  // Coming soon (Programs section → /api/coming-soon)
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

  if (!isDashboardEnabled()) {
    app.use((req, res, next) => {
      if (!req.path.startsWith("/api")) return next();
      const blocked = DASHBOARD_API_PREFIXES.some(
        (p) => req.path === p || req.path.startsWith(`${p}/`),
      );
      if (!blocked) return next();
      return res.status(503).json({
        ok: false,
        code: "DASHBOARD_DISABLED",
        message: "Korisnički panel trenutno nije dostupan.",
      });
    });
  }

  if (isDashboardEnabled()) {
    await import("./db.js");
    const cookieParser = (await import("cookie-parser")).default;
    app.use(cookieParser());

    const authRoutes = (await import("./routes/auth.js")).default;
    const subscriptionRoutes = (await import("./routes/subscription.js"))
      .default;
    const onboardingRoutes = (await import("./routes/onboarding.js")).default;
    const recipesRoutes = (await import("./routes/recipes.js")).default;
    const recipesExternalRoutes = (await import(
      "./routes/recipes-external.js"
    )).default;
    const aiRoutes = (await import("./routes/ai.js")).default;
    const ebooksRoutes = (await import("./routes/ebooks.js")).default;
    const trackingRoutes = (await import("./routes/tracking.js")).default;
    const paymentsRoutes = (await import("./routes/payments.js")).default;

    app.use("/api/auth", authRoutes);
    app.use("/api/subscription", subscriptionRoutes);
    app.use("/api/onboarding", onboardingRoutes);
    app.use("/api/recipes", recipesRoutes);
    app.use("/api/recipes-external", recipesExternalRoutes);
    app.use("/api/ai", aiRoutes);
    app.use("/api/ebooks", ebooksRoutes);
    app.use("/api/tracking", trackingRoutes);
    app.use("/api/payments", paymentsRoutes);
  }

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
