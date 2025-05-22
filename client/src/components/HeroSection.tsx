import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";

export default function HeroSection() {
  const { ref: contentRef, inView: contentInView } = useAnimateOnScroll();
  const { ref: pricingRef, inView: pricingInView } = useAnimateOnScroll(0.2);
  
  return (
    <>
      <section id="home" className="relative min-h-screen py-16 flex items-center overflow-hidden" style={{ backgroundColor: "#f5f8f0" }}>
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
              ease: "easeInOut"
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
              delay: 1
            }}
          />
          
          {/* Floating food elements with parallax effect */}
          <motion.div 
            className="absolute -top-10 right-1/4 w-32 h-32"
            animate={{ 
              y: [0, 15, 0],
              rotate: [0, 10, 0]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <img src="https://images.unsplash.com/photo-1516685125522-3c692dcd695c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" 
                alt="Decorative strawberry" 
                className="w-full h-auto rounded-full opacity-30"
            />
          </motion.div>
          
          <motion.div 
            className="absolute top-1/3 -left-10 w-40 h-40"
            animate={{ 
              y: [0, -20, 0],
              x: [0, 10, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ 
              duration: 7, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            <img src="https://images.unsplash.com/photo-1528825871115-3581a5387919?ixlib=rb-4.0.3&auto=format&fit=crop&w=180&h=180" 
                alt="Decorative avocado" 
                className="w-full h-auto rounded-full opacity-30"
            />
          </motion.div>
          
          <motion.div 
            className="absolute bottom-1/4 left-1/3 w-24 h-24"
            animate={{ 
              y: [0, 25, 0],
              rotate: [0, 15, 0]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5
            }}
          >
            <img src="https://images.unsplash.com/photo-1546630392-1a5ed41714ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120" 
                alt="Decorative orange" 
                className="w-full h-auto rounded-full opacity-30"
            />
          </motion.div>
          
          <motion.div 
            className="absolute -bottom-5 right-1/3 w-36 h-36"
            animate={{ 
              y: [0, -15, 0],
              x: [0, -10, 0],
              rotate: [0, -8, 0]
            }}
            transition={{ 
              duration: 9, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          >
            <img src="https://images.unsplash.com/photo-1589927986089-35812388d1f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" 
                alt="Decorative kiwi" 
                className="w-full h-auto rounded-full opacity-30"
            />
          </motion.div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            ref={contentRef}
            initial={{ opacity: 0, y: 30 }}
            animate={contentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="max-w-screen-lg mx-auto text-center"
          >
            {/* Brand name */}
            <div className="mb-4">
              <h1 
                className="text-4xl md:text-5xl font-light" 
                style={{ fontFamily: 'serif', color: '#5CAA48' }}
              >
                NutriHub
              </h1>
            </div>
            
            {/* Main headline */}
            <h2 className="text-4xl md:text-6xl font-light mb-6" style={{ color: '#333', fontFamily: 'serif' }}>
              Transform Your Health With <span className="text-primary font-normal">Expert Nutrition</span>
            </h2>
            
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              Personalized nutrition plans designed to help you achieve optimal health, increased energy, and lasting wellness through science-backed dietary strategies.
            </p>
            
            {/* Hero image */}
            <motion.div 
              className="mb-10 relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600&q=80" 
                  alt="Professional nutritionist designing custom meal plans" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-transparent mix-blend-overlay"></div>
              </div>
              
              {/* Floating nutrition elements */}
              <motion.div 
                className="absolute -top-5 -right-5 md:top-5 md:right-5 bg-white p-3 rounded-full shadow-lg z-10"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <svg className="w-8 h-8 md:w-10 md:h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 6V12M12 12V18M12 12H18M12 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </motion.div>
              
              <motion.div 
                className="absolute top-1/2 -left-5 md:left-5 bg-white p-3 rounded-full shadow-lg z-10"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <div className="w-16 h-16 md:w-20 md:h-20 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                  <svg className="w-8 h-8 md:w-10 md:h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </motion.div>
            </motion.div>
            
            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <a 
                href="#pricing" 
                className="inline-flex items-center px-8 py-4 bg-primary hover:bg-primary-dark text-white text-lg font-medium rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Explore Nutrition Plans
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            ref={pricingRef}
            initial={{ opacity: 0, y: 30 }}
            animate={pricingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <p className="text-primary font-medium tracking-wide uppercase mb-2">NUTRITION PLANS</p>
            <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
              Choose Your Path to Better Health
            </h2>
            <p className="text-gray-600">
              We offer personalized nutrition plans designed to meet your specific health goals, dietary preferences, and lifestyle needs.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={pricingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gray-50 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-8">
                <h3 className="text-xl font-bold mb-4">Essential Plan</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$49</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <p className="text-gray-600 mb-6">Perfect for individuals starting their nutrition journey.</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Basic nutritional assessment</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Personalized meal plan</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Monthly check-in</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Email support</span>
                  </li>
                </ul>
                <a href="#contact" className="block w-full py-3 text-center bg-white border border-primary text-primary hover:bg-gray-50 rounded-lg font-medium transition duration-300">
                  Get Started
                </a>
              </div>
            </motion.div>
            
            {/* Premium Plan - Highlighted */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 1 }}
              animate={pricingInView ? { opacity: 1, y: 0, scale: 1.05 } : { opacity: 0, y: 30, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="bg-white rounded-xl shadow-2xl overflow-hidden border-2 border-primary relative z-10 transform hover:scale-105 transition-transform duration-300"
            >
              <div className="absolute top-0 inset-x-0 bg-primary text-white text-center py-1 text-sm font-medium">
                MOST POPULAR
              </div>
              <div className="p-8 pt-10">
                <h3 className="text-xl font-bold mb-4">Premium Plan</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$89</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <p className="text-gray-600 mb-6">Comprehensive support for optimal nutrition and wellness.</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Comprehensive nutrition assessment</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Customized meal & recipe plans</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Bi-weekly check-ins</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Priority email & text support</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Nutrition tracking app access</span>
                  </li>
                </ul>
                <a href="#contact" className="block w-full py-3 text-center bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition duration-300">
                  Get Started
                </a>
              </div>
            </motion.div>
            
            {/* Ultimate Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={pricingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gray-50 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-8">
                <h3 className="text-xl font-bold mb-4">Ultimate Plan</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$149</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <p className="text-gray-600 mb-6">The gold standard for those seeking transformative results.</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Advanced nutrition & health analysis</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Fully customized nutrition program</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Weekly 1:1 coaching sessions</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>24/7 direct access to your nutritionist</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Premium nutrition app & resources</span>
                  </li>
                </ul>
                <a href="#contact" className="block w-full py-3 text-center bg-white border border-primary text-primary hover:bg-gray-50 rounded-lg font-medium transition duration-300">
                  Get Started
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
