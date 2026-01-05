import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { useLanguage } from "@/hooks/useLanguage";

export default function ProgramsSection() {
  const { t } = useLanguage();
  const { ref, inView } = useAnimateOnScroll(0.1);

  return (
    <section id="programs" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-12">
            <p className="text-primary font-medium tracking-wide uppercase mb-2">
              MOJI PROGRAMI
            </p>
            <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
              Nisi siguran/na odakle da kreneš?
            </h2>
          </div>

          <div className="space-y-12 text-gray-800">
            {/* START Section */}
            <div className="border-l-4 border-primary pl-6 py-2">
              <h3 className="text-2xl font-bold mb-4 text-primary">START</h3>
              <p className="text-lg font-semibold mb-3">Online platforma za sve koji žele:</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span>pronaći inspiraciju u kuhinji</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span>kreirati strukturu (nabavka, kuhanje, organizacija)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span>uživati u hrani – bez kazne i grižnje savjesti</span>
                </li>
              </ul>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>Ovo je program koji sam napravila da bude dostupan svima.</p>
                <p>Bez moje direktne podrške, ali sa jasnim smjernicama koje te pokreću sa mjesta.</p>
                <p>
                  Dobijaš konkretne korake koji su se pokazali najboljim – u mojoj kuhinji i u radu sa klijentima 
                  uz 100+ zdravih i ukusnih recepata na jednom mjestu.
                </p>
              </div>
            </div>

            {/* 1:1 Section */}
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <h3 className="text-xl font-bold mb-4">Ako osjećaš da želiš više…</h3>
              <p className="text-lg font-semibold mb-3">Ako želiš:</p>
              <ul className="space-y-2 mb-8">
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span>lični pristup</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span>strukturu prilagođenu baš tebi</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span>individualan rad na tvojim navikama</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span>personalizovan jelovnik</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  <span>kontinuiranu podršku</span>
                </li>
              </ul>
              
              <div className="pt-6 border-t border-gray-200">
                <p className="text-xl font-bold text-center mb-8">
                  Čekam te u 1:1 programima BALANS ili TRANSFORMACIJA.
                </p>
                <div className="flex justify-center">
                  <a
                    href="#contact"
                    className="bg-primary text-white px-10 py-3 rounded-full font-bold hover:bg-primary/90 transition-all transform hover:scale-105 shadow-md"
                  >
                    ZAKAŽI TERMIN
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
