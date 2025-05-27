import { Client } from '@notionhq/client';

const notion = new Client({
    auth: process.env.NOTION_INTEGRATION_SECRET,
});

function extractPageIdFromUrl(pageUrl) {
    const match = pageUrl.match(/([a-f0-9]{32})(?:[?#]|$)/i);
    if (match && match[1]) {
        return match[1];
    }
    throw Error("Failed to extract page ID");
}

const NOTION_PAGE_ID = extractPageIdFromUrl(process.env.NOTION_PAGE_URL);

async function findDatabaseByTitle(title) {
    try {
        let hasMore = true;
        let startCursor = undefined;

        while (hasMore) {
            const response = await notion.blocks.children.list({
                block_id: NOTION_PAGE_ID,
                start_cursor: startCursor,
            });

            for (const block of response.results) {
                if (block.type === "child_database") {
                    try {
                        const databaseInfo = await notion.databases.retrieve({
                            database_id: block.id,
                        });

                        if (databaseInfo.title && Array.isArray(databaseInfo.title) && databaseInfo.title.length > 0) {
                            const dbTitle = databaseInfo.title[0]?.plain_text?.toLowerCase() || "";
                            if (dbTitle === title.toLowerCase()) {
                                return databaseInfo;
                            }
                        }
                    } catch (error) {
                        console.error(`Error retrieving database ${block.id}:`, error);
                    }
                }
            }

            hasMore = response.has_more;
            startCursor = response.next_cursor || undefined;
        }

        return null;
    } catch (error) {
        console.error("Error finding database:", error);
        return null;
    }
}

async function addTestContent() {
    try {
        console.log('🚀 Dodajem test sadržaj u Notion baze...');
        
        // 1. Dodaj blog postove
        const blogDb = await findDatabaseByTitle('Blog Posts');
        if (blogDb) {
            console.log('📝 Dodajem blog postove...');
            const blogPosts = [
                {
                    title: '5 Najčešćih Grešaka u Ishrani',
                    excerpt: 'Otkrijte koje greške u ishrani većina ljudi pravi i kako ih jednostavno izbeci za bolje rezultate.',
                    content: 'Kroz moje godine rada kao nutricionista, primetila sam da se iste greške ponavljaju kod većine klijenata. Evo 5 najčešćih grešaka i kako ih izbeci...',
                    category: 'Saveti',
                    slug: 'najcesce-greske-u-ishrani',
                    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400'
                },
                {
                    title: 'Mediteranska Dijeta - Kompletni Vodič',
                    excerpt: 'Sve što trebate da znate o mediteranskoj dijeti, sa praktičnim savetima i receptima.',
                    content: 'Mediteranska dijeta nije samo način ishrane, već celokupan pristup zdravom životu. Evo kako da je primenite...',
                    category: 'Planovi ishrane',
                    slug: 'mediteranska-dijeta-vodic',
                    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&h=400'
                },
                {
                    title: 'Brzi i Zdravi Doručkovi',
                    excerpt: '10 ideja za nutritivne doručkove koji se pripremaju za manje od 15 minuta.',
                    content: 'Doručak je najvažniji obrok dana, ali ne mora biti komplikovan. Evo mojih omiljenih brzih recepata...',
                    category: 'Recepti',
                    slug: 'brzi-zdravi-doruckovi',
                    image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=600&h=400'
                },
                {
                    title: 'Kako Povećati Energiju Prirodno',
                    excerpt: 'Prirodni načini za povećanje energije kroz pravilnu ishranu i životne navike.',
                    content: 'Umor i nedostatak energije često su rezultat neadekvatne ishrane. Evo kako to možete promeniti...',
                    category: 'Zdravlje',
                    slug: 'povecanje-energije-prirodno',
                    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400'
                },
                {
                    title: 'Planiranje Obroka za Početnike',
                    excerpt: 'Jednostavan vodič kroz planiranje sedmičnih obroka koji će vam uštedet vreme i novac.',
                    content: 'Planiranje obroka je ključ uspešne zdrave ishrane. Evo kako da počnete...',
                    category: 'Planovanje',
                    slug: 'planiranje-obroka-pocetnici',
                    image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=600&h=400'
                }
            ];

            for (let post of blogPosts) {
                await notion.pages.create({
                    parent: { database_id: blogDb.id },
                    properties: {
                        Title: { title: [{ text: { content: post.title } }] },
                        Excerpt: { rich_text: [{ text: { content: post.excerpt } }] },
                        Content: { rich_text: [{ text: { content: post.content } }] },
                        Category: { select: { name: post.category } },
                        Image: { url: post.image },
                        Date: { date: { start: new Date().toISOString().split('T')[0] } },

                        Published: { checkbox: true }
                    }
                });
            }
            console.log('✅ Dodano 5 blog postova');
        }

        // 2. Dodaj announcements
        const announcementDb = await findDatabaseByTitle('Announcements');
        if (announcementDb) {
            console.log('📢 Dodajem announcements...');
            const announcements = [
                {
                    title: 'Specijalna Ponuda - 20% Popusta na Online Konsultacije',
                    content: 'Tokom ovog meseca, sve online konsultacije su sa 20% popusta! Idealna prilika da počnete svoje putovanje ka zdravijoj ishrani.',
                    type: 'Promocija'
                },
                {
                    title: 'Nova Usluga: Grupne Radionice',
                    content: 'Lansiramo grupne radionice o zdravoj ishrani! Učite sa drugima i delite iskustva u prijalnoj atmosferi.',
                    type: 'Nova usluga'
                },
                {
                    title: 'Besplatni Webinar: "Osnove Zdrave Ishrane"',
                    content: 'Pridružite se našem besplatnom webinaru gde ćemo pokriti osnove zdrave ishrane koje svako treba da zna.',
                    type: 'Događaj'
                }
            ];

            for (let announcement of announcements) {
                await notion.pages.create({
                    parent: { database_id: announcementDb.id },
                    properties: {
                        Title: { title: [{ text: { content: announcement.title } }] },
                        Content: { rich_text: [{ text: { content: announcement.content } }] },
                        Type: { select: { name: announcement.type } },
                        Date: { date: { start: new Date().toISOString().split('T')[0] } },
                        Active: { checkbox: true }
                    }
                });
            }
            console.log('✅ Dodano 3 announcements');
        }

        // 3. Dodaj testimonials
        const testimonialsDb = await findDatabaseByTitle('Testimonials');
        if (testimonialsDb) {
            console.log('⭐ Dodajem testimonials...');
            const testimonials = [
                {
                    name: 'Marija Petrović',
                    role: 'Profesorka, 34 godine',
                    content: 'Jelena mi je potpuno promenila pristup ishrani! Kroz njen program sam smršala 12kg i naučila kako da se hranim zdravo bez odricanja. Preporučujem svima koji žele trajne promene!',
                    rating: 5
                },
                {
                    name: 'Stefan Jovanović',
                    role: 'IT Menadžer, 29 godina',
                    content: 'Kao neko ko radi za kompjuterom ceo dan, uvek sam imao problema sa ishranom. Jelenin plan je bio praktičan i lako primenljiv. Za 3 meseca sam dobio energiju koju nisam imao godinama!',
                    rating: 5
                },
                {
                    name: 'Ana Milosavljević',
                    role: 'Mama dvoje dece, 31 godina',
                    content: 'Posle drugog porođaja nisam mogla da se vratim u formu. Jelena je kreirala plan koji se uklapao u moj užurban raspored mame. Rezultati su bili fantastični, a što je najvažnije - održivi!',
                    rating: 5
                },
                {
                    name: 'Nikola Stojanović',
                    role: 'Sportista, 26 godina',
                    content: 'Trebao mi je profesionalan pristup ishrani za poboljšanje sportskih performansi. Jelenin plan je bio presudna sa povećanjem moje izdržljivosti i brzine oporavka. Hvala!',
                    rating: 5
                },
                {
                    name: 'Milica Đorđević',
                    role: 'Student medicine, 22 godine',
                    content: 'Kao student sa ograničenim budžetom, mislila sam da zdrava ishrana nije dostupna. Jelena mi je pokazala kako da se hranim zdravo i ekonomično. Saveti su mi dragoceni!',
                    rating: 5
                }
            ];

            for (let testimonial of testimonials) {
                await notion.pages.create({
                    parent: { database_id: testimonialsDb.id },
                    properties: {
                        Name: { title: [{ text: { content: testimonial.name } }] },
                        Role: { rich_text: [{ text: { content: testimonial.role } }] },
                        Content: { rich_text: [{ text: { content: testimonial.content } }] },
                        Rating: { number: testimonial.rating },
                        Date: { date: { start: new Date().toISOString().split('T')[0] } },
                        Active: { checkbox: true }
                    }
                });
            }
            console.log('✅ Dodano 5 testimonials');
        }

        console.log('🎉 Sav test sadržaj je uspešno dodat u Notion!');
        console.log('📱 Sadržaj će se automatski pojaviti na vašem sajtu.');
        
    } catch (error) {
        console.error('❌ Greška pri dodavanju sadržaja:', error.message);
    }
}

addTestContent();