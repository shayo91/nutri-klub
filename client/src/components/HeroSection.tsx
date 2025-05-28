import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { useLanguage } from "@/hooks/useLanguage";
import doctorImage from "@assets/Screenshot 2025-05-27 at 15.18.08.png";

export default function HeroSection() {
  const { t } = useLanguage();
  const { ref: contentRef, inView: contentInView } = useAnimateOnScroll();
  const { ref: pricingRef, inView: pricingInView } = useAnimateOnScroll(0.2);

  return (
    <>
      <section
        id="home"
        className="relative min-h-screen py-16 flex items-center overflow-hidden"
        style={{ backgroundColor: "#f5f8f0" }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Animated circles */}
          <motion.div
            className="absolute top-1/4 left-1/6 w-64 h-64 rounded-full bg-green-100"
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
            className="absolute bottom-1/4 right-1/6 w-96 h-96 rounded-full bg-yellow-50"
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

          {/* Floating food elements with parallax effect */}
          <motion.div
            className="absolute -top-10 right-1/4 w-32 h-32"
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
            <img
              src="https://images.unsplash.com/photo-1516685125522-3c692dcd695c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
              alt="Dekorativna jagoda"
              className="w-full h-auto rounded-full opacity-30"
            />
          </motion.div>

          <motion.div
            className="absolute top-1/3 -left-10 w-40 h-40"
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
            <img
              src="https://images.unsplash.com/photo-1528825871115-3581a5387919?ixlib=rb-4.0.3&auto=format&fit=crop&w=180&h=180"
              alt="Dekorativni avokado"
              className="w-full h-auto rounded-full opacity-30"
            />
          </motion.div>

          <motion.div
            className="absolute bottom-1/4 left-1/3 w-24 h-24"
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
            <img
              src="https://images.unsplash.com/photo-1546630392-1a5ed41714ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120"
              alt="Dekorativna narandža"
              className="w-full h-auto rounded-full opacity-30"
            />
          </motion.div>

          <motion.div
            className="absolute -bottom-5 right-1/3 w-36 h-36"
            animate={{
              y: [0, -15, 0],
              x: [0, -10, 0],
              rotate: [0, -8, 0],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1589927986089-35812388d1f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
              alt="Dekorativni kivi"
              className="w-full h-auto rounded-full opacity-30"
            />
          </motion.div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left side - Content */}
            <motion.div
              ref={contentRef}
              initial={{ opacity: 0, x: -50 }}
              animate={
                contentInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }
              }
              transition={{ duration: 0.8 }}
              className="lg:w-1/2"
            >
              {/* Brand name */}
              <div className="mb-6">
                <h1
                  className="text-3xl md:text-4xl font-light mb-2"
                  style={{ fontFamily: "serif", color: "#5CAA48" }}
                >
                  {t("hero.brand")}
                </h1>
              </div>

              {/* Main headline */}
              <h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                style={{ color: "#333" }}
              >
                {t("hero.title")}
              </h2>

              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                {t("hero.subtitle")}
              </p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-primary hover:bg-primary-dark text-white text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  {t("hero.cta")}
                  <svg
                    className="ml-2 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </a>
                <a
                  href="#process"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary text-primary hover:bg-primary hover:text-white text-lg font-semibold rounded-full transition-all duration-300"
                >
                  {t("hero.cta2")}
                </a>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                className="mt-8 flex flex-wrap items-center gap-6 text-sm text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-primary mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  500+ Zadovoljnih Klijenata
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-primary mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  10+ Godina Iskustva
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-primary mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Sertifikovani Stručnjak
                </div>
              </motion.div>
            </motion.div>

            {/* Right side - Doctor Image */}
            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              animate={
                contentInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }
              }
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                <img
                  src={doctorImage}
                  alt="Profesionalni nutricionista sa stethoskopom i svežim povrćem - stručnjak za ishranu i zdravlje"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />

                {/* Floating elements */}
                <motion.div
                  className="absolute -top-6 -left-6 bg-white p-4 rounded-xl shadow-lg"
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">10+</div>
                    <div className="text-sm text-gray-600">Godina</div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -bottom-6 -right-6 bg-primary text-white p-4 rounded-xl shadow-lg"
                  animate={{ y: [0, 10, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold">500+</div>
                    <div className="text-sm">Klijenata</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
