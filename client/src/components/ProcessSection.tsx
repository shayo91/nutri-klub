import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { useLanguage } from "@/hooks/useLanguage";

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
    title: "Sveobuhvatna Procena",
    description:
      "Započinjemo sa sveobuhvatnom procenom vašeg trenutnog zdravstvenog stanja, medicinske istorije, životnih navika, preferencija u ishrani i specifičnih ciljeva.",
    features: [
      "Detaljan upitnik o zdravlju",
      "Analiza telesne kompozicije",
      "Izračunavanje nutritivnih potreba",
      "Diskusija o postavljanju ciljeva",
    ],
    delay: 0.15,
  },
  {
    id: 2,
    title: "Kreiranje Personalizovanog Plana",
    description:
      "Na osnovu prikupljenih informacija, razvijam prilagođeni plan ishrane koji se usklađuje sa vašim ciljevima uzimajući u obzir vaše preferencije i stil života.",
    features: [
      "Planovi obroka po meri",
      "Upustva o veličini porcija",
      "Recepti i saveti za pripremu",
      "Preporuke za suplementaciju",
    ],
    delay: 0.3,
  },
  {
    id: 3,
    title: "Implementacija i Podrška",
    description:
      "Oprovidam stalnu podršku i vođenje kako bih osigurao uspešnu implementaciju vašeg plana ishrane uz redovno prilagođavanje po potrebi.",
    features: [
      "Redovne sesije praćenja napretka",
      "Praćenje napretka",
      "Izmene plana po potrebi",
      "Kontinuirano obrazovanje i motivacija",
    ],
    delay: 0.45,
  },
];

export default function ProcessSection() {
  const { t } = useLanguage();
  const { ref: headerRef, inView: headerInView } = useAnimateOnScroll();
  const { ref: ctaRef, inView: ctaInView } = useAnimateOnScroll(0.6);

  return (
    <section id="process" aria-label="Proces rada sa nutricionistom" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-primary font-medium tracking-wide uppercase mb-2">
            Proces
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
            {t("process.title")}
          </h2>
          <p className="text-gray-600">{t("process.description")}</p>
        </motion.div>

        <div className="relative">
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
            className="inline-block px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-md font-medium transition duration-300 ease-in-out shadow-md hover:shadow-lg"
          >
            Započnite Vašu Nutricionističku Avanturu
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
      <h3 className="text-2xl font-bold font-poppins text-center mb-4">
        {step.title}
      </h3>
      <p className="text-gray-600 text-center mb-6">{step.description}</p>
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
