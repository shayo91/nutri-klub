import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { useLanguage } from "@/hooks/useLanguage";

export default function PricingSection() {
  const { t } = useLanguage();
  const { ref: pricingRef, inView: pricingInView } = useAnimateOnScroll(0.2);

  return (
    <section id="pricing" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          ref={pricingRef}
          initial={{ opacity: 0, y: 30 }}
          animate={pricingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-primary font-medium tracking-wide uppercase mb-2">
            CENOVNIK
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
            Izaberite Plan Koji Vam Odgovara
          </h2>
          <p className="text-gray-600">
            Nudim fleksibilne pakete prilagođene različitim potrebama i
            budžetima.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Basic Plan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={
              pricingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-gray-50 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-8">
              <h3 className="text-xl font-bold mb-4">Osnovni</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">€49</span>
                <span className="text-gray-500">/mesečno</span>
              </div>
              <p className="text-gray-600 mb-6">
                Osnovna nutritivna procena i personalizovani plan ishrane.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span>Osnovna nutritivna procena</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span>Personalizovani plan ishrane</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span>Mesečna kontrola</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span>Email podrška</span>
                </li>
              </ul>
              <a
                href="#contact"
                className="block w-full py-3 text-center bg-white border border-primary text-primary hover:bg-gray-50 rounded-lg font-medium transition duration-300"
              >
                Kontaktiraj
              </a>
            </div>
          </motion.div>

          {/* Premium Plan - Highlighted */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 1 }}
            animate={
              pricingInView
                ? { opacity: 1, y: 0, scale: 1.05 }
                : { opacity: 0, y: 30, scale: 1 }
            }
            transition={{ duration: 0.7, delay: 0.2 }}
            className="bg-white rounded-xl shadow-2xl overflow-hidden border-2 border-primary relative z-10 transform hover:scale-105 transition-transform duration-300"
          >
            <div className="absolute top-0 inset-x-0 bg-primary text-white text-center py-1 text-sm font-medium">
              Najpopularniji
            </div>
            <div className="p-8 pt-10">
              <h3 className="text-xl font-bold mb-4">Premium</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">€89</span>
                <span className="text-gray-500">/mesečno</span>
              </div>
              <p className="text-gray-600 mb-6">
                Sveobuhvatna nutritivna procena i prilagođeni planovi ishrane i
                recepti.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span>Sveobuhvatna nutritivna procena</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span>Prilagođeni planovi ishrane i recepti</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span>Dvonedeljne kontrole</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span>Prioritetna email i SMS podrška</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span>Pristup aplikaciji za praćenje ishrane</span>
                </li>
              </ul>
              <a
                href="#contact"
                className="block w-full py-3 text-center bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition duration-300"
              >
                Kontaktiraj
              </a>
            </div>
          </motion.div>

          {/* Ultimate Plan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={
              pricingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gray-50 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-8">
              <h3 className="text-xl font-bold mb-4">Ultimate</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">€149</span>
                <span className="text-gray-500">/mesečno</span>
              </div>
              <p className="text-gray-600 mb-6">
                Napredna analiza ishrane i zdravlja, nedeljne 1:1 sesije sa
                nutricionistom i premium resursi.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span>Napredna analiza ishrane i zdravlja</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span>Potpuno prilagođen program ishrane</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span>Nedeljne 1:1 sesije sa nutricionistom</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span>24/7 direktan pristup nutricionisti</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span>Premium aplikacija i resursi za ishranu</span>
                </li>
              </ul>
              <a
                href="#contact"
                className="block w-full py-3 text-center bg-white border border-primary text-primary hover:bg-gray-50 rounded-lg font-medium transition duration-300"
              >
                Kontaktiraj
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
