import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { Users, Award, UtensilsCrossed } from "lucide-react";
import doctorImage from "@assets/jelena-hero.png";

export default function HeroSection() {
  const { ref: contentRef, inView: contentInView } = useAnimateOnScroll();

  const trustBadges = [
    { icon: Users, value: "100+", label: "Klijenata" },
    { icon: Award, value: "5+", label: "Godina" },
    { icon: UtensilsCrossed, value: "500+", label: "Recepata" },
  ];

  return (
    <section
      id="home"
      className="relative min-h-[90vh] flex items-center overflow-hidden"
      style={{ backgroundColor: "#ECF8F2" }}
    >
      {/* Large decorative circle on left - similar to reference */}
      <div className="absolute left-[-8%] top-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] pointer-events-none">
        <motion.div
          className="w-full h-full rounded-full bg-gradient-to-br from-[#9FE2BF]/60 to-[#7DD3A8]/40 flex items-center justify-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <motion.div
            className="w-[85%] h-[85%] rounded-full border-4 border-white/30 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-[70%] h-[70%] rounded-full bg-[#9FE2BF]/30 flex items-center justify-center">
              <motion.span
                className="text-6xl md:text-7xl lg:text-8xl"
                animate={{ rotate: [0, 10, 0, -10, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              >
                🥗
              </motion.span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative food elements - Large and visible around the image */}
      <motion.div
        className="absolute bottom-[15%] left-[5%] md:left-[8%] z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <motion.div
          className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-2xl bg-gradient-to-br from-green-400 to-green-500 shadow-lg flex items-center justify-center"
          animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-3xl md:text-4xl lg:text-5xl">🥦</span>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute top-[20%] right-[3%] md:right-[5%] z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        <motion.div
          className="w-14 h-14 md:w-18 md:h-18 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-orange-300 to-orange-400 shadow-lg flex items-center justify-center"
          animate={{ y: [0, 8, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <span className="text-2xl md:text-3xl lg:text-4xl">🍊</span>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-[25%] right-[2%] md:right-[4%] z-20"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
      >
        <motion.div
          className="w-12 h-12 md:w-16 md:h-16 lg:w-18 lg:h-18 rounded-2xl bg-gradient-to-br from-yellow-300 to-yellow-400 shadow-lg flex items-center justify-center"
          animate={{ x: [0, 6, 0], rotate: [0, -3, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <span className="text-xl md:text-2xl lg:text-3xl">🍋</span>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute top-[35%] left-[2%] md:left-[3%] z-20 hidden md:block"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.1 }}
      >
        <motion.div
          className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg flex items-center justify-center"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        >
          <span className="text-2xl md:text-3xl">🥑</span>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute top-[60%] right-[8%] md:right-[10%] z-20 hidden lg:block"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.3 }}
      >
        <motion.div
          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-400 to-red-500 shadow-lg flex items-center justify-center"
          animate={{ y: [0, 6, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        >
          <span className="text-2xl">🍎</span>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-[10%] left-[25%] md:left-[30%] z-20 hidden lg:block"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        <motion.div
          className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 shadow-lg flex items-center justify-center"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        >
          <span className="text-xl">🥕</span>
        </motion.div>
      </motion.div>

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
