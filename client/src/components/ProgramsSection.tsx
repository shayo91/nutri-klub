import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function ProgramsSection() {
  const { t } = useLanguage();
  const { ref, inView } = useAnimateOnScroll(0.1);

  return (
    <section id="programs" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-primary font-medium tracking-wide uppercase mb-2">
            {t("programs.subtitle")}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
            {t("programs.title")}
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* START Program */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-full border-none shadow-xl bg-white overflow-hidden">
              <div className="h-2 bg-primary w-full" />
              <CardContent className="p-8 md:p-10">
                <h3 className="text-3xl font-bold mb-6 text-primary">{t("programs.start.title")}</h3>
                <p className="text-lg font-semibold mb-6">{t("programs.start.description")}</p>
                <div className="space-y-4 mb-8">
                  {t("programs.start.points").split('\n').map((point, i) => (
                    <div key={i} className="flex items-start">
                      <Check className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{point.replace('• ', '')}</span>
                    </div>
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed italic border-l-4 border-primary/20 pl-4">
                  {t("programs.start.info")}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* 1:1 Programs */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="h-full border-none shadow-xl bg-primary text-white overflow-hidden">
              <CardContent className="p-8 md:p-10">
                <h3 className="text-2xl font-bold mb-4">{t("programs.more.title")}</h3>
                <p className="text-xl font-medium mb-6 opacity-90">{t("programs.more.description")}</p>
                <div className="space-y-4 mb-10">
                  {t("programs.more.points").split('\n').map((point, i) => (
                    <div key={i} className="flex items-start">
                      <Check className="w-5 h-5 text-white mr-3 mt-1 flex-shrink-0" />
                      <span className="opacity-90">{point.replace('• ', '')}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-auto pt-8 border-t border-white/20">
                  <p className="text-xl font-bold text-center">
                    {t("programs.more.footer")}
                  </p>
                  <div className="mt-8 flex justify-center">
                    <a
                      href="#contact"
                      className="bg-white text-primary px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg"
                    >
                      ZAKAŽI TERMIN
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
