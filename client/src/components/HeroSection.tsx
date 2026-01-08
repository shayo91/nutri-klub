import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import doctorImage from "@assets/jelena-hero.png";

export default function HeroSection() {
  const { ref: contentRef, inView: contentInView } = useAnimateOnScroll();

  return (
    <section
      id="home"
      className="relative min-h-[85vh] md:min-h-[90vh] py-12 md:py-16 flex items-center overflow-hidden"
      style={{ backgroundColor: "#9FE2BF" }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated circles */}
        <motion.div
          className="absolute top-1/4 left-[10%] w-48 md:w-64 h-48 md:h-64 rounded-full bg-green-100"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.2, 0.3],
            x: [0, 10, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-1/4 right-[10%] w-64 md:w-96 h-64 md:h-96 rounded-full bg-yellow-50"
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.2, 0.3, 0.2],
            x: [0, -15, 0],
            y: [0, 10, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Floating leaf element */}
        <motion.div
          className="absolute top-20 right-[20%] w-16 h-16 md:w-24 md:h-24"
          animate={{
            y: [0, 15, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-full h-full rounded-full bg-green-200/40" />
        </motion.div>

        <motion.div
          className="absolute top-1/3 left-[5%] w-20 h-20 md:w-32 md:h-32"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <div className="w-full h-full rounded-full bg-green-100/50" />
        </motion.div>

        <motion.div
          className="absolute bottom-[30%] left-[25%] w-12 h-12 md:w-20 md:h-20"
          animate={{
            y: [0, 25, 0],
            rotate: [0, 15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        >
          <div className="w-full h-full rounded-full bg-yellow-100/40" />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Left content */}
          <motion.div
            ref={contentRef}
            initial={{ opacity: 0, y: 30 }}
            animate={
              contentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-center lg:text-left flex-1"
          >
            {/* Main headline */}
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight"
              style={{ color: "#000" }}
            >
              Tvoja početna tačka za promjenu.
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 md:mb-8 leading-relaxed">
              Uz male korake, jednostavne obroke i pravu podršku, nauči kako da jedeš bez stresa, razumiješ svoje tijelo i osjetiš više energije svakog dana.
            </p>

            {/* CTA Button */}
            <motion.div
              className="inline-block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <a 
                href="#pricing"
                className="bg-white px-8 py-4 rounded-xl shadow-lg inline-block hover:shadow-xl transition-all duration-300 hover:scale-105"
                data-testid="button-kreni-ovdje"
              >
                <span className="text-gray-800 font-semibold text-lg">Kreni ovdje.</span>
              </a>
            </motion.div>
          </motion.div>

          {/* Right - Image (visible on larger screens) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hidden lg:flex justify-end flex-shrink-0"
          >
            <img
              src={doctorImage}
              alt="Jelena - Magistar nutricionizma"
              className="w-[350px] xl:w-[420px] h-auto object-contain"
              data-testid="img-jelena-hero"
            />
          </motion.div>
        </div>
      </div>

      {/* Mobile image - bottom centered */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="lg:hidden absolute bottom-0 right-0 pointer-events-none"
        style={{ zIndex: 5 }}
      >
        <img
          src={doctorImage}
          alt="Jelena - Magistar nutricionizma"
          className="w-[200px] sm:w-[280px] h-auto object-contain"
          data-testid="img-jelena-hero-mobile"
        />
      </motion.div>
    </section>
  );
}
