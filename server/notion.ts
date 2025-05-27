import { Client } from "@notionhq/client";

// Initialize Notion client
export const notion = new Client({
    auth: process.env.NOTION_INTEGRATION_SECRET!,
});

// Extract the page ID from the Notion page URL
function extractPageIdFromUrl(pageUrl: string): string {
    const match = pageUrl.match(/([a-f0-9]{32})(?:[?#]|$)/i);
    if (match && match[1]) {
        return match[1];
    }

    throw Error("Failed to extract page ID");
}

export const NOTION_PAGE_ID = extractPageIdFromUrl(process.env.NOTION_PAGE_URL!);

/**
 * Lists all child databases contained within NOTION_PAGE_ID
 * @returns {Promise<Array<{id: string, title: string}>>} - Array of database objects with id and title
 */
export async function getNotionDatabases() {

    // Array to store the child databases
    const childDatabases = [];

    try {
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
                // Check if the block is a child database
                if (block.type === "child_database") {
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

// Get all blog posts from the Notion database
export async function getBlogPosts() {
    try {
        const blogDb = await findDatabaseByTitle("Blog Posts");
        if (!blogDb) {
            return [];
        }

        const response = await notion.databases.query({
            database_id: blogDb.id,
        });

        return response.results.map((page: any) => {
            const properties = page.properties;

            return {
                id: page.id.replace(/-/g, ''),
                title: properties.Title?.title?.[0]?.plain_text || "Untitled Post",
                excerpt: properties.Excerpt?.rich_text?.[0]?.plain_text || "",
                content: properties.Content?.rich_text?.[0]?.plain_text || "",
                category: properties.Category?.select?.name?.toLowerCase() || "nutrition",
                image: properties.Image?.url || "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
                date: properties.Date?.date?.start || new Date().toISOString().split('T')[0],
                slug: (properties.Title?.title?.[0]?.plain_text || "untitled")
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, ''),
                author: {
                    name: properties.Author?.rich_text?.[0]?.plain_text || "NutriHub Team",
                    avatar: "https://images.unsplash.com/photo-1607453998774-d533f65dac99?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
                }
            };
        });
    } catch (error) {
        console.error("Error fetching blog posts from Notion:", error);
        return [];
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
export async function getTestimonials() {
    try {
        const testimonialsDb = await findDatabaseByTitle("Testimonials");
        if (!testimonialsDb) {
            return [];
        }

        const response = await notion.databases.query({
            database_id: testimonialsDb.id,
        });

        return response.results.map((page: any) => {
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
    } catch (error) {
        console.error("Error fetching testimonials from Notion:", error);
        return [];
    }
}