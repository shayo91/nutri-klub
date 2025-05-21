import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}

// Fallback testimonials when API data is not available
const fallbackTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Weight Loss Client",
    content: "Working with Jelena transformed not just my eating habits but my entire relationship with food. I've lost 15kg in 6 months and, most importantly, have kept it off. Her approach is sustainable and life-changing!",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    rating: 5
  },
  {
    id: 2,
    name: "Mark Thompson",
    role: "Sports Performance",
    content: "As an amateur triathlete, I needed a nutrition plan that would fuel my training. Jelena created a perfect balance of nutrients that improved my energy levels and recovery time. My performance has improved dramatically!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    rating: 5
  },
  {
    id: 3,
    name: "Emily Chen",
    role: "Digestive Health",
    content: "After years of digestive issues, I finally found relief through Jelena's nutrition program. She identified my food sensitivities and created a plan that eliminated my symptoms while still being delicious and varied.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    rating: 4.5
  },
  {
    id: 4,
    name: "David Rodriguez",
    role: "Family Nutrition",
    content: "Jelena helped our whole family adopt healthier eating habits. Her kid-friendly approach made the transition easy, and now our children are enthusiastic about eating vegetables! Our energy levels are up and we're all sleeping better.",
    avatar: "https://images.unsplash.com/photo-1546456073-92b9f0a8d413?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    rating: 5
  }
];

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const data = testimonials || fallbackTestimonials;
  const [currentSlide, setCurrentSlide] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { ref: headerRef, inView: headerInView } = useAnimateOnScroll();

  // Handle slider functionality
  const totalSlides = data.length;
  const slidesPerView = useWindowSize();
  
  const nextSlide = () => {
    if (currentSlide < totalSlides - slidesPerView) {
      setCurrentSlide(prev => prev + 1);
    } else {
      setCurrentSlide(0);
    }
  };
  
  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    } else {
      setCurrentSlide(totalSlides - slidesPerView);
    }
  };

  // Update slider transform when slide changes
  useEffect(() => {
    if (wrapperRef.current) {
      const slideWidth = 100 / slidesPerView;
      wrapperRef.current.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
    }
  }, [currentSlide, slidesPerView]);

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-primary font-medium tracking-wide uppercase mb-2">TESTIMONIALS</p>
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
            What My Clients Say
          </h2>
          <p className="text-gray-600">
            Read about the experiences and results from people who have transformed their health and lives through our nutrition programs.
          </p>
        </motion.div>
        
        <div className="testimonial-slider relative">
          {/* Testimonial slides container */}
          <div className="overflow-hidden">
            <div 
              ref={wrapperRef}
              className="flex transition-transform duration-500" 
            >
              {data.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} slidesPerView={slidesPerView} />
              ))}
            </div>
          </div>
          
          {/* Navigation buttons */}
          <button 
            onClick={prevSlide}
            className="absolute top-1/2 -left-4 lg:-left-6 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center focus:outline-none hover:bg-gray-100 transition z-10"
            aria-label="Previous testimonial"
          >
            <i className="fas fa-chevron-left text-primary"></i>
          </button>
          <button 
            onClick={nextSlide}
            className="absolute top-1/2 -right-4 lg:-right-6 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center focus:outline-none hover:bg-gray-100 transition z-10"
            aria-label="Next testimonial"
          >
            <i className="fas fa-chevron-right text-primary"></i>
          </button>
          
          {/* Pagination indicators */}
          <div className="flex justify-center space-x-2 mt-8">
            {Array.from({ length: Math.ceil(totalSlides / slidesPerView) }).map((_, index) => (
              <button 
                key={index}
                className={`w-3 h-3 rounded-full bg-primary transition-opacity duration-300 ${index === Math.floor(currentSlide / slidesPerView) ? 'opacity-100' : 'opacity-40'}`}
                onClick={() => setCurrentSlide(index * slidesPerView)}
                aria-label={`Go to testimonial group ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial, slidesPerView }: { testimonial: Testimonial; slidesPerView: number }) {
  return (
    <div className={`w-full flex-shrink-0 px-4`} style={{ width: `${100 / slidesPerView}%` }}>
      <div className="bg-secondary rounded-xl p-8 shadow-lg h-full">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-14 h-14 rounded-full overflow-hidden mr-4">
              <img src={testimonial.avatar} alt={`${testimonial.name} avatar`} className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="font-bold">{testimonial.name}</h4>
              <p className="text-gray-500 text-sm">{testimonial.role}</p>
            </div>
          </div>
          <div className="text-primary">
            <i className="fas fa-quote-right text-3xl opacity-50"></i>
          </div>
        </div>
        <p className="text-gray-600 mb-6">
          {testimonial.content}
        </p>
        <div className="flex text-yellow-400">
          {Array.from({ length: 5 }).map((_, index) => {
            // For half stars
            if (index < Math.floor(testimonial.rating)) {
              return <i key={index} className="fas fa-star"></i>;
            } else if (index < testimonial.rating) {
              return <i key={index} className="fas fa-star-half-alt"></i>;
            } else {
              return <i key={index} className="far fa-star"></i>;
            }
          })}
        </div>
      </div>
    </div>
  );
}

// Custom hook to determine how many slides to show based on screen size
function useWindowSize() {
  const [slidesPerView, setSlidesPerView] = useState(3);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) {
        setSlidesPerView(1);
      } else if (window.innerWidth < 1024) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(3);
      }
    }

    // Set on mount
    handleResize();
    
    // Update on resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return slidesPerView;
}
