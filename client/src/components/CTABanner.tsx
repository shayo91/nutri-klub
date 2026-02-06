import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { FileText, MessageCircle } from "lucide-react";

export default function CTABanner() {
  const { ref, inView } = useAnimateOnScroll();

  return (
    <section className="py-12 md:py-16 bg-gradient-to-r from-[#5DAD8C] to-[#4A9A79] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
      </div>

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 relative z-10"
      >
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Započnite Svoju Transformaciju Danas
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Zakažite besplatnu konsultaciju sa nutricionistom i napravite prvi korak ka zdravijem životu
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#5DAD8C] px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <FileText className="w-5 h-5" />
              Zakažite Besplatnu Konsultaciju
            </a>
            <a
              href="https://wa.me/38766123456"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" />
              Kontaktirajte nas na WhatsApp
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
