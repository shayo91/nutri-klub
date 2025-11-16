import { useState } from "react";
import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import dobrilaBeforeImg from "@assets/image_1763294829938.png";
import dobrilaAfterImg from "@assets/image_1763294848283.png";
import milenaBeforeImg from "@assets/image_1763295037026.png";
import milenaAfterImg from "@assets/image_1763295022857.png";

type ResultCard = {
  id: number;
  name: string;
  beforeImage: string;
  afterImage: string;
  weightLoss: string;
  timeframe: string;
  testimonial: string;
};

export default function ResultsSection() {
  const { ref: headerRef, inView: headerInView } = useAnimateOnScroll();
  const [sliderPositions, setSliderPositions] = useState<{ [key: number]: number }>({
    1: 50,
    2: 50,
    3: 50,
    4: 50
  });

  const results: ResultCard[] = [
    {
      id: 1,
      name: "Dobrila",
      beforeImage: dobrilaBeforeImg,
      afterImage: dobrilaAfterImg,
      weightLoss: "-8 kg",
      timeframe: "3 meseca",
      testimonial: "Nikad se nisam osećala bolje! Jelena mi je pomogla da pronađem balans u ishrani."
    },
    {
      id: 2,
      name: "Milena",
      beforeImage: milenaBeforeImg,
      afterImage: milenaAfterImg,
      weightLoss: "-20 kg",
      timeframe: "7 meseci",
      testimonial: "Transformacija koja je promenila moj život. Hvala Jeleni na stručnoj podršci!"
    },
    {
      id: 3,
      name: "Ana T.",
      beforeImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=500&fit=crop&crop=face",
      afterImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=face",
      weightLoss: "-12 kg",
      timeframe: "4 meseca",
      testimonial: "Konačno sam naučila kako da se hranim zdravo bez odricanja od ukusa."
    },
    {
      id: 4,
      name: "Miloš D.",
      beforeImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face",
      afterImage: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=500&fit=crop&crop=face",
      weightLoss: "-18 kg",
      timeframe: "7 meseci",
      testimonial: "Plan ishrane je bio savršeno prilagođen mom životnom stilu. Preporučujem svima!"
    }
  ];

  const handleSliderChange = (id: number, position: number) => {
    setSliderPositions(prev => ({
      ...prev,
      [id]: position
    }));
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 to-secondary/10">
      <div className="container mx-auto px-4">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-primary font-medium tracking-wide uppercase mb-2">
            NAŠI REZULTATI
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
            Tvoja priča može biti sledeća.
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Svaka transformacija ovdje je priča o hrabrosti, strpljenju i povjerenju.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Before/After Image Slider */}
              <div className="relative h-80 overflow-hidden">
                <div className="absolute inset-0">
                  <img
                    src={result.beforeImage}
                    alt={`${result.name} - pre`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div 
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - sliderPositions[result.id]}% 0 0)` }}
                >
                  <img
                    src={result.afterImage}
                    alt={`${result.name} - posle`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Slider Control */}
                <div className="absolute inset-0 flex items-center">
                  <div className="relative w-full">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliderPositions[result.id]}
                      onChange={(e) => handleSliderChange(result.id, parseInt(e.target.value))}
                      className="w-full opacity-0 cursor-pointer absolute z-10"
                    />
                    <div 
                      className="absolute top-1/2 transform -translate-y-1/2 w-1 bg-white shadow-lg rounded-full h-full"
                      style={{ left: `${sliderPositions[result.id]}%`, marginLeft: '-2px' }}
                    >
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Before/After Labels */}
                <div className="absolute top-4 left-4 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs font-medium">
                  PRE
                </div>
                <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs font-medium">
                  POSLE
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-lg">{result.name}</h3>
                  <div className="text-right">
                    <div className="text-primary font-bold text-xl">{result.weightLoss}</div>
                    <div className="text-gray-500 text-sm">{result.timeframe}</div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm italic">
                  "{result.testimonial}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-6">
            Spremni ste da budete sledeći uspeh? Započnite svoju transformaciju danas!
          </p>
          <a
            href="#contact"
            className="inline-block px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-md font-medium transition duration-300 ease-in-out shadow-md hover:shadow-lg"
          >
            Počnite Svoju Transformaciju
          </a>
        </motion.div>
      </div>
    </section>
  );
}