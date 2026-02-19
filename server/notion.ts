import { Client } from "@notionhq/client";

// Initialize Notion client
export const notion = new Client({
    auth: process.env.NOTION_INTEGRATION_SECRET!,
});

// Simple in-memory cache for Notion data
interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string): T | null {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > CACHE_TTL) {
        cache.delete(key);
        return null;
    }
    return entry.data as T;
}

function setCache<T>(key: string, data: T): void {
    cache.set(key, { data, timestamp: Date.now() });
}

// Extract the page ID from the Notion page URL
function extractPageIdFromUrl(pageUrl: string): string {
    const match = pageUrl.match(/([a-f0-9]{32})(?:[?#]|$)/i);
    if (match && match[1]) {
        return match[1];
    }

    throw Error("Failed to extract page ID");
}

/**
 * Normalize text to URL-safe slug (ASCII, no diacritics).
 * Handles BCS characters: č, ć, š, ž, đ and their uppercase variants.
 */
export function toUrlSlug(text: string): string {
	if (!text || typeof text !== "string") return "untitled";
	const diacriticsMap: Record<string, string> = {
		č: "c", ć: "c", š: "s", ž: "z", đ: "d",
		Č: "c", Ć: "c", Š: "s", Ž: "z", Đ: "d",
	};
	const normalized = text
		.split("")
		.map((c) => diacriticsMap[c] ?? c)
		.join("");
	return normalized
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.replace(/(^-|-$)/g, "");
}

const pageUrl = process.env.NOTION_PAGE_URL;
if (!pageUrl) {
    throw new Error(
        'NOTION_PAGE_URL is not set. Ensure .env exists with NOTION_PAGE_URL and that dotenv loads it before this module.'
    );
}
export const NOTION_PAGE_ID = extractPageIdFromUrl(pageUrl);

/**
 * Lists all child databases contained within NOTION_PAGE_ID
 * @returns {Promise<Array<{id: string, title: string}>>} - Array of database objects with id and title
 */
export async function getNotionDatabases() {
    const cacheKey = 'notion-databases';
    const cached = getCached<any[]>(cacheKey);
    if (cached) {
        return cached;
    }

    // Array to store the child databases
    const childDatabases = [];

    try {
        console.log('[Notion] Fetching database list...');
        // Query all child blocks in the specified page
        let hasMore = true;
        let startCursor: string | undefined = undefined;

        while (hasMore) {
            const response = await notion.blocks.children.list({
                block_id: NOTION_PAGE_ID,
                start_cursor: startCursor,
            });

            // Process the results
            for (const block of response.results) {
                // Check if the block is a child database (PartialBlockObjectResponse lacks type)
                if ('type' in block && block.type === "child_database") {
                    const databaseId = block.id;

                    // Retrieve the database title
                    try {
                        const databaseInfo = await notion.databases.retrieve({
                            database_id: databaseId,
                        });

                        // Add the database to our list
                        childDatabases.push(databaseInfo);
                    } catch (error) {
                        console.error(`Error retrieving database ${databaseId}:`, error);
                    }
                }
            }

            // Check if there are more results to fetch
            hasMore = response.has_more;
            startCursor = response.next_cursor || undefined;
        }

        setCache(cacheKey, childDatabases);
        console.log('[Cache] Database list cached');
        return childDatabases;
    } catch (error) {
        console.error("Error listing child databases:", error);
        throw error;
    }
}

// Find get a Notion database with the matching title
export async function findDatabaseByTitle(title: string) {
    const databases = await getNotionDatabases();

    for (const db of databases) {
        if (db.title && Array.isArray(db.title) && db.title.length > 0) {
            const dbTitle = db.title[0]?.plain_text?.toLowerCase() || "";
            if (dbTitle === title.toLowerCase()) {
                return db;
            }
        }
    }

    return null;
}

// Create a new database if one with a matching title does not exist
export async function createDatabaseIfNotExists(title: string, properties: any) {
    const existingDb = await findDatabaseByTitle(title);
    if (existingDb) {
        return existingDb;
    }
    return await notion.databases.create({
        parent: {
            type: "page_id",
            page_id: NOTION_PAGE_ID
        },
        title: [
            {
                type: "text",
                text: {
                    content: title
                }
            }
        ],
        properties
    });
}

// Default cover image when Image property is empty
const DEFAULT_BLOG_COVER_IMAGE =
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600";

/** Get thumbnail from Notion Image property (database column), fallback to default */
function getImageFromNotionProperty(properties: any): string {
    const img = properties?.Image;
    if (!img) return DEFAULT_BLOG_COVER_IMAGE;
    const url = img.url;
    if (url && typeof url === "string" && url.trim()) return url;
    if (img.files?.length > 0) {
        const file = img.files[0];
        const fileUrl = file.type === "file" ? file.file?.url : file.external?.url;
        if (fileUrl) return fileUrl;
    }
    return DEFAULT_BLOG_COVER_IMAGE;
}

// Helper to get image from page (cover, Image property, or first content image)
async function getPageImageForList(page: any): Promise<string> {
    const properties = page.properties;
    
    // First try cover image
    if (page.cover) {
        if (page.cover.type === "file") {
            return page.cover.file.url;
        } else if (page.cover.type === "external") {
            return page.cover.external.url;
        }
    }

    // Try Image property from database (URL or file)
    if (properties?.Image) {
        // If it's a URL property
        if (properties.Image.url) {
            return properties.Image.url;
        }
        // If it's a files property
        if (properties.Image.files && properties.Image.files.length > 0) {
            const file = properties.Image.files[0];
            if (file.type === "file") {
                return file.file.url;
            } else if (file.type === "external") {
                return file.external.url;
            }
        }
    }

    // Try to get first image from page content
    try {
        const response = await notion.blocks.children.list({
            block_id: page.id,
            page_size: 10,
        });

        for (const block of response.results as any[]) {
            if (block.type === "image") {
                if (block.image.type === "file") {
                    return block.image.file.url;
                } else if (block.image.external) {
                    return block.image.external.url;
                }
            }
        }
    } catch (error) {
        console.error("Error fetching page image for list:", error);
    }

    // Fallback to default image
    return "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400";
}

// Get all blog posts from the Notion database
export async function getBlogPosts() {
    const cacheKey = 'blog-posts';
    const cached = getCached<{ posts: any[], categories: string[] }>(cacheKey);
    if (cached) {
        console.log('[Cache] Returning cached blog posts');
        return cached;
    }

    try {
        console.log('[Notion] Fetching blog posts from Notion...');
        const blogDb = await findDatabaseByTitle("Blog Posts");
        if (!blogDb) {
            return { posts: [], categories: [] };
        }

        const response = await notion.databases.query({
            database_id: blogDb.id,
            filter: {
                property: "Published",
                checkbox: {
                    equals: true
                }
            }
        });

        // Extract all unique categories from the multi-select Category field
        const categoriesSet = new Set<string>();
        
        const posts = response.results.map((page: any) => {
            const properties = page.properties;

            // Handle multi-select or single select categories
            let categories: string[] = [];
            if (properties.Category?.multi_select && properties.Category.multi_select.length > 0) {
                categories = properties.Category.multi_select.map((cat: any) => cat.name);
            } else if (properties.Category?.select?.name) {
                categories = [properties.Category.select.name];
            }
            categories.forEach((cat: string) => categoriesSet.add(cat));

            const title = properties.Title?.title?.[0]?.plain_text || "Untitled Post";
            const slugValue =
                properties.Slug?.rich_text?.[0]?.plain_text ||
                properties.Slug?.title?.[0]?.plain_text ||
                toUrlSlug(title);
            return {
                id: page.id.replace(/-/g, ''),
                title,
                excerpt: properties.Excerpt?.rich_text?.[0]?.plain_text || "",
                content: properties.Content?.rich_text?.[0]?.plain_text || "",
                categories: categories,
                category: categories[0] || "Savjeti",
                image: getImageFromNotionProperty(properties),
                date: properties.Date?.date?.start || new Date().toISOString().split('T')[0],
                slug: toUrlSlug(slugValue),
                author: {
                    name: properties.Author?.rich_text?.[0]?.plain_text || "NutriHub Team",
                    avatar: "https://images.unsplash.com/photo-1607453998774-d533f65dac99?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
                }
            };
        });

        const result = { posts, categories: Array.from(categoriesSet) };
        setCache(cacheKey, result);
        console.log('[Cache] Blog posts cached for 5 minutes');
        return result;
    } catch (error) {
        console.error("Error fetching blog posts from Notion:", error);
        return { posts: [], categories: [] };
    }
}

// Get all announcements from the Notion database
export async function getAnnouncements() {
    try {
        const announcementsDb = await findDatabaseByTitle("Announcements");
        if (!announcementsDb) {
            return [];
        }

        const response = await notion.databases.query({
            database_id: announcementsDb.id,
        });

        return response.results.map((page: any) => {
            const properties = page.properties;

            return {
                id: page.id.replace(/-/g, ''),
                title: properties.Title?.title?.[0]?.plain_text || "Untitled Announcement",
                content: properties.Content?.rich_text?.[0]?.plain_text || "",
                type: properties.Type?.select?.name?.toLowerCase() || "info",
                date: properties.Date?.date?.start || new Date().toISOString().split('T')[0],
                active: properties.Active?.checkbox || false
            };
        });
    } catch (error) {
        console.error("Error fetching announcements from Notion:", error);
        return [];
    }
}

// Get testimonials from Notion
export async function getVideos() {
  try {
    const videosDb = await findDatabaseByTitle("Videos");
    if (!videosDb) return [];

    const response = await notion.databases.query({
      database_id: videosDb.id,
      filter: {
        property: "Active",
        checkbox: {
          equals: true
        }
      }
    });

    return response.results.map((page: any) => {
      const properties = page.properties;
      return {
        id: page.id,
        title: properties.Title?.title?.[0]?.plain_text || "",
        description: properties.Description?.rich_text?.[0]?.plain_text || "",
        duration: properties.Duration?.rich_text?.[0]?.plain_text || "",
        thumbnail: properties.Thumbnail?.url || "",
        videoUrl: properties.VideoURL?.url || "",
        category: properties.Category?.select?.name || ""
      };
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
}

export async function getPodcasts() {
  try {
    const podcastsDb = await findDatabaseByTitle("Podcasts");
    if (!podcastsDb) return [];

    const response = await notion.databases.query({
      database_id: podcastsDb.id,
      filter: {
        property: "Active",
        checkbox: {
          equals: true
        }
      }
    });

    return response.results.map((page: any) => {
      const properties = page.properties;
      return {
        id: page.id,
        title: properties.Title?.title?.[0]?.plain_text || "",
        description: properties.Description?.rich_text?.[0]?.plain_text || "",
        duration: properties.Duration?.rich_text?.[0]?.plain_text || "",
        image: properties.Image?.url || "",
        audioUrl: properties.AudioURL?.url || "",
        guest: properties.Guest?.rich_text?.[0]?.plain_text || "",
        category: properties.Category?.select?.name || ""
      };
    });
  } catch (error) {
    console.error("Error fetching podcasts:", error);
    return [];
  }
}

export async function getSocialMedia() {
  try {
    const socialDb = await findDatabaseByTitle("SocialMedia");
    if (!socialDb) return [];

    const response = await notion.databases.query({
      database_id: socialDb.id,
      filter: {
        property: "Active",
        checkbox: {
          equals: true
        }
      }
    });

    return response.results.map((page: any) => {
      const properties = page.properties;
      return {
        id: page.id,
        title: properties.Title?.title?.[0]?.plain_text || "",
        content: properties.Content?.rich_text?.[0]?.plain_text || "",
        platform: properties.Platform?.select?.name || "",
        image: properties.Image?.url || "",
        videoUrl: properties.VideoURL?.url || "",
        likes: properties.Likes?.number || 0,
        views: properties.Views?.number || 0
      };
    });
  } catch (error) {
    console.error("Error fetching social media:", error);
    return [];
  }
}

export async function getTestimonials() {
    const cacheKey = 'testimonials';
    const cached = getCached<any[]>(cacheKey);
    if (cached) {
        console.log('[Cache] Returning cached testimonials');
        return cached;
    }

    try {
        console.log('[Notion] Fetching testimonials...');
        const testimonialsDb = await findDatabaseByTitle("Testimonials");
        if (!testimonialsDb) {
            return [];
        }

        const response = await notion.databases.query({
            database_id: testimonialsDb.id,
        });

        const result = response.results.map((page: any) => {
            const properties = page.properties;

            return {
                id: page.id.replace(/-/g, ''),
                name: properties.Name?.title?.[0]?.plain_text || "Anonymous",
                role: properties.Role?.rich_text?.[0]?.plain_text || "Client",
                content: properties.Content?.rich_text?.[0]?.plain_text || "",
                avatar: properties.Avatar?.url || "https://images.unsplash.com/photo-1494790108755-2616b612b1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
                rating: properties.Rating?.number || 5
            };
        });

        setCache(cacheKey, result);
        console.log('[Cache] Testimonials cached');
        return result;
    } catch (error) {
        console.error("Error fetching testimonials from Notion:", error);
        return [];
    }
}

// Get page content blocks (text, images, lists, etc.)
export async function getPageContent(pageId: string): Promise<any[]> {
    const blocks: any[] = [];
    let hasMore = true;
    let startCursor: string | undefined = undefined;

    try {
        while (hasMore) {
            const response = await notion.blocks.children.list({
                block_id: pageId,
                start_cursor: startCursor,
            });

            for (const block of response.results as any[]) {
                blocks.push(formatBlock(block));
            }

            hasMore = response.has_more;
            startCursor = response.next_cursor || undefined;
        }

        return blocks;
    } catch (error) {
        console.error("Error fetching page content:", error);
        return [];
    }
}

// Format a Notion block to a simpler structure
function formatBlock(block: any): any {
    const baseBlock = {
        id: block.id,
        type: block.type,
    };

    switch (block.type) {
        case "paragraph":
            return {
                ...baseBlock,
                content: block.paragraph.rich_text.map((t: any) => ({
                    text: t.plain_text,
                    bold: t.annotations?.bold || false,
                    italic: t.annotations?.italic || false,
                    link: t.href || null,
                })),
            };
        case "heading_1":
            return {
                ...baseBlock,
                content: block.heading_1.rich_text.map((t: any) => t.plain_text).join(""),
            };
        case "heading_2":
            return {
                ...baseBlock,
                content: block.heading_2.rich_text.map((t: any) => t.plain_text).join(""),
            };
        case "heading_3":
            return {
                ...baseBlock,
                content: block.heading_3.rich_text.map((t: any) => t.plain_text).join(""),
            };
        case "bulleted_list_item":
            return {
                ...baseBlock,
                content: block.bulleted_list_item.rich_text.map((t: any) => t.plain_text).join(""),
            };
        case "numbered_list_item":
            return {
                ...baseBlock,
                content: block.numbered_list_item.rich_text.map((t: any) => t.plain_text).join(""),
            };
        case "image":
            const imageUrl = block.image.type === "file" 
                ? block.image.file.url 
                : block.image.external?.url || "";
            return {
                ...baseBlock,
                url: imageUrl,
                caption: block.image.caption?.map((t: any) => t.plain_text).join("") || "",
            };
        case "quote":
            return {
                ...baseBlock,
                content: block.quote.rich_text.map((t: any) => t.plain_text).join(""),
            };
        case "divider":
            return baseBlock;
        case "callout":
            return {
                ...baseBlock,
                content: block.callout.rich_text.map((t: any) => t.plain_text).join(""),
                icon: block.callout.icon?.emoji || "",
            };
        default:
            return baseBlock;
    }
}

// Get cover image or first image from page content
async function getPageImage(page: any): Promise<string> {
    // First try cover image
    if (page.cover) {
        if (page.cover.type === "file") {
            return page.cover.file.url;
        } else if (page.cover.type === "external") {
            return page.cover.external.url;
        }
    }

    // Try to get first image from page content
    try {
        const response = await notion.blocks.children.list({
            block_id: page.id,
            page_size: 20,
        });

        for (const block of response.results as any[]) {
            if (block.type === "image") {
                if (block.image.type === "file") {
                    return block.image.file.url;
                } else if (block.image.external) {
                    return block.image.external.url;
                }
            }
        }
    } catch (error) {
        console.error("Error fetching page image:", error);
    }

    // Fallback to default image
    return "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400";
}

// Get a single blog post by ID with full content
export async function getBlogPostById(postId: string) {
    const cacheKey = `blog-post-${postId}`;
    const cached = getCached<any>(cacheKey);
    if (cached) {
        console.log(`[Cache] Returning cached blog post: ${postId}`);
        return cached;
    }

    try {
        console.log(`[Notion] Fetching blog post: ${postId}`);
        // Format the page ID with dashes if needed
        const formattedId = postId.length === 32 
            ? `${postId.slice(0, 8)}-${postId.slice(8, 12)}-${postId.slice(12, 16)}-${postId.slice(16, 20)}-${postId.slice(20)}`
            : postId;

        const page = await notion.pages.retrieve({ page_id: formattedId }) as any;
        const properties = page.properties;
        const content = await getPageContent(formattedId);

        // Handle multi-select or single select categories
        let categories: string[] = [];
        if (properties.Category?.multi_select && properties.Category.multi_select.length > 0) {
            categories = properties.Category.multi_select.map((cat: any) => cat.name);
        } else if (properties.Category?.select?.name) {
            categories = [properties.Category.select.name];
        }

        const title = properties.Title?.title?.[0]?.plain_text || "Untitled Post";
        const slugValue =
            properties.Slug?.rich_text?.[0]?.plain_text ||
            properties.Slug?.title?.[0]?.plain_text ||
            title;
        const result = {
            id: page.id.replace(/-/g, ''),
            title,
            excerpt: properties.Excerpt?.rich_text?.[0]?.plain_text || "",
            categories: categories,
            category: categories[0] || "Savjeti",
            image: getImageFromNotionProperty(properties),
            date: properties.Date?.date?.start || new Date().toISOString().split('T')[0],
            slug: toUrlSlug(slugValue),
            author: {
                name: properties.Author?.rich_text?.[0]?.plain_text || "NutriHub Team",
                avatar: "https://images.unsplash.com/photo-1607453998774-d533f65dac99?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
            },
            content: content
        };
        
        setCache(cacheKey, result);
        console.log(`[Cache] Blog post cached: ${postId}`);
        return result;
    } catch (error) {
        console.error("Error fetching blog post:", error);
        return null;
    }
}