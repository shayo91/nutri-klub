import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { useLanguage } from "@/hooks/useLanguage";

export default function ProgramsSection() {
  const { t } = useLanguage();
  const { ref, inView } = useAnimateOnScroll(0.1);

  return (
    <section id="programs" className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <p className="text-primary font-medium tracking-wide uppercase mb-2">
              {t("programs.subtitle")}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
              {t("programs.title")}
            </h2>
          </div>

          <div className="space-y-12">
            {/* START Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-50 p-8 md:p-12 rounded-3xl border border-gray-100"
            >
              <h3 className="text-3xl font-bold mb-6 text-primary flex items-center">
                <span className="w-12 h-1 bg-primary mr-4 hidden md:block" />
                {t("programs.start.title")}
              </h3>
              
              <div className="grid md:grid-cols-5 gap-8">
                <div className="md:col-span-2">
                  <p className="text-xl font-semibold mb-4 text-gray-800">{t("programs.start.description")}</p>
                  <ul className="space-y-3">
                    {t("programs.start.points").split('\n').map((point, i) => (
                      <li key={i} className="flex items-start text-gray-700">
                        <span className="text-primary mr-2 font-bold">•</span>
                        {point.replace('• ', '')}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="md:col-span-3">
                  <p className="text-gray-600 leading-relaxed text-lg italic bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    {t("programs.start.info")}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* More / 1:1 Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-primary text-white p-8 md:p-12 rounded-3xl shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold mb-6">{t("programs.more.title")}</h3>
                
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <p className="text-xl font-medium mb-4 opacity-90">{t("programs.more.description")}</p>
                    <ul className="space-y-3 mb-8">
                      {t("programs.more.points").split('\n').map((point, i) => (
                        <li key={i} className="flex items-start">
                          <span className="mr-2 font-bold">•</span>
                          <span className="opacity-90">{point.replace('• ', '')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-center md:text-right">
                    <p className="text-xl md:text-2xl font-bold mb-8">
                      {t("programs.more.footer")}
                    </p>
                    <a
                      href="#contact"
                      className="inline-block bg-white text-primary px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
                    >
                      ZAKAŽI TERMIN
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
