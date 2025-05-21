import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";

// Instagram feed images
const instagramImages = [
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
  "https://images.unsplash.com/photo-1600271886742-f049cd451bba?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
  "https://images.unsplash.com/photo-1532465614-6cc8d45f647f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
  "https://images.unsplash.com/photo-1494859802809-d069c3b71a8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
];

const tiktokVideos = [
  {
    title: "Quick Breakfast Recipe Under 5 Minutes",
    embedUrl: "",
  },
  {
    title: "3 Myths About Carbs Debunked",
    embedUrl: "",
  },
  {
    title: "Healthy Snack Ideas for Work",
    embedUrl: "",
  }
];

export default function SocialMediaSection() {
  const { ref: headerRef, inView: headerInView } = useAnimateOnScroll();
  const { ref: instagramHeaderRef, inView: instagramHeaderInView } = useAnimateOnScroll();
  const { ref: instagramFeedRef, inView: instagramFeedInView } = useAnimateOnScroll(0.3);
  const { ref: tiktokHeaderRef, inView: tiktokHeaderInView } = useAnimateOnScroll(0.45);
  const { ref: tiktokFeedRef, inView: tiktokFeedInView } = useAnimateOnScroll(0.6);

  return (
    <section id="social-media" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-primary font-medium tracking-wide uppercase mb-2">SOCIAL MEDIA</p>
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
            Follow Me For Daily Inspiration
          </h2>
          <p className="text-gray-600">
            Join our community on Instagram and TikTok for daily nutrition tips, recipe ideas, and wellness motivation.
          </p>
        </motion.div>
        
        <div className="mb-16">
          <motion.h3 
            ref={instagramHeaderRef}
            initial={{ opacity: 0, y: 20 }}
            animate={instagramHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-2xl font-bold font-poppins mb-8"
          >
            Instagram Feed
          </motion.h3>

          <motion.div 
            ref={instagramFeedRef}
            initial={{ opacity: 0, y: 20 }}
            animate={instagramFeedInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {instagramImages.map((image, index) => (
              <div key={index} className="rounded-xl overflow-hidden shadow-md transition-transform hover:scale-105">
                <img 
                  src={image} 
                  alt={`Instagram post ${index + 1}`} 
                  className="w-full h-full object-cover" 
                />
              </div>
            ))}
          </motion.div>
          
          <div className="text-center mt-8">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center text-primary font-medium hover:text-primary-dark transition"
            >
              <i className="fab fa-instagram mr-2"></i> Follow on Instagram
            </a>
          </div>
        </div>
        
        <div>
          <motion.h3 
            ref={tiktokHeaderRef}
            initial={{ opacity: 0, y: 20 }}
            animate={tiktokHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="text-2xl font-bold font-poppins mb-8"
          >
            TikTok Videos
          </motion.h3>

          <motion.div 
            ref={tiktokFeedRef}
            initial={{ opacity: 0, y: 20 }}
            animate={tiktokFeedInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {tiktokVideos.map((video, index) => (
              <div key={index} className="bg-gray-100 rounded-xl overflow-hidden shadow-lg aspect-[9/16] flex items-center justify-center">
                <div className="text-center px-4">
                  <i className="fab fa-tiktok text-5xl text-gray-400 mb-4"></i>
                  <p className="text-gray-500">TikTok video embed placeholder</p>
                  <p className="text-gray-400 text-sm mt-2">{video.title}</p>
                </div>
              </div>
            ))}
          </motion.div>
          
          <div className="text-center mt-8">
            <a 
              href="https://tiktok.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center text-primary font-medium hover:text-primary-dark transition"
            >
              <i className="fab fa-tiktok mr-2"></i> Follow on TikTok
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
