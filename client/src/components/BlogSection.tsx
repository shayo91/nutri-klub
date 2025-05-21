import { useState } from "react";
import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: "recipes" | "nutrition" | "wellness";
  image: string;
  date: string;
  slug: string;
}

// Fallback blog posts when API data is not available
const fallbackPosts: BlogPost[] = [
  {
    id: 1,
    title: "Protein-Packed Breakfast Bowl",
    excerpt: "Start your day right with this nutrient-dense breakfast bowl featuring Greek yogurt, berries, and homemade granola.",
    category: "recipes",
    image: "https://images.unsplash.com/photo-1494859802809-d069c3b71a8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    date: "June 15, 2023",
    slug: "protein-packed-breakfast-bowl"
  },
  {
    id: 2,
    title: "Understanding Macronutrients",
    excerpt: "Learn about proteins, carbs, and fats - what they do in your body and how to balance them for optimal health.",
    category: "nutrition",
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    date: "June 8, 2023",
    slug: "understanding-macronutrients"
  },
  {
    id: 3,
    title: "How Stress Affects Your Nutrition",
    excerpt: "Discover the intricate relationship between stress and eating patterns, and learn strategies to maintain healthy habits during stressful times.",
    category: "wellness",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    date: "June 1, 2023",
    slug: "stress-and-nutrition"
  }
];

type Category = "all" | "recipes" | "nutrition" | "wellness";

interface BlogSectionProps {
  posts?: BlogPost[];
}

export default function BlogSection({ posts }: BlogSectionProps) {
  const [activeFilter, setActiveFilter] = useState<Category>("all");
  const blogPosts = posts || fallbackPosts;
  
  const { ref: headerRef, inView: headerInView } = useAnimateOnScroll();
  const { ref: filtersRef, inView: filtersInView } = useAnimateOnScroll(0.15);
  const { ref: ctaRef, inView: ctaInView } = useAnimateOnScroll(0.5);

  const filteredPosts = activeFilter === "all" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeFilter);

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
          <p className="text-primary font-medium tracking-wide uppercase mb-2">NUTRITION BLOG</p>
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
            Recipes & Nutrition Tips
          </h2>
          <p className="text-gray-600">
            Explore our collection of healthy recipes, nutrition advice, and wellness tips to help you on your journey to better health.
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
            All
          </button>
          <button 
            onClick={() => handleFilterChange("recipes")}
            className={`px-6 py-2 m-1 rounded-full font-medium transition ${
              activeFilter === "recipes" 
                ? "bg-primary text-white" 
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            Recipes
          </button>
          <button 
            onClick={() => handleFilterChange("nutrition")}
            className={`px-6 py-2 m-1 rounded-full font-medium transition ${
              activeFilter === "nutrition" 
                ? "bg-primary text-white" 
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            Nutrition Tips
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
            View All Articles
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function BlogPostCard({ post, index }: { post: BlogPost; index: number }) {
  const { ref, inView } = useAnimateOnScroll(0.2 + (index * 0.1));

  const getCategoryLabel = (category: string) => {
    switch(category) {
      case "recipes": return "Recipe";
      case "nutrition": return "Nutrition Tips";
      case "wellness": return "Wellness";
      default: return category;
    }
  };

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: 0.2 + (index * 0.1) }}
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
        <p className="text-gray-600 mb-4">
          {post.excerpt}
        </p>
        <a 
          href={`/blog/${post.slug}`} 
          className="text-primary font-medium hover:text-primary-dark transition flex items-center"
        >
          {post.category === "recipes" ? "Read Recipe" : "Read Article"} <i className="fas fa-arrow-right ml-2 text-sm"></i>
        </a>
      </div>
    </motion.div>
  );
}
