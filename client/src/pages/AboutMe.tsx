import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { Helmet } from "react-helmet";
import aboutImage1 from "@assets/image_1767988070262.png";
import aboutImage2 from "@assets/image_1767988208117.png";

export default function AboutMe() {
  const { ref, inView } = useAnimateOnScroll(0.1);
  const { ref: ref2, inView: inView2 } = useAnimateOnScroll(0.1);

  return (
    <>
      <Helmet>
        <title>O meni - Nutricionista Jelena Matijaš | Personalizovana ishrana</title>
        <meta name="description" content="Upoznajte Jelenu Matijaš, magistricu nutricionizma sa bogatim iskustvom u personalizovanoj ishrani. Specijalizirana za bezglutensku ishranu i autoimune izazove." />
        <meta property="og:title" content="O meni - Nutricionista Jelena Matijaš" />
        <meta property="og:description" content="Magistrica nutricionizma posvećena zdravoj i praktičnoj ishrani. Specijalizirana za bezglutenske recepte i autoimune izazove." />
      </Helmet>
      
      <main className="min-h-screen bg-white font-sans">
        {/* First Section - Mint background */}
        <section className="py-16 md:py-24" style={{ backgroundColor: "#9FE2BF" }} aria-label="Upoznajte Jelenu">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center" ref={ref}>
              {/* Text Content - Left on desktop, bottom on mobile */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{ duration: 0.6 }}
                className="order-2 lg:order-1"
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
                  Zdravo, ja sam Jelena!
                </h1>
                <p className="text-base md:text-lg text-gray-800 leading-relaxed mb-5">
                  Pomažem ljudima koji žele da unaprijede ishranu kroz praktične, zdrave i ukusne recepte. Želim da te inspirišem i pokažem da pravilna ishrana ne mora biti teška, komplikovana ni isključiva.
                </p>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-5">
                  Oduvijek sam bila gurman, ali sam svoju pravu strast prema kuhanju otkrila tokom pandemije 2020. godine. Tada smo svi nekako imali više vremena za nove hobije, pa sam i ja večeri provodila istražujući recepte koje bih već sljedeći dan isprobavala u kuhinji.
                </p>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  U međuvremenu sam završila osnovne i master studije na Tehnološkom fakultetu, a potom i master nutricionizma. Tako sam stekla zvanja dipl. ing. prehrambene tehnologije (Univerzitet u Banjoj Luci) i magistrica nutricionizma (Univerzitet u Tuzli). Tamo sam imala priliku da o hrani učim na potpuno drugačiji način. Ne samo šta jedemo, već i zašto je važno i kako, kada i u kojim količinama jedemo, te kako različiti sastojci i kombinacije namirnica utiču na naš organizam.
                </p>
              </motion.div>

              {/* Image - Right on desktop, top on mobile */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="order-1 lg:order-2 flex justify-center lg:justify-end"
              >
                <div className="relative">
                  <div className="absolute -inset-4 bg-white/50 rounded-3xl transform rotate-3"></div>
                  <img
                    src={aboutImage1}
                    alt="Jelena Matijaš - Nutricionista i magistrica nutricionizma"
                    className="relative w-full max-w-xs sm:max-w-sm md:max-w-md h-auto rounded-2xl shadow-xl"
                    loading="eager"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Second Section - Light mint background with text left, image far right */}
        <section className="py-12 md:py-16" style={{ backgroundColor: "#ECF8F2" }} aria-label="Moj profesionalni put">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center" ref={ref2}>
              {/* Text Content - Left */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={inView2 ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{ duration: 0.6 }}
                className="order-2 lg:order-1"
              >
                <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-5">
                  Veliki dio mog profesionalnog puta oblikovalo je lično iskustvo sa autoimunim i probavnim izazovima (gastritis, Hashimoto, celijakija). To me je naučilo koliko su hrana, okolina, naše navike, misli i ritam života snažno povezani sa zdravljem, hormonima i probavom.
                </p>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  Volim da putujem, istražujem nova mjesta i nove kuhinje, skupljam ideje i pretvaram ih u recepte koje dijelim s tobom. I sama sam na bezglutenskoj ishrani, pa ćeš ovdje pronaći mnoštvo bezglutenskih recepata.
                </p>
              </motion.div>

              {/* Image - Far Right */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={inView2 ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="order-1 lg:order-2 flex justify-center lg:justify-end"
              >
                <img
                  src={aboutImage2}
                  alt="Jelena Matijaš sa laptopom - Online nutricionističke konsultacije"
                  className="w-full max-w-xs sm:max-w-sm h-auto rounded-2xl shadow-lg"
                  loading="lazy"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Third Section - CTA */}
        <section className="py-16 md:py-20 bg-white" aria-label="Poziv na akciju">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Radujem se našoj saradnji.
              </h2>
              <p className="text-base md:text-lg text-gray-600 mb-10 leading-relaxed">
                Bez obzira da li tek počinješ ili si već probao/la razne pristupe – ovdje ćeš pronaći podršku, jasne smjernice i pristup koji je prilagođen tebi. Zajedno ćemo napraviti plan koji možeš održati dugoročno.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/#pricing"
                  className="inline-block bg-[#1F7A5C] text-white px-8 py-4 rounded-full font-semibold text-base md:text-lg hover:bg-[#185F48] hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Pogledaj pakete
                </a>
                <a
                  href="/#contact"
                  className="inline-block bg-gray-100 text-gray-800 px-8 py-4 rounded-full font-semibold text-base md:text-lg hover:bg-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Pošalji poruku
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
