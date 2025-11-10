import { useState } from "react";
import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
export interface BlogPost {
  id: number | string;
  title: string;
  excerpt: string;
  category: "recipes" | "nutrition" | "wellness" | "weight loss" | "meal planning";
  image: string;
  date: string;
  slug: string;
}
// Fallback blog posts when API data is not available
const fallbackPosts: BlogPost[] = [
  {
    id: 1,
    title: "Supermoć: napraviti od ničega ručak",
    excerpt:
      "Kažu da nisu sve heroji u plaštovima. Neki nose kecelju, u jednoj ruci drže varjaču.",
    category: "recipes",
    image:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    date: "27. maj 2025.",
    slug: "supermoc-napraviti-od-nicega-rucak",
  },
  {
    id: 2,
    title: "Razumevanje makronutrijenata",
    excerpt:
      "Saznajte o proteinima, ugljenim hidratima i mastima - šta rade u vašem telu i kako ih balansirati za optimalno zdravlje.",
    category: "nutrition",
    image:
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    date: "8. jun 2023.",
    slug: "razumevanje-makronutrijenata",
  },
  {
    id: 3,
    title: "Kako stres utiče na vašu ishranu",
    excerpt:
      "Otkrijte složenu vezu između stresa i obrazaca ishrane, i naučite strategije za održavanje zdravih navika tokom stresnih trenutaka.",
    category: "wellness",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    date: "1. jun 2023.",
    slug: "stres-i-isharanu",
  },
];
type Category = "all" | "recipes" | "nutrition" | "wellness" | "weight loss" | "meal planning";
interface BlogSectionProps {
  posts?: BlogPost[];
}
export default function BlogSection({ posts }: BlogSectionProps) {
  const [activeFilter, setActiveFilter] = useState<Category>("all");
  const blogPosts = posts || fallbackPosts;

  const { ref: headerRef, inView: headerInView } = useAnimateOnScroll();
  const { ref: filtersRef, inView: filtersInView } = useAnimateOnScroll(0.15);
  const { ref: ctaRef, inView: ctaInView } = useAnimateOnScroll(0.5);
  const filteredPosts =
    activeFilter === "all"
      ? blogPosts
      : blogPosts.filter((post) => post.category === activeFilter);
  const handleFilterChange = (category: Category) => {
    setActiveFilter(category);
  };
  return (
    <section id="blog" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-primary font-medium tracking-wide uppercase mb-2">
            BLOG O ISHRANI
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
            Recepti i Saveti o Ishrani
          </h2>
          <p className="text-gray-600">
            Istražite našu kolekciju zdravih recepata, saveta o ishrani i
            wellness saveta da vam pomognemo na vašem putovanju ka boljem
            zdravlju.
          </p>
        </motion.div>

        {/* Blog filter tabs */}
        <motion.div
          ref={filtersRef}
          initial={{ opacity: 0, y: 20 }}
          animate={filtersInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-wrap justify-center mb-12"
        >
          <button
            onClick={() => handleFilterChange("all")}
            className={`px-6 py-2 m-1 rounded-full font-medium transition ${
              activeFilter === "all"
                ? "bg-primary text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            Sve
          </button>
          <button
            onClick={() => handleFilterChange("recipes")}
            className={`px-6 py-2 m-1 rounded-full font-medium transition ${
              activeFilter === "recipes"
                ? "bg-primary text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            Recepti
          </button>
          <button
            onClick={() => handleFilterChange("nutrition")}
            className={`px-6 py-2 m-1 rounded-full font-medium transition ${
              activeFilter === "nutrition"
                ? "bg-primary text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            Saveti o Ishrani
          </button>
          <button
            onClick={() => handleFilterChange("wellness")}
            className={`px-6 py-2 m-1 rounded-full font-medium transition ${
              activeFilter === "wellness"
                ? "bg-primary text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            Wellness
          </button>
          <button
            onClick={() => handleFilterChange("weight loss")}
            className={`px-6 py-2 m-1 rounded-full font-medium transition ${
              activeFilter === "weight loss"
                ? "bg-primary text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
            data-testid="filter-weight-loss"
          >
            Mršavljenje
          </button>
          <button
            onClick={() => handleFilterChange("meal planning")}
            className={`px-6 py-2 m-1 rounded-full font-medium transition ${
              activeFilter === "meal planning"
                ? "bg-primary text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
            data-testid="filter-meal-planning"
          >
            Planiranje Obroka
          </button>
        </motion.div>

        {/* Blog posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <BlogPostCard key={post.id} post={post} index={index} />
          ))}
        </div>

        <motion.div
          ref={ctaRef}
          initial={{ opacity: 0, y: 20 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <a
            href="#"
            className="inline-block px-8 py-4 bg-white hover:bg-gray-100 text-primary border border-primary rounded-md font-medium transition duration-300 ease-in-out shadow-md hover:shadow-lg"
          >
            Pogledajte Sve Članke
          </a>
        </motion.div>
      </div>
    </section>
  );
}
function BlogPostCard({ post, index }: { post: BlogPost; index: number }) {
  const { ref, inView } = useAnimateOnScroll(0.2 + index * 0.1);
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "recipes":
        return "Recept";
      case "nutrition":
        return "Saveti o Ishrani";
      case "wellness":
        return "Wellness";
      case "weight loss":
        return "Mršavljenje";
      case "meal planning":
        return "Planiranje Obroka";
      default:
        return category;
    }
  };
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
      className="bg-white rounded-xl overflow-hidden shadow-lg"
    >
      <div className="h-56 overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center mb-3">
          <span className="bg-primary-light bg-opacity-20 text-primary-dark text-xs px-3 py-1 rounded-full">
            {getCategoryLabel(post.category)}
          </span>
          <span className="text-gray-500 text-sm ml-auto">{post.date}</span>
        </div>
        <h3 className="text-xl font-bold font-poppins mb-3">{post.title}</h3>
        <p className="text-gray-600 mb-4">{post.excerpt}</p>
        <a
          href={`/blog/${post.slug}`}
          className="text-primary font-medium hover:text-primary-dark transition flex items-center"
        >
          {post.category === "recipes"
            ? "Pročitajte Recept"
            : "Pročitajte Članak"}{" "}
          <i className="fas fa-arrow-right ml-2 text-sm"></i>
        </a>
      </div>
    </motion.div>
  );
}
