import { useState } from "react";
import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";

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
    title: "5 Jednostavnih Saveta za Pripremu Obroka za Zaposlene",
    description:
      "Saznajte kako pripremiti zdrave obroke za celu nedelju u roku od nekoliko sati uz ove efikasne strategije za pripremu obroka.",
    duration: "8:24",
    thumbnail:
      "https://images.unsplash.com/photo-1543362906-acfc16c67564?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    videoUrl: "#video-sample-1",
    category: "cooking",
  },
  {
    id: 2,
    title: "Razumevanje Makronutrijenata za Optimalno Zdravlje",
    description:
      "Sveobuhvatan vodič za proteine, ugljene hidrate i masti - kako utiču na vaše telo i kako ih pravilno balansirati.",
    duration: "12:37",
    thumbnail:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    videoUrl: "#video-sample-2",
    category: "nutrition",
  },
  {
    id: 3,
    title: "Praktike Svrsne Ishrane za Upravljanje Težinom",
    description:
      "Otkrijte kako tehnike svrsne ishrane mogu transformisati vaš odnos sa hranom i podržati ciljeve upravljanja težinom.",
    duration: "15:50",
    thumbnail:
      "https://images.unsplash.com/photo-1607532941433-304659e8198a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    videoUrl: "#video-sample-3",
    category: "diet",
  },
  {
    id: 4,
    title: "Zdrave Tehnike Kuvanja za Očuvanje Nutrijenata",
    description:
      "Saznajte razne tehnike kuvanja koje održavaju nutritivnu vrednost vaše hrane dok poboljšavaju ukus.",
    duration: "10:15",
    thumbnail:
      "https://images.unsplash.com/photo-1501342433635-bc065ab7b543?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    videoUrl: "#video-sample-4",
    category: "nutrition",
  },
];

export default function VideoSection() {
  const { ref, inView } = useAnimateOnScroll();
  const [activeVideo, setActiveVideo] = useState<VideoContent | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredVideos =
    selectedCategory === "all"
      ? videoContent
      : videoContent.filter((video) => video.category === selectedCategory);

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
          <p className="text-primary font-medium tracking-wide uppercase mb-2">
            NUTRITIVNI VIDEI
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
            Gledajte Vredne Nutricionističke Sadržaje
          </h2>
          <p className="text-gray-600 mb-8">
            Istražite našu biblioteku videa koja je puna praktičnih saveta,
            demonstracija kuvanja i nutricionističkih uvida koji će vam pomoći
            na vašem putu do zdravlja.
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
              Svi Videi
            </button>
            <button
              onClick={() => setSelectedCategory("cooking")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === "cooking"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Kuvanje
            </button>
            <button
              onClick={() => setSelectedCategory("nutrition")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === "nutrition"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Ishrana
            </button>
            <button
              onClick={() => setSelectedCategory("diet")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === "diet"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Dijeta
            </button>
          </div>
        </motion.div>

        {/* Video Previews */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <motion.div
              key={video.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold line-clamp-2 mb-2">{video.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {video.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
