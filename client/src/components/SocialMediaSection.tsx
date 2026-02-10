import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { useLanguage } from "@/hooks/useLanguage";

const tiktokVideos = [
  {
    title: "Brzi recept za doručak ispod 5 minuta",
    embedUrl: "",
  },
  {
    title: "3 mita o ugljenim hidratima razotkrivena",
    embedUrl: "",
  },
  {
    title: "Zdrave ideje za užinu na poslu",
    embedUrl: "",
  },
];

export default function SocialMediaSection() {
  const { ref: headerRef, inView: headerInView } = useAnimateOnScroll();
  const { ref: instagramHeaderRef, inView: instagramHeaderInView } =
    useAnimateOnScroll();
  const { ref: instagramFeedRef, inView: instagramFeedInView } =
    useAnimateOnScroll(0.3);
  const { ref: tiktokHeaderRef, inView: tiktokHeaderInView } =
    useAnimateOnScroll(0.45);
  const { ref: tiktokFeedRef, inView: tiktokFeedInView } =
    useAnimateOnScroll(0.6);

  return (
    <section id="social-media" aria-label="Društvene mreže" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-primary font-medium tracking-wide uppercase mb-2">
            DRUŠTVENE MREŽE
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
            Pratite Me za Dnevnu Inspiraciju
          </h2>
          <p className="text-gray-600">
            Budite deo naše zajednice na Instagramu i TikToku za dnevne savete o
            ishrani, ideje za recepte i wellness motivaciju.
          </p>
        </motion.div>

        <div className="mb-16">
          <motion.h3
            ref={instagramHeaderRef}
            initial={{ opacity: 0, y: 20 }}
            animate={
              instagramHeaderInView
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-2xl font-bold font-poppins mb-8"
          >
            Instagram Sadržaj
          </motion.h3>
          {/* Instagram Feed can be added here */}
        </div>

        <div className="mb-16">
          <motion.h3
            ref={tiktokHeaderRef}
            initial={{ opacity: 0, y: 20 }}
            animate={
              tiktokHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-2xl font-bold font-poppins mb-8"
          >
            TikTok Videi
          </motion.h3>
          {/* TikTok feed can be rendered here using tiktokVideos */}
        </div>
      </div>
    </section>
  );
}
