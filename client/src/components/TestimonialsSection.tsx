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
    name: "Marija Petrović",
    role: "Profesorka, 34 godine",
    content:
      "Rad sa Jelenom je potpuno transformisao ne samo moje navike u ishrani, već i celu moju vezu sa hranom. Smršala sam 15 kg za 6 meseci i, što je najvažnije, zadržala sam to. Njen pristup je održiv i menja život!",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    rating: 5,
  },
  {
    id: 2,
    name: "Stefan Jovanović",
    role: "IT Menadžer, 29 godina",
    content:
      "Kao amaterski triatlonac, trebao mi je plan ishrane koji bi gorivo za moja treninga. Jelena je kreirala savršen balans nutrijenata koji je poboljšao nivoe energije i vreme oporavka. Moje performanse su se drastično poboljšale!",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    rating: 5,
  },
  {
    id: 3,
    name: "Ana Milosavljević",
    role: "Mama dvoje dece, 31 godina",
    content:
      "Posle drugog porođaja nisam mogla da se vratim u formu. Jelena je kreirala plan koji se savršeno uklapa u moj užurban raspored kao mame. Rezultati su fantastični, a što je najvažnije - održivi!",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    rating: 5,
  },
  {
    id: 4,
    name: "David Rodriguez",
    role: "Porodična Ishrana",
    content:
      "Jelena je pomogla celoj našoj porodici da usvoji zdravije navike u ishrani. Njen pristup prilagođen deci olakšao je prelazak, a sada su naša deca uzbuđena da jedu povrće! Naši nivoi energije su porasli i svi bolje spavamo.",
    avatar:
      "https://images.unsplash.com/photo-1546456073-92b9f0a8d413?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    rating: 5,
  },
];

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
}

export default function TestimonialsSection({
  testimonials,
}: TestimonialsSectionProps) {
  const data = testimonials || fallbackTestimonials;
  const [currentSlide, setCurrentSlide] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { ref: headerRef, inView: headerInView } = useAnimateOnScroll();

  // Handle slider functionality
  const totalSlides = data.length;
  const slidesPerView = useWindowSize();

  const nextSlide = () => {
    if (currentSlide < totalSlides - slidesPerView) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      setCurrentSlide(0);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
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
          <p className="text-primary font-medium tracking-wide uppercase mb-2">
            RECENZIJE
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
            Šta Moji Klijenti Kažu
          </h2>
          <p className="text-gray-600">
            Najljepši dio mog posla su priče ljudi koji su odlučili da promijene svoj odnos prema hrani, i prema sebi. Ovdje možeš pročitati njihove iskrene utiske, male pobjede i velike promjene.
          </p>
        </motion.div>

        <div className="testimonial-slider relative">
          <div className="overflow-hidden">
            <div
              ref={wrapperRef}
              className="flex transition-transform duration-500"
            >
              {data.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                  slidesPerView={slidesPerView}
                />
              ))}
            </div>
          </div>

          <button
            onClick={prevSlide}
            className="absolute top-1/2 -left-4 lg:-left-6 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center focus:outline-none hover:bg-gray-100 transition z-10"
            aria-label="Prethodno svedočanstvo"
          >
            <i className="fas fa-chevron-left text-primary"></i>
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 -right-4 lg:-right-6 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center focus:outline-none hover:bg-gray-100 transition z-10"
            aria-label="Sledeće svedočanstvo"
          >
            <i className="fas fa-chevron-right text-primary"></i>
          </button>

          <div className="flex justify-center space-x-2 mt-8">
            {Array.from({ length: Math.ceil(totalSlides / slidesPerView) }).map(
              (_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full bg-primary transition-opacity duration-300 ${index === Math.floor(currentSlide / slidesPerView) ? "opacity-100" : "opacity-40"}`}
                  onClick={() => setCurrentSlide(index * slidesPerView)}
                  aria-label={`Idi na grupu svedočanstava ${index + 1}`}
                ></button>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  testimonial,
  slidesPerView,
}: {
  testimonial: Testimonial;
  slidesPerView: number;
}) {
  return (
    <div
      className={`w-full flex-shrink-0 px-4`}
      style={{ width: `${100 / slidesPerView}%` }}
    >
      <div className="bg-secondary rounded-xl p-6 shadow-lg h-full">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div>
              <h4 className="font-bold">{testimonial.name}</h4>
              <p className="text-gray-500 text-sm">{testimonial.role}</p>
            </div>
          </div>
          <div className="text-primary">
            <i className="fas fa-quote-right text-3xl opacity-50"></i>
          </div>
        </div>
        <p className="text-gray-600 mb-4">{testimonial.content}</p>
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

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return slidesPerView;
}
