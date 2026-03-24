import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { Helmet } from "react-helmet";

const faqs = [
  {
    question: "Kako izgleda online konsultacija?",
    answer: "Online konsultacija je jednostavna i dostupna bez obzira gdje se nalazite. Termin zakazujete putem kontakt forme, a razgovor se odvija putem video poziva. Tokom konsultacije prolazimo kroz vaše navike, zdravstvenu istoriju, ciljeve i izazove. Nakon toga dobijate personalizovan plan ishrane i jasne smjernice, uz mogućnost kontinuirane podrške i praćenja napretka."
  },
  {
    question: "Da li mi je potrebna dijeta ili promjena načina života?",
    answer: "Većini ljudi nije potrebna restriktivna dijeta, potrebna im je održiva promjena navika. Umjesto gladovanja i rigoroznih režima koji vode do jo-jo efekta, fokus je na balansiranoj, realnoj i dugoročno održivoj ishrani koja se uklapa u vaš svakodnevni život. Cilj nije kratkoročan rezultat, već stabilno zdravlje i odnos s hranom bez stresa."
  },
  {
    question: "Koliko brzo mogu očekivati rezultate?",
    answer: "Prve promjene većina klijenata primijeti nakon 2–3 sedmice, dok su vidljiviji rezultati najčešće nakon 6–8 sedmica. Brzina napretka zavisi od početnog stanja, ciljeva i dosljednosti u primjeni plana. Fokus je na zdravim i održivim rezultatima, bez ekstremnih mjera."
  },
  {
    question: "Da li ću morati da se odreknem omiljene hrane?",
    answer: "Ne. Moj pristup se zasniva na balansu, a ne zabrani. Hrana nije “dobra” ili “loša” važno je koliko često i u kojoj količini je konzumiramo. Plan ishrane uključuje namirnice koje volite, uz jasne smjernice kako da ih uklopite bez osjećaja krivice."
  },
  {
    question: "Želim da se udebljam, a ne da smršam?",
    answer: "Dobijanje zdrave težine zahtijeva isto toliko planiranja i pažnje kao i mršavljenje. Kao nutricionista, kreiram plan ishrane koji fokus stavlja na kvalitetne kalorije i nutritivno bogate obroke. Plan uključuje lokalne namirnice i recepte koje volite, uz praktične savjete kako da dodate više energije i obroka u svoj dan radi povećanja mišićne mase."
  },
  {
    question: "Da li nudite podršku između konsultacija?",
    answer: "Da, podrška između konsultacija je dostupna putem poruka. Možete postavljati pitanja, dijeliti rezultate i dobijati smjernice u realnom vremenu. Online podrška pomaže da se držite plana ishrane i motivišete tokom cijelog procesa, što je ključno za održive rezultate."
  },
  {
    question: "Radite li planove ishrane za specifične ciljeve?",
    answer: `Da. Svaki plan ishrane prilagođavam vašim ciljevima i životnom stilu, npr.
• Mršavljenje – bez gladovanja, sa održivim balansom makronutrijenata
• Debljanje – fokus na kvalitetne kalorije i nutritivno bogate obroke
• Hormonski balans – savjeti za žene sa PCOS, IR, u menopauzi
• Bezglutenska ishrana – za osobe koje izbjegavaju gluten`
  }


];

export default function FAQSection() {
  const { ref: headerRef, inView: headerInView } = useAnimateOnScroll();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const visibleFaqs = faqs.filter((faq) => faq.question.trim())
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": visibleFaqs.map(faq => ({
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
          initial={{ opacity: 0, y: 12 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.45 }}
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
          {visibleFaqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
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
                    <div className="px-6 pb-6 pt-3 text-gray-600 leading-relaxed whitespace-pre-line">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-6">
            Imate još pitanja? Kontaktirajte me!
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
