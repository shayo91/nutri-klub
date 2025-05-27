import { Client } from "@notionhq/client";
import { notion, NOTION_PAGE_ID, createDatabaseIfNotExists, findDatabaseByTitle } from "./notion";

// Environment variables validation
if (!process.env.NOTION_INTEGRATION_SECRET) {
    throw new Error("NOTION_INTEGRATION_SECRET is not defined. Please add it to your environment variables.");
}

// Setup databases for the nutrition website
async function setupNotionDatabases() {
    console.log("Setting up Notion databases...");

    // Create Blog Posts database
    await createDatabaseIfNotExists("Blog Posts", {
        Title: {
            title: {}
        },
        Excerpt: {
            rich_text: {}
        },
        Content: {
            rich_text: {}
        },
        Category: {
            select: {
                options: [
                    { name: "Recipes", color: "green" },
                    { name: "Nutrition", color: "blue" },
                    { name: "Wellness", color: "purple" },
                    { name: "Weight Loss", color: "orange" },
                    { name: "Meal Planning", color: "yellow" }
                ]
            }
        },
        Image: {
            url: {}
        },
        Date: {
            date: {}
        },
        Author: {
            rich_text: {}
        },
        Published: {
            checkbox: {}
        }
    });

    // Create Announcements database
    await createDatabaseIfNotExists("Announcements", {
        Title: {
            title: {}
        },
        Content: {
            rich_text: {}
        },
        Type: {
            select: {
                options: [
                    { name: "Info", color: "blue" },
                    { name: "Warning", color: "yellow" },
                    { name: "Success", color: "green" },
                    { name: "Promotion", color: "purple" }
                ]
            }
        },
        Date: {
            date: {}
        },
        Active: {
            checkbox: {}
        }
    });

    // Create Testimonials database
    await createDatabaseIfNotExists("Testimonials", {
        Name: {
            title: {}
        },
        Role: {
            rich_text: {}
        },
        Content: {
            rich_text: {}
        },
        Rating: {
            number: {
                format: "number"
            }
        },
        Avatar: {
            url: {}
        },
        Featured: {
            checkbox: {}
        },
        Date: {
            date: {}
        }
    });

    console.log("Databases created successfully!");
}

async function createSampleData() {
    try {
        console.log("Adding sample content...");

        // Find the databases
        const blogDb = await findDatabaseByTitle("Blog Posts");
        const announcementsDb = await findDatabaseByTitle("Announcements");
        const testimonialsDb = await findDatabaseByTitle("Testimonials");

        if (!blogDb || !announcementsDb || !testimonialsDb) {
            throw new Error("Could not find the required databases.");
        }

        // Sample blog posts
        const blogPosts = [
            {
                title: "10 Superfoods to Boost Your Energy Naturally",
                excerpt: "Discover nutrient-dense foods that can help increase your energy levels without relying on caffeine or sugar crashes.",
                content: "Energy is something we all need more of in our busy lives. Instead of reaching for another cup of coffee, try incorporating these 10 superfoods into your diet for sustained, natural energy throughout the day.",
                category: "Nutrition",
                image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
                author: "NutriHub Team"
            },
            {
                title: "Mediterranean Diet: Your Guide to Heart-Healthy Eating",
                excerpt: "Learn how the Mediterranean diet can improve your cardiovascular health while enjoying delicious, flavorful meals.",
                content: "The Mediterranean diet has been praised by nutritionists worldwide for its heart-healthy benefits and delicious variety of foods. Here's everything you need to know to get started.",
                category: "Wellness",
                image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
                author: "NutriHub Team"
            },
            {
                title: "Quick and Healthy Breakfast Recipes for Busy Mornings",
                excerpt: "Start your day right with these nutritious breakfast ideas that take less than 10 minutes to prepare.",
                content: "Mornings can be hectic, but that doesn't mean you have to skip the most important meal of the day. These quick and healthy breakfast recipes will fuel your body and mind.",
                category: "Recipes",
                image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
                author: "NutriHub Team"
            }
        ];

        for (let post of blogPosts) {
            await notion.pages.create({
                parent: {
                    database_id: blogDb.id
                },
                properties: {
                    Title: {
                        title: [
                            {
                                text: {
                                    content: post.title
                                }
                            }
                        ]
                    },
                    Excerpt: {
                        rich_text: [
                            {
                                text: {
                                    content: post.excerpt
                                }
                            }
                        ]
                    },
                    Content: {
                        rich_text: [
                            {
                                text: {
                                    content: post.content
                                }
                            }
                        ]
                    },
                    Category: {
                        select: {
                            name: post.category
                        }
                    },
                    Image: {
                        url: post.image
                    },
                    Date: {
                        date: {
                            start: new Date().toISOString().split('T')[0]
                        }
                    },
                    Author: {
                        rich_text: [
                            {
                                text: {
                                    content: post.author
                                }
                            }
                        ]
                    },
                    Published: {
                        checkbox: true
                    }
                }
            });
        }

        // Sample announcements
        const announcements = [
            {
                title: "New Nutrition Consultation Hours Available",
                content: "We're excited to announce extended consultation hours! Book your personalized nutrition session today.",
                type: "Info"
            },
            {
                title: "Holiday Special: 20% Off All Nutrition Plans",
                content: "Limited time offer! Get 20% off any nutrition plan when you sign up this month. Use code HEALTHY20.",
                type: "Promotion"
            }
        ];

        for (let announcement of announcements) {
            await notion.pages.create({
                parent: {
                    database_id: announcementsDb.id
                },
                properties: {
                    Title: {
                        title: [
                            {
                                text: {
                                    content: announcement.title
                                }
                            }
                        ]
                    },
                    Content: {
                        rich_text: [
                            {
                                text: {
                                    content: announcement.content
                                }
                            }
                        ]
                    },
                    Type: {
                        select: {
                            name: announcement.type
                        }
                    },
                    Date: {
                        date: {
                            start: new Date().toISOString().split('T')[0]
                        }
                    },
                    Active: {
                        checkbox: true
                    }
                }
            });
        }

        // Sample testimonials
        const testimonials = [
            {
                name: "Sarah Johnson",
                role: "Working Mother",
                content: "The personalized nutrition plan changed my life! I have more energy and feel healthier than ever.",
                rating: 5,
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
            },
            {
                name: "Michael Chen",
                role: "Fitness Enthusiast",
                content: "Finally, a nutrition approach that works with my training schedule. Highly recommend!",
                rating: 5,
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
            },
            {
                name: "Emily Rodriguez",
                role: "Busy Professional",
                content: "The meal planning service has saved me so much time while helping me eat healthier. Amazing!",
                rating: 5,
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
            }
        ];

        for (let testimonial of testimonials) {
            await notion.pages.create({
                parent: {
                    database_id: testimonialsDb.id
                },
                properties: {
                    Name: {
                        title: [
                            {
                                text: {
                                    content: testimonial.name
                                }
                            }
                        ]
                    },
                    Role: {
                        rich_text: [
                            {
                                text: {
                                    content: testimonial.role
                                }
                            }
                        ]
                    },
                    Content: {
                        rich_text: [
                            {
                                text: {
                                    content: testimonial.content
                                }
                            }
                        ]
                    },
                    Rating: {
                        number: testimonial.rating
                    },
                    Avatar: {
                        url: testimonial.avatar
                    },
                    Featured: {
                        checkbox: true
                    },
                    Date: {
                        date: {
                            start: new Date().toISOString().split('T')[0]
                        }
                    }
                }
            });
        }

        console.log("Sample content created successfully!");
    } catch (error) {
        console.error("Error creating sample content:", error);
    }
}

// Run the setup
setupNotionDatabases().then(() => {
    return createSampleData();
}).then(() => {
    console.log("Notion CMS setup complete!");
    process.exit(0);
}).catch(error => {
    console.error("Setup failed:", error);
    process.exit(1);
});