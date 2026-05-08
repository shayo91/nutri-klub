/**
 * Seed e-books for development
 * Run: npx tsx server/seed-ebooks.ts
 */

import { db } from "./db";
import { ebooks } from "@shared/schema";

const sampleEbooks = [
  {
    title: "Vodič za Zdravu Ishranu",
    description: "Kompletan vodič kroz osnove zdrave ishrane, makronutrijente i kako sastaviti balansiran obrok. Savršeno za početnike!",
    author: "Jelena Matijaš",
    category: "guides",
    pages: 45,
    coverImageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400",
    pdfUrl: "/ebooks/vodic-za-zdravu-ishranu.pdf",
    fileSize: 2500, // 2.5 MB
    isPremium: false, // FREE e-book
    isFeatured: true,
    downloadCount: 0,
  },
  {
    title: "Keto Dijeta za Početnike",
    description: "Sve što trebaš da znaš o ketogenoj dijeti - plan ishrane, recepti, saveti i česte greške koje treba izbegavati.",
    author: "Jelena Matijaš",
    category: "keto",
    pages: 68,
    coverImageUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400",
    pdfUrl: "/ebooks/keto-dijeta-za-pocetnike.pdf",
    fileSize: 3200,
    isPremium: true,
    isFeatured: true,
    downloadCount: 0,
  },
  {
    title: "Meal Prep za Zaposlene",
    description: "Kako da pripremiš obroke za celu nedelju za samo 2 sata? Praktični saveti, recepti i shopping lista.",
    author: "Jelena Matijaš",
    category: "meal_prep",
    pages: 52,
    coverImageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400",
    pdfUrl: "/ebooks/meal-prep-za-zaposlene.pdf",
    fileSize: 2800,
    isPremium: true,
    isFeatured: false,
    downloadCount: 0,
  },
  {
    title: "50 Zdravih Recepata",
    description: "Kolekcija od 50 ukusnih i zdravih recepata za doručak, ručak i večeru. Sa nutricionim vrednostima i slikama.",
    author: "Jelena Matijaš",
    category: "recipes",
    pages: 120,
    coverImageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
    pdfUrl: "/ebooks/50-zdravih-recepata.pdf",
    fileSize: 5500,
    isPremium: true,
    isFeatured: true,
    downloadCount: 0,
  },
  {
    title: "Gubitak Težine bez Gladi",
    description: "Naučni pristup gubitku težine - kako da smršaš bez drastičnih dijeta i konstantne gladi. Održivo i zdravo!",
    author: "Jelena Matijaš",
    category: "weight_loss",
    pages: 75,
    coverImageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    pdfUrl: "/ebooks/gubitak-tezine-bez-gladi.pdf",
    fileSize: 3500,
    isPremium: true,
    isFeatured: false,
    downloadCount: 0,
  },
  {
    title: "Vegetarijanska Ishrana",
    description: "Kako da sastaviš balansiran vegetarijanski jelovnik? Proteini, vitamini, minerali i ukusni recepti.",
    author: "Jelena Matijaš",
    category: "guides",
    pages: 58,
    coverImageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
    pdfUrl: "/ebooks/vegetarijanska-ishrana.pdf",
    fileSize: 2900,
    isPremium: true,
    isFeatured: false,
    downloadCount: 0,
  },
  {
    title: "Zdrave Grickalice",
    description: "30+ recepata za zdrave snackove koji su ukusni, brzi i neće ti poremetiti dijetu. Idealno za posao ili školu!",
    author: "Jelena Matijaš",
    category: "recipes",
    pages: 35,
    coverImageUrl: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400",
    pdfUrl: "/ebooks/zdrave-grickalice.pdf",
    fileSize: 1800,
    isPremium: true,
    isFeatured: false,
    downloadCount: 0,
  },
  {
    title: "Proteinska Ishrana",
    description: "Sve o proteinima - koliko ti treba, najbolji izvori, recepti i suplementacija. Za sportiste i aktivne osobe.",
    author: "Jelena Matijaš",
    category: "guides",
    pages: 62,
    coverImageUrl: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400",
    pdfUrl: "/ebooks/proteinska-ishrana.pdf",
    fileSize: 3100,
    isPremium: true,
    isFeatured: false,
    downloadCount: 0,
  },
];

async function seedEbooks() {
  console.log("📚 Seeding e-books...\n");

  try {
    const insertedEbooks = await db.insert(ebooks).values(sampleEbooks).returning();
    
    console.log(`✅ Inserted ${insertedEbooks.length} e-books:`);
    insertedEbooks.forEach((ebook) => {
      const premiumBadge = ebook.isPremium ? "🔒 Premium" : "🆓 FREE";
      const featuredBadge = ebook.isFeatured ? "⭐" : "";
      console.log(`   ${premiumBadge} ${featuredBadge} ${ebook.title} (${ebook.category})`);
    });

    console.log("\n🎉 E-books seeded successfully!");
    console.log(`\n📊 Summary:`);
    console.log(`   Total: ${insertedEbooks.length}`);
    console.log(`   FREE: ${insertedEbooks.filter(e => !e.isPremium).length}`);
    console.log(`   Premium: ${insertedEbooks.filter(e => e.isPremium).length}`);
    console.log(`   Featured: ${insertedEbooks.filter(e => e.isFeatured).length}`);
  } catch (error) {
    console.error("❌ Error seeding e-books:", error);
    throw error;
  }
}

// Run seeding
seedEbooks()
  .then(() => {
    console.log("\n✅ Seeding complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Seeding failed:", error);
    process.exit(1);
  });

export { seedEbooks };
