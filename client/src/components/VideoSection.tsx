import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { useLanguage } from "@/hooks/useLanguage";

type VideoContent = {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  category: string;
};

export default function VideoSection() {
  const { t } = useLanguage();
  const { ref: headerRef, inView: headerInView } = useAnimateOnScroll();
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState<VideoContent | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/videos');
      if (response.ok) {
        const data = await response.json();
        setVideos(data);
        if (data.length > 0) {
          setCurrentVideo(data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = (video: VideoContent) => {
    if (currentVideo?.id === video.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentVideo(video);
      setIsPlaying(true);
    }
  };

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Učitavam videe...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-primary font-medium tracking-wide uppercase mb-2">
            {t("videos.subtitle")}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
            {t("videos.title")}
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            {t("videos.description")}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Main Video Player */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            {currentVideo && (
              <>
                <div className="relative">
                  <img
                    src={currentVideo.thumbnail}
                    alt={currentVideo.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <button
                      onClick={() => handlePlayPause(currentVideo)}
                      className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 transition-all transform hover:scale-110"
                    >
                      {isPlaying && currentVideo ? (
                        <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                        </svg>
                      ) : (
                        <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm">
                    {currentVideo.duration}
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-primary text-sm font-medium mb-2">{currentVideo.category}</div>
                  <h3 className="text-xl font-bold mb-3">{currentVideo.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{currentVideo.description}</p>
                </div>
              </>
            )}
          </motion.div>

          {/* Video List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold mb-6">Svi Videi</h3>
            <div className="max-h-96 overflow-y-auto space-y-3">
              {videos.map((video, index) => (
                <div
                  key={video.id}
                  onClick={() => handlePlayPause(video)}
                  className={`flex items-center p-4 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    currentVideo?.id === video.id
                      ? 'bg-primary/10 border-2 border-primary'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="relative flex-shrink-0 mr-4">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-20 h-14 object-cover rounded"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded">
                      {isPlaying && currentVideo?.id === video.id ? (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1 line-clamp-2">{video.title}</h4>
                    <p className="text-gray-500 text-xs mb-1">{video.duration}</p>
                    <p className="text-gray-600 text-xs line-clamp-1">{video.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}