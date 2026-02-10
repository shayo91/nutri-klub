import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { Link } from "wouter";

export interface BlogPost {
  id: number | string;
  title: string;
  excerpt: string;
  category: string;
  categories?: string[];
  image: string;
  date: string;
  slug: string;
}

const fallbackPosts: BlogPost[] = [
  {
    id: 1,
    title: "Supermoć: napraviti od ničega ručak",
    excerpt:
      "Kažu da nisu svi heroji u plaštovima. Neki nose kecelju, u jednoj ruci drže varjaču.",
    category: "Recepti",
    categories: ["Recepti", "Savjeti"],
    image:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    date: "27. maj 2025.",
    slug: "supermoc-napraviti-od-nicega-rucak",
  },
  {
    id: 2,
    title: "Razumijevanje makronutrijenata",
    excerpt:
      "Saznajte o proteinima, ugljenim hidratima i mastima - šta rade u vašem tijelu i kako ih balansirati za optimalno zdravlje.",
    category: "Savjeti",
    categories: ["Savjeti", "Zdravlje"],
    image:
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    date: "8. jun 2023.",
    slug: "razumijevanje-makronutrijenata",
  },
  {
    id: 3,
    title: "Kako stres utiče na vašu ishranu",
    excerpt:
      "Otkrijte složenu vezu između stresa i obrazaca ishrane, i naučite strategije za održavanje zdravih navika tokom stresnih trenutaka.",
    category: "Zdravlje",
    categories: ["Zdravlje", "Savjeti"],
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    date: "1. jun 2023.",
    slug: "stres-i-ishrana",
  },
];

const POSTS_PER_PAGE = 3;

interface BlogSectionProps {
  posts?: BlogPost[];
  categories?: string[];
}

export default function BlogSection({ posts, categories }: BlogSectionProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const blogPosts = posts || fallbackPosts;
  const availableCategories = categories || ["Recepti", "Savjeti", "Zdravlje", "Planovi ishrane", "Mršavljenje", "Debljanje"];

  const { ref: headerRef, inView: headerInView } = useAnimateOnScroll();
  const { ref: filtersRef, inView: filtersInView } = useAnimateOnScroll(0.15);
  const { ref: loadMoreRef, inView: loadMoreInView } = useAnimateOnScroll(0.3);

  const filteredPosts =
    activeFilter === "all"
      ? blogPosts
      : blogPosts.filter((post) => {
          if (post.categories && post.categories.length > 0) {
            return post.categories.includes(activeFilter);
          }
          return post.category === activeFilter;
        });

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMorePosts = visibleCount < filteredPosts.length;

  const handleFilterChange = (category: string) => {
    setActiveFilter(category);
    setVisibleCount(POSTS_PER_PAGE);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + POSTS_PER_PAGE);
  };

  return (
    <section id="blog" aria-label="Blog o ishrani" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-[#5DAD8C] font-semibold tracking-wide uppercase mb-2">
            BLOG O ISHRANI
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6 text-gray-800">
            Recepti i Savjeti o Ishrani
          </h2>
          <p className="text-gray-700">
            Istražite našu kolekciju zdravih recepata, savjeta o ishrani i
            wellness savjeta da vam pomognemo na vašem putovanju ka boljem
            zdravlju.
          </p>
        </motion.div>

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
                ? "text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
            style={activeFilter === "all" ? { backgroundColor: "rgb(93, 173, 140)" } : {}}
          >
            Sve
          </button>
          {availableCategories.map((category) => (
            <button
              key={category}
              onClick={() => handleFilterChange(category)}
              className={`px-6 py-2 m-1 rounded-full font-medium transition ${
                activeFilter === category
                  ? "text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
              style={activeFilter === category ? { backgroundColor: "rgb(93, 173, 140)" } : {}}
            >
              {category}
            </button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visiblePosts.map((post, index) => (
            <BlogPostCard key={post.id} post={post} index={index} />
          ))}
        </div>

        {hasMorePosts && (
          <motion.div
            ref={loadMoreRef}
            initial={{ opacity: 0, y: 20 }}
            animate={loadMoreInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <button
              onClick={handleLoadMore}
              className="inline-block px-8 py-4 text-white rounded-md font-medium transition duration-300 ease-in-out shadow-md hover:shadow-lg hover:opacity-90"
              style={{ backgroundColor: "rgb(93, 173, 140)" }}
            >
              Učitaj Još
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function BlogPostCard({ post, index }: { post: BlogPost; index: number }) {
  const { ref, inView } = useAnimateOnScroll(0.2 + index * 0.1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  const displayCategory = post.categories && post.categories.length > 0
    ? post.categories[0]
    : post.category;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
    >
      <Link href={`/blog/${post.slug}`}>
        <div className="bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl h-full flex flex-col">
          <div className="h-56 overflow-hidden bg-gray-100 relative">
            {!imageLoaded && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gray-300"></div>
              </div>
            )}
            <img
              src={imageError ? "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop" : post.image}
              alt={`${post.title} - savjeti nutricioniste za zdravu ishranu`}
              className={`w-full h-full object-cover transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>
          <div className="p-6 flex flex-col flex-grow">
            <div className="flex items-center mb-3">
              <span 
                className="text-white text-xs px-3 py-1 rounded-full font-medium"
                style={{ backgroundColor: "rgb(93, 173, 140)" }}
              >
                {displayCategory}
              </span>
              <span className="text-gray-500 text-sm ml-auto">{post.date}</span>
            </div>
            <h3 className="text-xl font-bold font-poppins mb-3 text-gray-800">{post.title}</h3>
            <p className="text-gray-600 mb-4 flex-grow">{post.excerpt}</p>
            <span
              className="font-medium transition flex items-center"
              style={{ color: "rgb(93, 173, 140)" }}
            >
              Pročitajte Članak{" "}
              <i className="fas fa-arrow-right ml-2 text-sm"></i>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
