import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { useLanguage } from "@/hooks/useLanguage";

type Service = {
  id: number;
  title: string;
  description: string;
  image: string;
  delay: number;
};

const services: Service[] = [
  {
    id: 1,
    title: "Personalized Meal Plans",
    description: "Custom nutrition plans tailored to your specific body composition, lifestyle, preferences, and health goals.",
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
    delay: 0.15
  },
  {
    id: 2,
    title: "One-on-One Coaching",
    description: "Personal nutrition consultations with regular follow-ups to monitor progress and make adjustments as needed.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
    delay: 0.3
  },
  {
    id: 3,
    title: "Weight Management",
    description: "Sustainable weight loss or gain programs that focus on healthy, long-term habits rather than quick fixes.",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
    delay: 0.45
  },
  {
    id: 4,
    title: "Specialized Dietary Plans",
    description: "Expert guidance for specific dietary needs including vegetarian, vegan, gluten-free, and food sensitivities.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
    delay: 0.6
  },
  {
    id: 5,
    title: "Sports Nutrition",
    description: "Optimize athletic performance with nutrition plans designed specifically for athletes and active individuals.",
    image: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
    delay: 0.75
  },
  {
    id: 6,
    title: "Nutrition Workshops",
    description: "Group sessions and workshops covering essential nutrition topics, meal preparation, and healthy cooking techniques.",
    image: "https://images.unsplash.com/photo-1515169067868-5387ec356754?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
    delay: 0.9
  }
];

export default function ServicesSection() {
  const { t } = useLanguage();
  const { ref: headerRef, inView: headerInView } = useAnimateOnScroll();

  return (
    <section id="services" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div 
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-primary font-medium tracking-wide uppercase mb-2">{t('services.subtitle')}</p>
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
            {t('services.title')}
          </h2>
          <p className="text-gray-600">
            {t('services.description')}
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const { ref, inView } = useAnimateOnScroll(service.delay);

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: service.delay }}
      className="bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={service.image} 
          alt={service.title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold font-poppins mb-3">{service.title}</h3>
        <p className="text-gray-600 mb-4">
          {service.description}
        </p>
        <a href="#contact" className="text-primary font-medium hover:text-primary-dark transition flex items-center">
          Learn More <i className="fas fa-arrow-right ml-2 text-sm"></i>
        </a>
      </div>
    </motion.div>
  );
}
