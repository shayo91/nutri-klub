import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { Helmet } from "react-helmet";

const faqs = [
  {
    question: "Koliko košta nutricionist?",
    answer: "Cijene usluga nutricionista variraju u zavisnosti od paketa. Osnovni plan ishrane kreće od 50€, dok premium program sa individualnim praćenjem košta do 150€. Prva konsultacija sa nutricionistom je potpuno besplatna - zakažite online konsultaciju i saznajte koji plan ishrane BiH odgovara vašim ciljevima za mršavljenje ili debljanje."
  },
  {
    question: "Kako funkcioniše online konsultacija?",
    answer: "Online konsultacija sa nutricionistom je jednostavna i dostupna iz cijele Bosne i Hercegovine. Zakazujete termin putem kontakt forme ili WhatsApp-a, a konsultacija se odvija putem video poziva. Dobijate personalizovan plan ishrane, dijeta savjete prilagođene vašem načinu života, i kontinuiranu podršku za zdravlje i ishranu. Idealno za klijente iz Banja Luke, Sarajeva, Tuzle i svih drugih gradova BiH."
  },
  {
    question: "Da li trebam dijetu ili promjenu lifestyle-a?",
    answer: "Većina ljudi ne treba striktnu dijetu - treba im održiva promjena načina ishrane i životnih navika. Kao nutricionist, ne preporučujem gladovanje ili restriktivne dijete koje vode jojo efektu. Umjesto toga, kreiram personalizovan plan ishrane koji se uklapa u vaš svakodnevni život, pomažući vam da postignete ciljeve mršavljenja ili zdravog debljanja bez stresa. Dijeta savjeti koje dobijete su praktični i primjenjivi odmah."
  },
  {
    question: "Koliko brzo mogu da vidim rezultate?",
    answer: "Većina klijenata vidi prve rezultate nakon 2-3 sedmice, a značajne promjene nakon 4-6 sedmica. Brzina zavisi od vaše početne situacije i posvećenosti planu ishrane. Mršavljenje u Bosni i Hercegovini ne mora biti teško - uz pravilnu ishranu i stručnu podršku online nutricionista, rezultati dolaze prirodno."
  },
  {
    question: "Da li mogu da jedem svoju omiljenu hranu?",
    answer: "Apsolutno! Moj pristup kao nutricionista ne zabranjuje hranu, već uči balans. 80% zdrave hrane, 20% onog što volite - to je formula koja funkcioniše dugoročno. Plan ishrane BiH koji kreiram uključuje lokalne namirnice i recepte prilagođene vašem ukusu."
  },
  {
    question: "Da li radite sa specifičnim zdravstvenim stanjima?",
    answer: "Da, imam iskustva sa dijabetesom, hipertenzijom, PCOS, celijakijom i drugim stanjima. Kao online nutricionist, uvijek preporučujem saradnju sa vašim ljekarom. Bezglutenska ishrana, planovi za zdravlje ishrana kod hroničnih bolesti - sve je dio moje prakse nutricionista u Banja Luci i širom BiH."
  }
];

export default function FAQSection() {
  const { ref: headerRef, inView: headerInView } = useAnimateOnScroll();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section id="faq" aria-label="Često postavljana pitanja" className="py-16 md:py-24 bg-primary-bg">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqJsonLd)}
        </script>
      </Helmet>
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
            Evo odgovora na pitanja koja klijenti najčešće postavljaju nutricionisti
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
                    className={`w-5 h-5 text-primary transform transition-transform flex-shrink-0 ${
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
                    <div className="px-6 pb-6 pt-3 text-gray-600 leading-relaxed">
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
            Imate još pitanja? Kontaktirajte nutricionista direktno!
          </p>
          <a
            href="#contact"
            className="inline-block px-8 py-3 bg-[#5EBA9A] hover:bg-[#4DA88A] text-white rounded-full font-medium transition duration-300 ease-in-out shadow-md"
          >
            Postavite Pitanje
          </a>
        </motion.div>
      </div>
    </section>
  );
}
