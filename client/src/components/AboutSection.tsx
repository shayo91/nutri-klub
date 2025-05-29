import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { useLanguage } from "@/hooks/useLanguage";

export default function AboutSection() {
  const { t } = useLanguage();
  const { ref: imageRef, inView: imageInView } = useAnimateOnScroll();
  const { ref: contentRef, inView: contentInView } = useAnimateOnScroll(0.3);

  return (
    <section id="about" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* About Image */}
          <motion.div
            ref={imageRef}
            initial={{ opacity: 0, y: 20 }}
            animate={imageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="lg:w-5/12"
          >
            <div className="relative">
              <img
                src="/attached_assets/Screenshot 2025-05-29 at 11.27.01.png"
                alt="Professional Nutritionist creating healthy meal plans"
                className="rounded-lg shadow-xl w-full h-auto object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-secondary rounded-lg p-4 shadow-lg">
                <p className="text-primary font-bold text-3xl">5+</p>
                <p className="text-gray-700">Godina Iskustva</p>
              </div>
            </div>
          </motion.div>

          {/* About Content */}
          <motion.div
            ref={contentRef}
            initial={{ opacity: 0, y: 20 }}
            animate={
              contentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:w-7/12"
          >
            <p className="text-primary font-medium tracking-wide uppercase mb-2">
              {t("about.subtitle")}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
              {t("about.title")}
            </h2>
            <p className="text-gray-600 mb-6">{t("about.description1")}</p>
            <p className="text-gray-600 mb-6">{t("about.description2")}</p>

            {/* Qualifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start space-x-3">
                <div className="bg-secondary p-2 rounded-full mt-1">
                  <i className="fas fa-graduation-cap text-primary"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    Master Nutricionizma
                  </h3>
                  <p className="text-gray-600">
                    Inzenjer Prehrambene Tehnologije
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-secondary p-2 rounded-full mt-1">
                  <i className="fas fa-certificate text-primary"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Sertifikovani</h3>
                  <p className="text-gray-600">Nutricionista</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-secondary p-2 rounded-full mt-1">
                  <i className="fas fa-users text-primary"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">500+ Klijenata</h3>
                  <p className="text-gray-600">Zagarantovan Uspijeh</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-secondary p-2 rounded-full mt-1">
                  <i className="fas fa-book-medical text-primary"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    Kontinuirana Edukacija
                  </h3>
                  <p className="text-gray-600">
                    Istrazivanaja i najbolje prakse
                  </p>
                </div>
              </div>
            </div>

            <a
              href="#contact"
              className="inline-block px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-md font-medium transition duration-300 ease-in-out shadow-md hover:shadow-lg"
            >
              Zakaži Konsultaciju
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
