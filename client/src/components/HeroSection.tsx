import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { Users, Award, UtensilsCrossed, Apple, Carrot, Leaf, Cherry } from "lucide-react";
import doctorImage from "@assets/Untitled_design_(18)_1770122157577.png";

export default function HeroSection() {
  const { ref: contentRef, inView: contentInView } = useAnimateOnScroll();

  const trustBadges = [
    { icon: Users, value: "100+", label: "Klijenata" },
    { icon: Award, value: "5+", label: "Godina" },
    { icon: UtensilsCrossed, value: "500+", label: "Recepata" },
  ];

  const floatingIcons = [
    { Icon: Apple, delay: 0, x: "5%", y: "15%", duration: 8 },
    { Icon: Carrot, delay: 1, x: "85%", y: "20%", duration: 10 },
    { Icon: Leaf, delay: 2, x: "10%", y: "70%", duration: 9 },
    { Icon: Cherry, delay: 0.5, x: "90%", y: "65%", duration: 11 },
    { Icon: Apple, delay: 1.5, x: "75%", y: "85%", duration: 7 },
    { Icon: Carrot, delay: 2.5, x: "20%", y: "40%", duration: 12 },
  ];

  return (
    <section
      id="home"
      aria-label="Početna sekcija - Nutricionista Jelena Matijaš"
      className="relative min-h-[70vh] flex items-center overflow-hidden py-12 lg:py-16"
      style={{ backgroundColor: "#ECF8F2" }}
    >
      {/* Floating fruit/vegetable icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingIcons.map((item, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={{ left: item.x, top: item.y }}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.08, 0.15, 0.08],
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: item.duration, 
              delay: item.delay, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <item.Icon className="w-12 h-12 md:w-16 md:h-16 text-[#5DAD8C]" />
          </motion.div>
        ))}
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
              <span className="text-[#5DAD8C]">tačka za promjenu.</span>
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
                className="inline-block bg-[#5DAD8C] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-[#4A9A79] hover:shadow-xl transition-all duration-300 hover:scale-105"
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
            {/* Main image container with hover effect like AboutMe page */}
            <div className="relative group">
              <div className="absolute -inset-3 bg-[#9fc9b6] rounded-3xl transform rotate-3 group-hover:rotate-2 transition-transform duration-300"></div>
              <img
                src={doctorImage}
                alt="Jelena Matijaš - Nutricionista BiH - Magistar nutricionizma - planovi ishrane"
                className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[420px] h-auto rounded-2xl shadow-xl group-hover:shadow-2xl group-hover:scale-[1.02] transition-all duration-300"
                data-testid="img-jelena-hero"
                width={420}
                height={525}
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
