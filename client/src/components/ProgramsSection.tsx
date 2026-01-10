import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { Helmet } from "react-helmet";
import { Check, Clock, Sparkles, TrendingUp, Users } from "lucide-react";

interface ProgramCard {
  name: string;
  tagline: string;
  description: string;
  features: string[];
  icon: ReactNode;
  bgColor: string;
  borderColor: string;
  iconBg: string;
  isComingSoon?: boolean;
  price?: string;
}

export default function ProgramsSection() {
  const { ref, inView } = useAnimateOnScroll(0.1);

  const programs: ProgramCard[] = [
    {
      name: "START",
      tagline: "Jednokratne konsultacije za početak bez pritiska",
      description: "Individualna konsultacija osmišljena da ti pomogne da razumiješ svoje trenutno stanje, navike i izazove. Kroz razgovor, analizu i konkretne smjernice, dobijaš jasnu sliku šta trebaš mijenjati i kako da napraviš prve korake ka boljem balansu.",
      features: [
        "Detaljna anamneza i analiza dnevnika ishrane",
        "Savjeti za poboljšanje ishrane",
        "Razgovor u trajanju od 1h (video poziv)",
        "Uputstvo sa smjernicama nakon poziva",
        "Prijedlog dnevnog jelovnika za 3 dana"
      ],
      icon: <Sparkles className="w-6 h-6" />,
      bgColor: "bg-[#F3E6D3]",
      borderColor: "border-[#E6D8C5]",
      iconBg: "bg-[#D8B26E]",
      price: "90 KM"
    },
    {
      name: "BALANS",
      tagline: "30 dana promjene uz jasnu strukturu i podršku",
      description: "Kroz personalizovane jelovnike, jasne smjernice i podršku, učiš kako da organizuješ ishranu i gradiš održive navike koje ćeš primjenjivati i nakon završetka programa.",
      features: [
        "Uvodne konsultacije (video poziv)",
        "Detaljna anamneza i analiza dnevnika ishrane",
        "2 individualna sedmična jelovnika",
        "Lista namirnica za kupovinu",
        "Podrška putem poruka tokom 30 dana"
      ],
      icon: <TrendingUp className="w-6 h-6" />,
      bgColor: "bg-[#ECF8F2]",
      borderColor: "border-[#9FE2BF]",
      iconBg: "bg-[#1F7A5C]",
      price: "190 KM"
    },
    {
      name: "TRANSFORMACIJA",
      tagline: "90 dana resetovanja tijela i navika",
      description: "Tromjesečni program koji te vodi kroz proces razumijevanja, promjene i održavanja balansa. Kroz redovne razgovore, planove i podršku, učiš da se oslanjaš na sebe i svoje tijelo.",
      features: [
        "3 mjeseca kontinuirane podrške",
        "6 individualnih jelovnika",
        "Smjernice i preporuke za ishranu",
        "Rad na odnosu s hranom",
        "Mjesečne kontrole i analiza napretka"
      ],
      icon: <Users className="w-6 h-6" />,
      bgColor: "bg-[#F3E6D3]",
      borderColor: "border-[#E6D8C5]",
      iconBg: "bg-[#D8B26E]",
      price: "390 KM"
    },
    {
      name: "BASIC PLAN",
      tagline: "Uskoro dostupno",
      description: "Jednokratna polugodišnja pretplata koja ti daje pristup ekskluzivnoj online platformi. Pronađi inspiraciju za zdravu ishranu bez stresa i komplikacija.",
      features: [
        "100+ zdravih i ukusnih recepata",
        "Video vježbe za svaki dan",
        "E-bookovi o zdravoj ishrani",
        "Savjeti za organizaciju kuhinje",
        "I mnogo više..."
      ],
      icon: <Clock className="w-6 h-6" />,
      bgColor: "bg-gray-50",
      borderColor: "border-dashed border-[#9FE2BF]",
      iconBg: "bg-[#9FE2BF]",
      isComingSoon: true
    }
  ];

  return (
    <>
      <Helmet>
        <meta name="description" content="Programi nutricioniste Jelene Matijaš - START, BALANS i TRANSFORMACIJA. Personalizovani planovi ishrane prilagođeni vašim potrebama." />
      </Helmet>
      
      <section id="programs" className="py-16 md:py-24 bg-white" aria-label="Programi ishrane">
        <div className="container mx-auto px-4" ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <p className="text-[#1F7A5C] font-medium tracking-wide uppercase mb-2">
              MOJI PROGRAMI
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Nisi siguran/na odakle da kreneš?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Pronađi program koji najbolje odgovara tvom trenutnom stanju i ciljevima.
            </p>
          </motion.div>

          {/* Horizontal Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {programs.map((program, index) => (
              <motion.div
                key={program.name}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-2xl border-2 ${program.borderColor} ${program.bgColor} p-6 md:p-8 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]`}
              >
                {/* Coming Soon Badge */}
                {program.isComingSoon && (
                  <div className="absolute -top-3 right-6">
                    <span className="bg-[#1F7A5C] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
                      USKORO
                    </span>
                  </div>
                )}

                {/* Header Row */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`${program.iconBg} p-3 rounded-xl text-white flex-shrink-0`}>
                    {program.icon}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                        {program.name}
                      </h3>
                      {program.price && !program.isComingSoon && (
                        <span className="text-lg font-bold text-[#1F7A5C]">
                          {program.price}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {program.tagline}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 leading-relaxed mb-5 text-sm md:text-base">
                  {program.description}
                </p>

                {/* Features List */}
                <ul className="space-y-2 mb-6">
                  {program.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white/80 flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-[#1F7A5C]" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                {!program.isComingSoon ? (
                  <a
                    href="#contact"
                    className="inline-block w-full text-center bg-[#1F7A5C] text-white py-3 px-6 rounded-full font-semibold hover:bg-[#185F48] hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    Saznaj više
                  </a>
                ) : (
                  <button
                    disabled
                    className="w-full text-center bg-gray-300 text-gray-500 py-3 px-6 rounded-full font-semibold cursor-not-allowed"
                  >
                    Uskoro dostupno
                  </button>
                )}
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-12"
          >
            <p className="text-gray-600 mb-4">
              Imaš pitanja? Kontaktiraj me i zajedno ćemo pronaći pravi program za tebe.
            </p>
            <a
              href="#contact"
              className="inline-block bg-[#D8B26E] text-white px-8 py-3 rounded-full font-bold hover:bg-[#C9A35F] transition-all duration-300 hover:scale-105 shadow-md"
            >
              ZAKAŽI BESPLATNU KONSULTACIJU
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
