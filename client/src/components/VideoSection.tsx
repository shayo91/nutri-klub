import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { useState } from "react";

type VideoContent = {
  id: number;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  category: "diet" | "cooking" | "nutrition";
};

const videoContent: VideoContent[] = [
  {
    id: 1,
    title: "5 Simple Meal Prep Tips for Busy Professionals",
    description: "Learn how to prepare healthy meals for the entire week in just a couple of hours with these efficient meal prep strategies.",
    duration: "8:24",
    thumbnail: "https://images.unsplash.com/photo-1543362906-acfc16c67564?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    videoUrl: "#video-sample-1",
    category: "cooking"
  },
  {
    id: 2,
    title: "Understanding Macronutrients for Optimal Health",
    description: "A complete guide to proteins, carbohydrates, and fats - how they affect your body and how to balance them correctly.",
    duration: "12:37",
    thumbnail: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    videoUrl: "#video-sample-2",
    category: "nutrition"
  },
  {
    id: 3,
    title: "Mindful Eating Practices for Weight Management",
    description: "Discover how mindful eating techniques can transform your relationship with food and support weight management goals.",
    duration: "15:50",
    thumbnail: "https://images.unsplash.com/photo-1607532941433-304659e8198a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    videoUrl: "#video-sample-3",
    category: "diet"
  },
  {
    id: 4,
    title: "Healthy Cooking Methods to Preserve Nutrients",
    description: "Learn various cooking techniques that maintain the nutritional value of your food while enhancing flavor.",
    duration: "10:15",
    thumbnail: "https://images.unsplash.com/photo-1556911220-bda9f7b43643?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    videoUrl: "#video-sample-4",
    category: "cooking"
  }
];

export default function VideoSection() {
  const { ref, inView } = useAnimateOnScroll();
  const [activeVideo, setActiveVideo] = useState<VideoContent | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredVideos = selectedCategory === "all" 
    ? videoContent 
    : videoContent.filter(video => video.category === selectedCategory);

  return (
    <section id="videos" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <p className="text-primary font-medium tracking-wide uppercase mb-2">NUTRITION VIDEOS</p>
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
            Watch Valuable Nutrition Content
          </h2>
          <p className="text-gray-600 mb-8">
            Explore our video library filled with practical advice, cooking demonstrations, and nutritional insights to help you on your health journey.
          </p>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === "all" 
                  ? "bg-primary text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Videos
            </button>
            <button
              onClick={() => setSelectedCategory("cooking")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === "cooking" 
                  ? "bg-primary text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Cooking Tips
            </button>
            <button
              onClick={() => setSelectedCategory("nutrition")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === "nutrition" 
                  ? "bg-primary text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Nutrition Science
            </button>
            <button
              onClick={() => setSelectedCategory("diet")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === "diet" 
                  ? "bg-primary text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Diet Strategies
            </button>
          </div>
        </motion.div>

        {/* Featured Video Player */}
        {activeVideo && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-16 max-w-5xl mx-auto"
          >
            <div className="bg-black rounded-xl overflow-hidden shadow-2xl aspect-video relative">
              {/* This would typically be a video player - using a placeholder image for demo */}
              <img 
                src={activeVideo.thumbnail} 
                alt={activeVideo.title} 
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white bg-opacity-90 rounded-full p-4 shadow-lg hover:bg-opacity-100 transition-all cursor-pointer">
                  <svg className="w-10 h-10 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                <h3 className="text-white text-xl md:text-2xl font-bold mb-2">{activeVideo.title}</h3>
                <p className="text-gray-300">{activeVideo.description}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer group ${
                activeVideo?.id === video.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setActiveVideo(video)}
            >
              <div className="relative">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs font-medium px-2 py-1 rounded">
                  {video.duration}
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity">
                  <div className="bg-white bg-opacity-0 group-hover:bg-opacity-90 rounded-full p-3 scale-0 group-hover:scale-100 transition-transform">
                    <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    video.category === 'cooking' ? 'bg-green-100 text-green-700' :
                    video.category === 'nutrition' ? 'bg-blue-100 text-blue-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {video.category.charAt(0).toUpperCase() + video.category.slice(1)}
                  </span>
                </div>
                <h3 className="font-bold line-clamp-2 mb-2">{video.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{video.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}