import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { useLanguage } from "@/hooks/useLanguage";
import doctorImage from "@assets/jelena-hero.png";

export default function HeroSection() {
  const { t } = useLanguage();
  const { ref: contentRef, inView: contentInView } = useAnimateOnScroll();
  const { ref: aboutRef, inView: aboutInView } = useAnimateOnScroll(0.2);

  return (
    <>
      <section
        id="home"
        className="relative min-h-screen py-16 flex items-center overflow-hidden"
        style={{ backgroundColor: "#9FE2BF" }}
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
              alt="Dekorativna naranča"
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
          <div className="flex flex-col">
            {/* Top centered content */}
            <motion.div
              ref={contentRef}
              initial={{ opacity: 0, y: 30 }}
              animate={
                contentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
              }
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center mb-16"
            >
              {/* Main headline */}
              <h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                style={{ color: "#000" }}
              >
                Tvoja početna tačka za promjenu.
              </h2>

              <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
                Uz male korake, jednostavne obroke i pravu podršku, nauči kako da jedeš bez stresa, razumiješ svoje tijelo i osjetiš više energije svakog dana.
              </p>

              {/* CTA Box */}
              <motion.div
                className="inline-block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="bg-white px-8 py-4 rounded-lg shadow-lg inline-block">
                  <span className="text-gray-800 font-medium text-lg">Kreni ovdje.</span>
                </div>
              </motion.div>
            </motion.div>

            {/* About me section - mobile version (centered, in flow) */}
            <motion.div
              ref={aboutRef}
              initial={{ opacity: 0, y: 30 }}
              animate={
                aboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
              }
              transition={{ duration: 0.8, delay: 0.3 }}
              className="md:hidden max-w-md mx-auto w-full"
            >
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-gray-700">
                  <p className="text-lg leading-relaxed mb-4">
                    <strong className="text-xl">Ja sam Jelena i biću tvoja nutricionistkinja.</strong>
                  </p>
                  
                  {/* Learn more button */}
                  <div className="mt-6">
                    <a href="#about-me" className="inline-block px-6 py-3 rounded-lg shadow-lg text-gray-800 font-medium hover:shadow-xl transition-shadow" style={{ backgroundColor: "#9FE2BF" }}>
                      Malo više o meni
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* About me section - desktop version (centered bottom) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="hidden md:block absolute bottom-8 z-10"
          style={{ left: '50%', marginLeft: '-350px' }}
        >
          <div 
            className="bg-white rounded-xl shadow-lg flex"
            style={{ width: '700px', height: '232px' }}
            data-testid="white-box-jelena"
          >
            <div className="flex-1 flex flex-col" style={{ padding: '24px' }}>
              <div className="text-gray-700 flex-1 overflow-hidden">
                <p className="text-base leading-snug mb-3">
                  <strong className="text-lg">Ja sam Jelena i biću tvoja nutricionistkinja.</strong>
                </p>
                
                {/* Learn more button */}
                <div className="mt-4">
                  <a href="#about-me" className="inline-block px-5 py-2 rounded-lg shadow-lg text-gray-800 font-medium text-sm hover:shadow-xl transition-shadow" style={{ backgroundColor: "#9FE2BF" }}>
                    Malo više o meni
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Jelena's image - bottom right corner (hidden on mobile) */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="hidden md:block absolute bottom-0 right-0 pointer-events-none"
          style={{ zIndex: 5 }}
        >
          <img
            src={doctorImage}
            alt="Jelena - Magistar nutricionizma"
            className="w-[474px] h-[589px] object-cover"
            data-testid="img-jelena-hero"
          />
        </motion.div>
      </section>
    </>
  );
}
