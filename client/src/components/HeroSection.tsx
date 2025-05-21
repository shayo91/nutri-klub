import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";

export default function HeroSection() {
  const { ref: textRef, inView: textInView } = useAnimateOnScroll();
  const { ref: imageRef, inView: imageInView } = useAnimateOnScroll(0.3);

  return (
    <section id="home" className="relative py-16 md:py-24 bg-secondary overflow-hidden" style={{ backgroundColor: "#f1f5eb" }}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Small text at top */}
          <div className="w-full flex justify-between mb-8">
            <span className="text-sm text-gray-600">Meet Our Nutrition<br/>Fitness Expert</span>
            <span className="text-sm text-gray-600">Be healthy. Be happy</span>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div 
            ref={textRef}
            initial={{ opacity: 0, y: 20 }}
            animate={textInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins leading-tight mb-6" style={{ fontFamily: 'serif' }}>
              Eat Better,<br />Feel Better
            </h1>
            <p className="text-gray-600 mb-8 max-w-lg">
              Start your path to well-being and nutrition knowledge at 
              NutriHub, your ultimate destination for healthy living.
            </p>
            
            <div className="inline-block relative">
              <a 
                href="#contact" 
                className="inline-flex items-center px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-full font-medium transition duration-300 ease-in-out"
              >
                Get started
                <span className="ml-2 bg-white rounded-full p-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </a>
            </div>
          </motion.div>

          <motion.div 
            ref={imageRef}
            initial={{ opacity: 0, y: 20 }}
            animate={imageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:w-1/2 mt-12 lg:mt-0 relative"
          >
            <div className="relative">
              {/* Green background rectangle */}
              <div className="absolute inset-0 bg-primary rounded-xl" style={{ transform: 'scale(0.95)' }}></div>
              
              {/* Woman with salad image */}
              <img 
                src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&auto=format&fit=crop&w=600" 
                alt="Woman enjoying healthy salad" 
                className="relative z-10 rounded-xl" 
              />
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-full p-2 z-20 shadow-md">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white rounded-full" style={{ background: 'linear-gradient(135deg, orange, yellow)' }}></div>
                </div>
              </div>
              
              {/* Avocado decoration */}
              <div className="absolute -left-6 top-1/4 w-16 h-16 z-20">
                <img 
                  src="https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                  alt="Avocado" 
                  className="w-full h-auto" 
                />
              </div>
              
              {/* Small food element at bottom */}
              <div className="absolute -bottom-4 -right-2 w-20 h-20 z-20">
                <img 
                  src="https://images.unsplash.com/photo-1557800636-894a64c1696f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                  alt="Healthy food" 
                  className="w-full h-auto rounded-md" 
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
