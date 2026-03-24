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