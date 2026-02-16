import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { X, Info } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
  date: string;
  active: boolean;
}

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const { data: announcementsData = [] } = useQuery<Announcement[]>({
    queryKey: ["/api/announcements"],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const res = await fetch("/api/announcements");
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
  });
  const announcements = announcementsData.filter((a) => a.active);

  // Automatski prebacuj announcements
  useEffect(() => {
    if (announcements.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % announcements.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [announcements.length]);

  if (!isVisible || announcements.length === 0) {
    return null;
  }

  const currentAnnouncement = announcements[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="bg-[#5DAD8C] text-white py-3 px-4 relative overflow-hidden"
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <Info className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
              aria-live="polite"
            >
              <p className="font-semibold text-sm md:text-base">
                {currentAnnouncement?.title}
              </p>
              <p className="text-xs md:text-sm opacity-90 hidden md:block">
                {currentAnnouncement?.content}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indikatori za više announcements */}
        {announcements.length > 1 && (
          <div className="flex space-x-1 mx-4">
            {announcements.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Dugme za zatvaranje */}
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Zatvori objavu"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Decorativni elementi */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-1 -right-10 w-20 h-20 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-2 -left-5 w-15 h-15 bg-white/5 rounded-full"></div>
      </div>
    </motion.div>
  );
}