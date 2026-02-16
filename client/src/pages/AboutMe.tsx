import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { Helmet } from "react-helmet";
import aboutImage1 from "@assets/image_1767988070262.png";
import aboutImage2 from "@assets/image_1767988208117.png";

export default function AboutMe() {
  const { ref, inView } = useAnimateOnScroll(0.1);
  const { ref: ref2, inView: inView2 } = useAnimateOnScroll(0.1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>O meni - Nutricionista Jelena Matijaš | Personalizovana ishrana</title>
        <meta name="description" content="Upoznajte Jelenu Matijaš, magistricu nutricionizma sa bogatim iskustvom u personalizovanoj ishrani. Specijalizirana za bezglutensku ishranu i autoimune izazove." />
        <meta property="og:title" content="O meni - Nutricionista Jelena Matijaš" />
        <meta property="og:description" content="Magistrica nutricionizma posvećena zdravoj i praktičnoj ishrani. Specijalizirana za bezglutenske recepte i autoimune izazove." />
        <meta property="og:image" content="https://nutriputovanje.com/attached_assets/jelena-hero.png" />
        <meta property="og:locale" content="bs_BA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="O meni - Nutricionista Jelena Matijaš" />
        <meta name="twitter:description" content="Magistrica nutricionizma posvećena zdravoj i praktičnoj ishrani. Specijalizirana za bezglutenske recepte i autoimune izazove." />
        <meta name="twitter:image" content="https://nutriputovanje.com/attached_assets/jelena-hero.png" />
        <link rel="canonical" href="https://nutriputovanje.com/about" />
      </Helmet>
      
      <main className="min-h-screen bg-white font-sans">
        {/* First Section - Mint background - Image smaller, text wider */}
        <section className="py-16 md:py-24" style={{ backgroundColor: "#9FE2BF" }} aria-label="Upoznajte Jelenu">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8 lg:gap-12 items-center" ref={ref}>
              {/* Text Content - Left on desktop, wider column */}
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
                  Kao magistrica nutricionizma (master studije nutricionizma na Tehnološlom fakultetu, Univerziteta u Tuzli) te dipl.ing.prehrambene tehnologije (osnovne studije na Tehnološkom fakultetu Univerziteta u Banjoj Luci, Biotehnološko – prehrambeni smjer) već više od 5 godina primjenjujem znanje u praksi kroz individualni nutricionistički pristup.
                </p>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  Pomažem ljudima koji žele da unaprijede ishranu kroz praktične, zdrave i ukusne recepte. Želim da te inspirišem i pokažem da pravilna ishrana ne mora biti teška, komplikovana niti isključiva. U radu sa mnom naučićeš da ishrana nije samo pitanje šta jedemo, već i kako, kada i zašto jedemo, kao i kako kombinacija namirnica utiče na energiju i cjelokupno zdravlje.
                </p>
              </motion.div>

              {/* Image - Right on desktop, smaller */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="order-1 lg:order-2 flex justify-center lg:justify-end"
              >
                <div className="relative group">
                  <div className="absolute -inset-3 bg-white/50 rounded-3xl transform rotate-3 group-hover:rotate-2 transition-transform duration-300"></div>
                  <img
                    src={aboutImage1}
                    alt="Jelena Matijaš - Nutricionista i magistrica nutricionizma"
                    className="relative w-full max-w-[280px] md:max-w-[320px] h-auto rounded-2xl shadow-xl group-hover:shadow-2xl group-hover:scale-[1.02] transition-all duration-300"
                    width={320}
                    height={400}
                    loading="eager"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Second Section - Light mint background - Image LEFT, Text RIGHT */}
        <section className="py-12 md:py-16" style={{ backgroundColor: "#ECF8F2" }} aria-label="Moj profesionalni put">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center" ref={ref2}>
              {/* Image - Left */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={inView2 ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{ duration: 0.6 }}
                className="order-1 lg:order-1 flex justify-center lg:justify-start"
              >
                <div className="relative group">
                  <div className="absolute -inset-3 bg-[#9FE2BF]/40 rounded-3xl transform -rotate-2 group-hover:-rotate-1 transition-transform duration-300"></div>
                  <img
                    src={aboutImage2}
                    alt="Jelena Matijaš sa laptopom - Online nutricionističke konsultacije"
                    className="relative w-full max-w-xs sm:max-w-sm h-auto rounded-2xl shadow-xl group-hover:shadow-2xl group-hover:scale-[1.02] transition-all duration-300"
                    width={384}
                    height={480}
                    loading="lazy"
                  />
                </div>
              </motion.div>

              {/* Text Content - Right */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={inView2 ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="order-2 lg:order-2"
              >
                <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-5">
                  Veliki dio mog profesionalnog puta oblikovalo je lično iskustvo sa autoimunim i probavnim izazovima. To me je naučilo koliko su hrana, okolina, naše navike i ritam života snažno povezani sa zdravljem, hormonima i probavom.
                </p>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  Volim da putujem, istražujem nova mjesta i nove kuhinje, skupljam ideje i pretvaram ih u recepte koje dijelim s tobom. I sama sam na bezglutenskoj ishrani, pa ćeš ovdje pronaći mnoštvo bezglutenskih recepata.
                </p>
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
