import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { Users, Award, Calendar } from "lucide-react";
import doctorImage from "@assets/jelena-hero.png";

export default function HeroSection() {
  const { ref: contentRef, inView: contentInView } = useAnimateOnScroll();

  const trustBadges = [
    { icon: Users, value: "100+", label: "Klijenata" },
    { icon: Award, value: "5+", label: "Godina" },
    { icon: Calendar, value: "500+", label: "Recepata" },
  ];

  return (
    <section
      id="home"
      className="relative min-h-[90vh] flex items-center overflow-hidden"
      style={{ backgroundColor: "#ECF8F2" }}
    >
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-[#9FE2BF]/20 blur-2xl" />
        <div className="absolute bottom-20 right-1/3 w-48 h-48 rounded-full bg-[#9FE2BF]/15 blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-[#D4F5E9]/40 blur-xl" />
        
        {/* Subtle food decorations in background */}
        <motion.div
          className="absolute bottom-1/4 right-[15%] text-4xl opacity-20"
          animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          🥦
        </motion.div>
        <motion.div
          className="absolute top-1/4 right-[25%] text-3xl opacity-15"
          animate={{ y: [0, 8, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          🍊
        </motion.div>
        <motion.div
          className="absolute top-1/2 right-[10%] text-3xl opacity-15"
          animate={{ x: [0, 8, 0], rotate: [0, -3, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          🍋
        </motion.div>
        <motion.div
          className="absolute bottom-1/3 right-[30%] text-2xl opacity-10"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        >
          🥑
        </motion.div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            ref={contentRef}
            initial={{ opacity: 0, x: -30 }}
            animate={
              contentInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }
            }
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1 text-center lg:text-left py-8 lg:py-0"
          >
            {/* Small tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#1F7A5C] font-medium text-sm md:text-base tracking-wide mb-4"
            >
              Magistar nutricionizma
            </motion.p>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#1F2937] leading-tight mb-6">
              Tvoja početna
              <br />
              <span className="text-[#1F7A5C]">tačka za promjenu.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base md:text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Uz male korake, jednostavne obroke i pravu podršku, nauči kako da jedeš bez stresa i osjetiš više energije svakog dana.
            </p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-10"
            >
              <a
                href="#pricing"
                className="inline-block bg-[#1F7A5C] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-[#185F48] hover:shadow-xl transition-all duration-300 hover:scale-105"
                data-testid="button-cta-hero"
              >
                Kreni ovdje
              </a>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap justify-center lg:justify-start gap-6 md:gap-8"
            >
              {trustBadges.map((badge, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center lg:items-start"
                  data-testid={`trust-badge-${index}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-10 h-10 rounded-full bg-[#9FE2BF]/30 flex items-center justify-center">
                      <badge.icon className="w-5 h-5 text-[#1F7A5C]" />
                    </div>
                    <span className="text-2xl md:text-3xl font-bold text-[#1F2937]">
                      {badge.value}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 font-medium">
                    {badge.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="order-1 lg:order-2 relative flex justify-center lg:justify-end"
          >
            {/* Main image container */}
            <div className="relative bg-gradient-to-b from-[#9FE2BF]/40 to-[#9FE2BF]/20 rounded-3xl p-2 md:p-4 shadow-xl">
              <div className="bg-white/50 rounded-2xl overflow-hidden backdrop-blur-sm">
                <img
                  src={doctorImage}
                  alt="Jelena Matijaš - Magistar nutricionizma"
                  className="w-[280px] sm:w-[350px] md:w-[400px] lg:w-[450px] h-auto object-contain"
                  data-testid="img-jelena-hero"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
