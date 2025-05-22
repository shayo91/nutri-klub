import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { useState } from "react";

type PodcastEpisode = {
  id: number;
  title: string;
  description: string;
  duration: string;
  image: string;
  audioUrl: string;
};

const podcastEpisodes: PodcastEpisode[] = [
  {
    id: 1,
    title: "The Ultimate Guide to Balanced Nutrition",
    description: "Learn about the essential nutrients your body needs and how to create a balanced diet that supports your goals.",
    duration: "32:15",
    image: "https://images.unsplash.com/photo-1599508704512-2f19efd1e35f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    audioUrl: "#podcast-sample-1"
  },
  {
    id: 2,
    title: "Superfoods: Facts vs. Fiction",
    description: "Debunking myths around superfoods and highlighting truly nutritious options that deserve a place in your diet.",
    duration: "28:45",
    image: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    audioUrl: "#podcast-sample-2"
  },
  {
    id: 3,
    title: "Nutrition for Peak Mental Performance",
    description: "Discover how specific foods and nutrients can improve focus, memory, and overall cognitive function.",
    duration: "37:20",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    audioUrl: "#podcast-sample-3"
  }
];

export default function PodcastSection() {
  const { ref, inView } = useAnimateOnScroll();
  const [activePodcast, setActivePodcast] = useState<PodcastEpisode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = (episode: PodcastEpisode) => {
    if (activePodcast?.id === episode.id) {
      setIsPlaying(!isPlaying);
    } else {
      setActivePodcast(episode);
      setIsPlaying(true);
    }
  };

  return (
    <section id="podcasts" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div 
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <p className="text-primary font-medium tracking-wide uppercase mb-2">NUTRITION PODCASTS</p>
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
            Listen to Expert Nutrition Advice
          </h2>
          <p className="text-gray-600">
            Tune into our podcasts for the latest nutrition insights, expert interviews, and practical tips to enhance your health journey.
          </p>
        </motion.div>

        {/* Podcast Player */}
        {activePodcast && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-6 rounded-xl shadow-lg mb-12 max-w-4xl mx-auto"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img 
                src={activePodcast.image} 
                alt={activePodcast.title} 
                className="w-40 h-40 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{activePodcast.title}</h3>
                <p className="text-gray-600 mb-4">{activePodcast.description}</p>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors"
                    aria-label={isPlaying ? "Pause podcast" : "Play podcast"}
                  >
                    {isPlaying ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: isPlaying ? "45%" : "0%" }}></div>
                    </div>
                  </div>
                  <span className="text-gray-500">{activePodcast.duration}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Podcast Episodes List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {podcastEpisodes.map((episode, index) => (
            <motion.div
              key={episode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer ${
                activePodcast?.id === episode.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => handlePlayPause(episode)}
            >
              <div className="relative">
                <img 
                  src={episode.image} 
                  alt={episode.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-opacity">
                  <div className="bg-white bg-opacity-90 rounded-full p-3">
                    {activePodcast?.id === episode.id && isPlaying ? (
                      <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="bg-primary bg-opacity-10 text-primary text-sm font-medium px-2 py-1 rounded">Episode {episode.id}</span>
                  <span className="text-gray-500 text-sm">{episode.duration}</span>
                </div>
                <h3 className="font-bold text-lg mb-2">{episode.title}</h3>
                <p className="text-gray-600 line-clamp-2">{episode.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}