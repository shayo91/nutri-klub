import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";

type ProcessStep = {
  id: number;
  title: string;
  description: string;
  features: string[];
  delay: number;
};

const steps: ProcessStep[] = [
  {
    id: 1,
    title: "Comprehensive Assessment",
    description: "We begin with a thorough evaluation of your current health status, medical history, lifestyle habits, food preferences, and specific goals.",
    features: [
      "Detailed health questionnaire",
      "Body composition analysis",
      "Nutritional needs calculation",
      "Goal setting discussion"
    ],
    delay: 0.15
  },
  {
    id: 2,
    title: "Personalized Plan Creation",
    description: "Using the information gathered, I develop a customized nutrition plan that aligns with your objectives while considering your preferences and lifestyle.",
    features: [
      "Tailored meal plans",
      "Portion size guidance",
      "Recipes and preparation tips",
      "Supplementation recommendations"
    ],
    delay: 0.3
  },
  {
    id: 3,
    title: "Implementation & Support",
    description: "I provide ongoing guidance and support to ensure successful implementation of your nutrition plan with regular adjustments as needed.",
    features: [
      "Regular follow-up sessions",
      "Progress tracking",
      "Plan modifications as needed",
      "Continuous education and motivation"
    ],
    delay: 0.45
  }
];

export default function ProcessSection() {
  const { ref: headerRef, inView: headerInView } = useAnimateOnScroll();
  const { ref: ctaRef, inView: ctaInView } = useAnimateOnScroll(0.6);

  return (
    <section id="process" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div 
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-primary font-medium tracking-wide uppercase mb-2">OUR PROCESS</p>
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
            How We Create Your Nutrition Plan
          </h2>
          <p className="text-gray-600">
            My personalized approach ensures that your nutrition plan is as unique as you are, designed to fit your lifestyle and help you achieve your goals.
          </p>
        </motion.div>
        
        <div className="relative">
          {/* Process Connection Line (desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            {steps.map((step) => (
              <ProcessCard key={step.id} step={step} />
            ))}
          </div>
        </div>
        
        <motion.div 
          ref={ctaRef}
          initial={{ opacity: 0, y: 20 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <a 
            href="#contact" 
            className="inline-block px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-md font-medium transition duration-300 ease-in-out shadow-md hover:shadow-lg"
          >
            Start Your Nutrition Journey
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function ProcessCard({ step }: { step: ProcessStep }) {
  const { ref, inView } = useAnimateOnScroll(step.delay);

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: step.delay }}
      className="bg-white rounded-xl p-8 shadow-lg"
    >
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
          {step.id}
        </div>
      </div>
      <h3 className="text-2xl font-bold font-poppins text-center mb-4">{step.title}</h3>
      <p className="text-gray-600 text-center mb-6">
        {step.description}
      </p>
      <ul className="space-y-3">
        {step.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <i className="fas fa-check-circle text-primary mt-1 mr-3"></i>
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
