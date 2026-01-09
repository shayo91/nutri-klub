import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import aboutImage1 from "@assets/image_1767986294610.png";
import aboutImage2 from "@assets/viber_slika_2023-03-27_22-03-28-302_1767986440133.jpg";

export default function AboutMe() {
  const { ref, inView } = useAnimateOnScroll(0.1);
  const { ref: ref2, inView: inView2 } = useAnimateOnScroll(0.1);

  return (
    <div className="min-h-screen bg-white">
      {/* First Section - Mint background */}
      <section className="py-12 md:py-20" style={{ backgroundColor: "#9FE2BF" }}>
        <div className="container mx-auto px-4">
          <Link 
            href="/" 
            className="inline-flex items-center text-gray-800 hover:text-gray-600 mb-8 transition-colors duration-300" 
            data-testid="link-back-home"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Nazad na početnu
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center" ref={ref}>
            {/* Text Content - Left on desktop, bottom on mobile */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <p className="text-gray-700 font-medium tracking-wide uppercase mb-2 text-sm" data-testid="text-about-subtitle">
                O MENI
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-gray-900" data-testid="text-about-title">
                Zdravo, ja sam Jelena!
              </h1>
              <p className="text-base md:text-lg text-gray-800 leading-relaxed mb-6" data-testid="text-about-intro">
                Pomažem ljudima koji žele da unaprijede ishranu kroz praktične, zdrave i ukusne recepte. Želim da te inspirišem i pokažem da pravilna ishrana ne mora biti teška, komplikovana ni isključiva.
              </p>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-8" data-testid="text-about-description">
                Oduvijek sam bila gurman, ali sam svoju pravu strast prema kuhanju otkrila tokom pandemije 2020. godine. Tada smo svi nekako imali više vremena za nove hobije, pa sam i ja večeri provodila istražujući recepte koje bih već sljedeći dan isprobavala u kuhinji.
              </p>
              <a
                href="/#contact"
                className="inline-block bg-white text-gray-800 px-8 py-4 rounded-full font-semibold text-base md:text-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
                data-testid="button-contact-about"
              >
                Kontaktiraj me
              </a>
            </motion.div>

            {/* Image - Right on desktop, top on mobile */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="order-1 lg:order-2 flex justify-center lg:justify-end"
            >
              <div className="relative">
                <div className="absolute -inset-3 bg-white/40 rounded-3xl transform rotate-2"></div>
                <img
                  src={aboutImage1}
                  alt="Jelena - Magistar nutricionizma"
                  className="relative w-full max-w-sm md:max-w-md h-auto rounded-2xl shadow-xl"
                  data-testid="img-about-jelena-1"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Second Section - Mint background with text left, image right */}
      <section className="py-12 md:py-20" style={{ backgroundColor: "#ECF8F2" }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center" ref={ref2}>
            {/* Text Content - Left */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView2 ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
                U međuvremenu sam završila osnovne i master studije na Tehnološkom fakultetu, a potom i master nutricionizma. Tako sam stekla zvanja dipl. ing. prehrambene tehnologije (Univerzitet u Banjoj Luci) i magistrica nutricionizma (Univerzitet u Tuzli). Tamo sam imala priliku da o hrani učim na potpuno drugačiji način. Ne samo šta jedemo, već i zašto je važno i kako, kada i u kojim količinama jedemo, te kako različiti sastojci i kombinacije namirnica utiču na naš organizam.
              </p>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
                Veliki dio mog profesionalnog puta oblikovalo je lično iskustvo sa autoimunim i probavnim izazovima (gastritis, Hashimoto, celijakija). To me je naučilo koliko su hrana, okolina, naše navike, misli i ritam života snažno povezani sa zdravljem, hormonima i probavom.
              </p>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                Volim da putujem, istražujem nova mjesta i nove kuhinje, skupljam ideje i pretvaram ih u recepte koje dijelim s tobom. I sama sam na bezglutenskoj ishrani, pa ćeš ovdje pronaći mnoštvo bezglutenskih recepata.
              </p>
            </motion.div>

            {/* Image - Right */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView2 ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="order-1 lg:order-2 flex justify-center lg:justify-end"
            >
              <div className="relative">
                <div className="absolute -inset-3 bg-[#9FE2BF]/50 rounded-3xl transform -rotate-2"></div>
                <img
                  src={aboutImage2}
                  alt="Jelena sa laptopom"
                  className="relative w-full max-w-sm md:max-w-md h-auto rounded-2xl shadow-xl"
                  data-testid="img-about-jelena-2"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Third Section - CTA */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-gray-900" data-testid="text-ready-title">
              Radujem se našoj saradnji.
            </h2>
            <p className="text-base md:text-lg text-gray-600 mb-10 leading-relaxed" data-testid="text-ready-description">
              Bez obzira da li tek počinješ ili si već probao/la razne pristupe – ovdje ćeš pronaći podršku, jasne smjernice i pristup koji je prilagođen tebi. Zajedno ćemo napraviti plan koji možeš održati dugoročno.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/#pricing"
                className="inline-block bg-[#1F7A5C] text-white px-8 py-4 rounded-full font-semibold text-base md:text-lg hover:bg-[#185F48] hover:shadow-lg hover:scale-105 transition-all duration-300"
                data-testid="button-view-packages"
              >
                Pogledaj pakete
              </a>
              <a
                href="/#contact"
                className="inline-block bg-gray-100 text-gray-800 px-8 py-4 rounded-full font-semibold text-base md:text-lg hover:bg-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-300"
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
