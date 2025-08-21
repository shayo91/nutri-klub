
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";

const faqs = [
  {
    question: "Koliko brzo mogu da vidim rezultate?",
    answer: "Većina klijenata vidi prve rezultate nakon 2-3 nedelje, a značajne promene nakon 4-6 nedelja. Brzina zavisi od vaše početne situacije i posvećenosti planu."
  },
  {
    question: "Da li mogu da jedem svoju omiljenu hranu?",
    answer: "Apsolutno! Moj pristup ne zabranjuje hranu, već uči balans. 80% zdrave hrane, 20% onog što volite - to je formula koja funkcioniše dugoročno."
  },
  {
    question: "Koliko košta vaša usluga?",
    answer: "Cene se kreću od 50€ za osnovni plan do 150€ za premium program sa individualnim praćenjem. Prva konsultacija je besplatna."
  },
  {
    question: "Da li radite sa specifičnim zdravstvenim stanjima?",
    answer: "Da, imam iskustva sa dijabetesom, hipertenzijom, PCOS, i drugim stanjima. Uvek preporučujem saradnju sa vašim lekarom."
  },
  {
    question: "Šta ako ne vidim rezultate?",
    answer: "Nudim 30-dnevnu garanciju. Ako se držite plana i ne vidite rezultate, vratićemo vam novac ili prilagoditi pristup."
  },
  {
    question: "Koliko često se konsultujemo?",
    answer: "Nedeljno ili bi-nedeljno, u zavisnosti od paketa. Uvek sam dostupna preko WhatsApp-a za hitna pitanja."
  }
];

export default function FAQSection() {
  const { ref: headerRef, inView: headerInView } = useAnimateOnScroll();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-primary font-medium tracking-wide uppercase mb-2">
            ČESTA PITANJA
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
            Odgovori na Najčešća Pitanja
          </h2>
          <p className="text-gray-600">
            Evo odgovora na pitanja koja mi klijenti najčešće postavljaju
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="mb-4"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg pr-4">{faq.question}</h3>
                  <svg
                    className={`w-5 h-5 text-primary transform transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
            Imate još pitanja? Kontaktirajte me direktno!
          </p>
          <a
            href="#contact"
            className="inline-block px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-md font-medium transition duration-300 ease-in-out"
          >
            Postavite Pitanje
          </a>
        </motion.div>
      </div>
    </section>
  );
}
