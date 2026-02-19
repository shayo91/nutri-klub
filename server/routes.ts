import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getBlogPosts, getBlogPostById, getTestimonials, getAnnouncements, getVideos, getPodcasts, getSocialMedia } from "./notion";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/robots.txt", (_req, res) => {
    res.type("text/plain").send(`User-agent: *
Allow: /
Disallow: /api/
Disallow: /purchase

Sitemap: https://nutricionistajelena.ba/sitemap.xml
`);
  });

  app.get("/sitemap.xml", async (_req, res) => {
    let blogUrls = "";
    try {
      const result = await getBlogPosts();
      if (result.posts) {
        blogUrls = result.posts.map((post: any) => `  <url>
    <loc>https://nutricionistajelena.ba/blog/${post.slug}</loc>${post.date ? `\n    <lastmod>${post.date}</lastmod>` : ''}
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
    <loc>https://nutricionistajelena.ba/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://nutricionistajelena.ba/privacy</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://nutricionistajelena.ba/terms</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://nutricionistajelena.ba/cookies</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
${blogUrls}
</urlset>`;
    res.type("application/xml").send(sitemap);
  });

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

  // Get single blog post by slug (must be before :id route)
  app.get("/api/blog-posts/by-slug/:slug", async (req, res) => {
    try {
      const slug = decodeURIComponent(req.params.slug).trim();
      if (!slug) {
        res.status(404).json({ message: "Blog post not found" });
        return;
      }
      const result = await getBlogPosts();
      const posts = result.posts || [];
      const foundPost = posts.find(
        (p: { slug: string }) => p.slug === slug
      );
      if (!foundPost) {
        res.status(404).json({ message: "Blog post not found" });
        return;
      }
      const post = await getBlogPostById(foundPost.id);
      if (!post) {
        res.status(404).json({ message: "Blog post not found" });
        return;
      }
      res.json(post);
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
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    subject: z.string().min(1, "Subject is required"),
    message: z.string().min(10, "Message must be at least 10 characters"),
    privacyAgreed: z.boolean().refine(val => val === true, {
      message: "You must agree to the privacy policy",
    }),
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = contactSchema.parse(req.body);
      await storage.saveContactMessage(validatedData);
      res.json({ success: true, message: "Message sent successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Validation failed", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Error sending message" 
        });
      }
    }
  });

  // Newsletter subscription
  const subscribeSchema = z.object({
    email: z.string().email("Invalid email address"),
  });

  app.post("/api/subscribe", async (req, res) => {
    try {
      const validatedData = subscribeSchema.parse(req.body);
      await storage.saveSubscription(validatedData);
      res.json({ success: true, message: "Subscription successful" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Validation failed", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Error processing subscription" 
        });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
