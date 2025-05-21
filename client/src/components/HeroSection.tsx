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
            <div className="relative overflow-hidden">
              {/* Green background rectangle */}
              <div className="absolute inset-0 bg-primary rounded-xl" style={{ transform: 'scale(0.95)' }}></div>
              
              {/* Fitness woman image */}
              <img 
                src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600" 
                alt="Fitness woman with healthy lifestyle" 
                className="relative z-10 rounded-xl w-full" 
              />
              
              {/* Animated fruit elements */}
              <div className="absolute w-full h-full z-20">
                {/* Apple - rotating and floating */}
                <motion.div 
                  className="absolute w-12 h-12 top-8 right-8"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 10, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                    alt="Apple" 
                    className="w-full h-auto rounded-full" 
                  />
                </motion.div>
                
                {/* Broccoli - scaling and floating */}
                <motion.div 
                  className="absolute w-14 h-14 bottom-24 left-4"
                  animate={{ 
                    y: [0, 15, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                    alt="Broccoli" 
                    className="w-full h-auto rounded-full" 
                  />
                </motion.div>
                
                {/* Avocado - moving side to side */}
                <motion.div 
                  className="absolute w-12 h-12 top-1/3 -left-6"
                  animate={{ 
                    x: [0, 10, 0],
                    rotate: [0, -10, 0]
                  }}
                  transition={{ 
                    duration: 3.5, 
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                    alt="Avocado" 
                    className="w-full h-auto" 
                  />
                </motion.div>
                
                {/* Orange - spinning slowly */}
                <motion.div 
                  className="absolute w-10 h-10 bottom-12 right-10"
                  animate={{ 
                    rotate: [0, 360],
                    y: [0, -5, 0]
                  }}
                  transition={{ 
                    duration: 10, 
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1557800636-894a64c1696f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                    alt="Orange" 
                    className="w-full h-auto rounded-full" 
                  />
                </motion.div>
                
                {/* Banana - moving in arc */}
                <motion.div 
                  className="absolute w-14 h-14 -bottom-4 right-1/4"
                  animate={{ 
                    y: [0, 10, 0],
                    x: [0, 15, 0],
                    rotate: [0, 15, 0]
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                  }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1603833665858-e61d17a86224?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                    alt="Banana" 
                    className="w-full h-auto rounded-full" 
                  />
                </motion.div>
              </div>
              
              {/* Decorative element */}
              <div className="absolute -top-4 -right-4 bg-white rounded-full p-2 z-20 shadow-md">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white rounded-full" style={{ background: 'linear-gradient(135deg, orange, yellow)' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
