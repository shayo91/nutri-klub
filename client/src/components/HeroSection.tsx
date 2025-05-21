import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";

export default function HeroSection() {
  const { ref: textRef, inView: textInView } = useAnimateOnScroll();
  const { ref: imageRef, inView: imageInView } = useAnimateOnScroll(0.3);

  return (
    <section id="home" className="relative py-16 md:py-24 bg-secondary overflow-hidden">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
        <motion.div 
          ref={textRef}
          initial={{ opacity: 0, y: 20 }}
          animate={textInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="lg:w-1/2"
        >
          <p className="text-primary font-medium tracking-wide uppercase mb-2">PROFESSIONAL NUTRITIONIST</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins leading-tight mb-6">
            Eat Healthy <br />Live Healthy Today
          </h1>
          <p className="text-gray-600 mb-8 max-w-lg">
            Transform your relationship with food and discover a balanced approach to nutrition. 
            Custom meal plans designed specifically for your body, lifestyle, and goals.
          </p>
          <div className="flex flex-wrap gap-4">
            <a 
              href="#contact" 
              className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-md font-medium transition duration-300 ease-in-out shadow-md hover:shadow-lg"
            >
              Get Started
            </a>
            <a 
              href="#services" 
              className="px-6 py-3 bg-white hover:bg-gray-100 border border-primary text-primary rounded-md font-medium transition duration-300 ease-in-out"
            >
              View Meal Plans
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
          <div className="p-2 bg-white rounded-full shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1590779033100-9f60a05a013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600" 
              alt="Healthy balanced meal with vegetables, proteins and nuts" 
              className="rounded-full w-full h-auto" 
            />
          </div>
          
          {/* Decorative elements */}
          <div className="leaf-decoration -bottom-10 -left-5 w-24 h-auto opacity-80">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <circle cx="50" cy="50" r="50" fill="#8BC34A" fillOpacity="0.6" />
              <path d="M30,50 Q50,20 70,50 Q50,80 30,50 Z" fill="#5CAA48" fillOpacity="0.8" />
            </svg>
          </div>
          
          <div className="leaf-decoration top-10 -right-5 w-16 h-auto opacity-60">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <circle cx="50" cy="50" r="50" fill="#8BC34A" fillOpacity="0.5" />
              <path d="M40,30 Q50,10 60,30 Q70,50 60,70 Q50,90 40,70 Q30,50 40,30 Z" fill="#5CAA48" fillOpacity="0.7" />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
