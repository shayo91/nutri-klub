import { Router } from "express";
import { db } from "../db";
import { ebooks, ebookDownloads, usageTracking } from "@shared/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { authenticate } from "../middleware/auth";

const router = Router();

/**
 * GET /api/ebooks - Get all e-books
 */
router.get("/", async (req, res) => {
  try {
    const category = req.query.category as string | undefined;
    const featured = req.query.featured === "true";

    let query = db.select().from(ebooks);

    if (category) {
      query = query.where(eq(ebooks.category, category)) as any;
    }

    if (featured) {
      query = query.where(eq(ebooks.isFeatured, true)) as any;
    }

    const allEbooks = await query.orderBy(desc(ebooks.isFeatured), desc(ebooks.createdAt));

    res.json({ ebooks: allEbooks });
  } catch (error) {
    console.error("Get ebooks error:", error);
    res.status(500).json({ error: "Failed to get e-books" });
  }
});

/**
 * GET /api/ebooks/categories - Get all categories
 */
router.get("/categories", async (req, res) => {
  try {
    const categories = await db
      .selectDistinct({ category: ebooks.category })
      .from(ebooks)
      .where(sql`${ebooks.category} IS NOT NULL`);

    const categoryList = categories.map((c) => c.category).filter(Boolean);

    res.json({ categories: categoryList });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ error: "Failed to get categories" });
  }
});

/**
 * GET /api/ebooks/:id - Get e-book by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const ebookId = parseInt(req.params.id);

    const [ebook] = await db
      .select()
      .from(ebooks)
      .where(eq(ebooks.id, ebookId))
      .limit(1);

    if (!ebook) {
      return res.status(404).json({ error: "E-book not found" });
    }

    res.json(ebook);
  } catch (error) {
    console.error("Get ebook error:", error);
    res.status(500).json({ error: "Failed to get e-book" });
  }
});

/**
 * POST /api/ebooks/:id/download - Download e-book (with rate limiting)
 */
router.post("/:id/download", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const ebookId = parseInt(req.params.id);
    const isPremium = req.user.role === "premium" || req.user.role === "admin";

    // Get e-book
    const [ebook] = await db
      .select()
      .from(ebooks)
      .where(eq(ebooks.id, ebookId))
      .limit(1);

    if (!ebook) {
      return res.status(404).json({ error: "E-book not found" });
    }

    // Check if e-book is premium-only
    if (ebook.isPremium && !isPremium) {
      return res.status(403).json({
        error: "Premium e-book",
        message: "This e-book is only available for Premium members. Upgrade now!",
        upgradeUrl: "/dashboard/upgrade",
      });
    }

    // Check download limit for free users
    if (!isPremium) {
      const [usage] = await db
        .select()
        .from(usageTracking)
        .where(
          and(
            eq(usageTracking.userId, req.user.userId),
            eq(usageTracking.feature, "ebook_download")
          )
        )
        .limit(1);

      const downloadCount = usage?.count || 0;

      if (downloadCount >= 1) {
        return res.status(403).json({
          error: "Download limit reached",
          message: "You've reached your free trial limit of 1 e-book download. Upgrade to Premium for unlimited access!",
          upgradeUrl: "/dashboard/upgrade",
          remainingDownloads: 0,
        });
      }
    }

    // Track download
    await db.insert(ebookDownloads).values({
      userId: req.user.userId,
      ebookId,
    });

    // Update download count
    await db
      .update(ebooks)
      .set({ downloadCount: sql`${ebooks.downloadCount} + 1` })
      .where(eq(ebooks.id, ebookId));

    // Track usage for free users
    if (!isPremium) {
      const [existing] = await db
        .select()
        .from(usageTracking)
        .where(
          and(
            eq(usageTracking.userId, req.user.userId),
            eq(usageTracking.feature, "ebook_download")
          )
        )
        .limit(1);

      if (existing) {
        await db
          .update(usageTracking)
          .set({ count: sql`${usageTracking.count} + 1` })
          .where(eq(usageTracking.id, existing.id));
      } else {
        await db.insert(usageTracking).values({
          userId: req.user.userId,
          feature: "ebook_download",
          count: 1,
          resetDate: new Date().toISOString(),
        });
      }
    }

    res.json({
      message: "Download tracked successfully",
      downloadUrl: ebook.pdfUrl,
      ebook: {
        id: ebook.id,
        title: ebook.title,
        author: ebook.author,
      },
    });
  } catch (error) {
    console.error("Download ebook error:", error);
    res.status(500).json({ error: "Failed to download e-book" });
  }
});

/**
 * GET /api/ebooks/user/downloads - Get user's download history (Premium only)
 */
router.get("/user/downloads", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const isPremium = req.user.role === "premium" || req.user.role === "admin";

    if (!isPremium) {
      return res.status(403).json({
        error: "Premium feature",
        message: "Download history is only available for Premium members.",
      });
    }

    const downloads = await db
      .select({
        downloadId: ebookDownloads.id,
        downloadedAt: ebookDownloads.downloadedAt,
        ebookId: ebooks.id,
        title: ebooks.title,
        author: ebooks.author,
        category: ebooks.category,
        coverImageUrl: ebooks.coverImageUrl,
        pdfUrl: ebooks.pdfUrl,
      })
      .from(ebookDownloads)
      .innerJoin(ebooks, eq(ebookDownloads.ebookId, ebooks.id))
      .where(eq(ebookDownloads.userId, req.user.userId))
      .orderBy(desc(ebookDownloads.downloadedAt));

    res.json({ downloads });
  } catch (error) {
    console.error("Get downloads error:", error);
    res.status(500).json({ error: "Failed to get download history" });
  }
});

/**
 * GET /api/ebooks/user/usage - Get download usage stats
 */
router.get("/user/usage", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const isPremium = req.user.role === "premium" || req.user.role === "admin";

    if (isPremium) {
      return res.json({
        isPremium: true,
        unlimited: true,
        downloadsUsed: 0,
        downloadsLimit: null,
        remainingDownloads: null,
      });
    }

    // Free users - check usage
    const [usage] = await db
      .select()
      .from(usageTracking)
      .where(
        and(
          eq(usageTracking.userId, req.user.userId),
          eq(usageTracking.feature, "ebook_download")
        )
      )
      .limit(1);

    const downloadsUsed = usage?.count || 0;
    const downloadsLimit = 1;
    const remainingDownloads = Math.max(0, downloadsLimit - downloadsUsed);

    res.json({
      isPremium: false,
      unlimited: false,
      downloadsUsed,
      downloadsLimit,
      remainingDownloads,
    });
  } catch (error) {
    console.error("Get usage error:", error);
    res.status(500).json({ error: "Failed to get usage stats" });
  }
});

export default router;
