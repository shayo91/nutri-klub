import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import doctorImage from "@assets/jelena-hero.png";
import { Link } from "wouter";
import { ArrowLeft, Award, Users, Heart, Clock } from "lucide-react";

export default function AboutMe() {
  const { ref, inView } = useAnimateOnScroll(0.1);

  return (
    <div className="min-h-screen bg-white">
      <section className="py-16 md:py-24" style={{ backgroundColor: "#9FE2BF" }}>
        <div className="container mx-auto px-4">
          <Link href="/" className="inline-flex items-center text-gray-800 hover:text-gray-600 mb-8 transition-colors" data-testid="link-back-home">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Nazad na početnu
          </Link>
          
          <div className="grid md:grid-cols-2 gap-12 items-center" ref={ref}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-gray-700 font-medium tracking-wide uppercase mb-2" data-testid="text-about-subtitle">
                O MENI
              </p>
              <h1 className="text-4xl md:text-5xl font-bold mb-6" data-testid="text-about-title">
                Zdravo, ja sam Jelena!
              </h1>
              <p className="text-lg text-gray-800 leading-relaxed mb-6" data-testid="text-about-intro">
                Magistar sam nutricionizma sa dugogodišnjim iskustvom u radu sa klijentima koji žele da promijene svoj odnos prema hrani i tijelu.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-8" data-testid="text-about-description">
                Moja misija je da ti pomognem da se osjećaš dobro u svom tijelu, da uživaš u hrani bez osjećaja krivice, i da pronađeš balans koji funkcioniše baš za tebe. Vjerujem da promjena ne mora biti teška – treba ti samo pravi pristup i podrška.
              </p>
              <a
                href="/#contact"
                className="inline-block bg-white text-gray-800 px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg transition-all transform hover:scale-105"
                data-testid="button-contact-about"
              >
                Kontaktiraj me
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-white/30 rounded-3xl transform rotate-3"></div>
                <img
                  src={doctorImage}
                  alt="Jelena - Magistar nutricionizma"
                  className="relative w-full max-w-md h-auto rounded-2xl shadow-2xl"
                  data-testid="img-about-jelena"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto"
          >
            <div className="text-center p-6" data-testid="stat-clients">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-primary mb-2">100+</h3>
              <p className="text-gray-600">Zadovoljnih klijenata</p>
            </div>
            
            <div className="text-center p-6" data-testid="stat-experience">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-primary mb-2">10+</h3>
              <p className="text-gray-600">Godina iskustva</p>
            </div>
            
            <div className="text-center p-6" data-testid="stat-education">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-primary mb-2">MSc</h3>
              <p className="text-gray-600">Magistar nutricionizma</p>
            </div>
            
            <div className="text-center p-6" data-testid="stat-passion">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-primary mb-2">100%</h3>
              <p className="text-gray-600">Posvećenost klijentima</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8" data-testid="text-ready-title">
              Spremna sam da ti pomognem na putu ka zdravlju
            </h2>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed" data-testid="text-ready-description">
              Bez obzira da li tek počinješ ili si već probao/la razne pristupe – ovdje ćeš pronaći podršku, jasne smjernice i pristup koji je prilagođen tebi. Zajedno ćemo napraviti plan koji možeš održati dugoročno.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/#pricing"
                className="inline-block bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-all transform hover:scale-105"
                data-testid="button-view-packages"
              >
                Pogledaj pakete
              </a>
              <a
                href="/#contact"
                className="inline-block bg-gray-100 text-gray-800 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-200 transition-all transform hover:scale-105"
                data-testid="button-contact-cta"
              >
                Pošalji poruku
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
