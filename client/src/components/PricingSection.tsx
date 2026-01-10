import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { Check, Clock, BookOpen, Dumbbell, Utensils, Sparkles } from "lucide-react";

export default function PricingSection() {
  const { ref: pricingRef, inView: pricingInView } = useAnimateOnScroll(0.1);

  const plans = [
    {
      name: "Start",
      subtitle: "Jednokratne konsultacije za početak bez pritiska",
      price: "90",
      currency: "KM",
      originalPrice: "120",
      savings: "Uštedi 30KM",
      description: "Individualna konsultacija osmišljena da ti pomogne da razumiješ svoje trenutno stanje, navike i izazove. Kroz razgovor, analizu i konkretne smjernice, dobijaš jasnu sliku šta trebaš mijenjati i kako da napraviš prve korake ka boljem balansu.",
      idealFor: "Za tebe ako želiš stručno mišljenje bez dugoročne obaveze",
      features: [
        "Detaljna anamneza i analiza dnevnika ishrane",
        "Savjeti za poboljšanje ishrane",
        "Razgovor u trajanju od 1h (video poziv)",
        "Uputstvo sa smjernicama nakon poziva",
        "Prijedlog dnevnog jelovnika za 3 dana"
      ],
      badge: null,
      buttonText: "Započni svoj put",
      accentColor: "#F3E6D3",
      buttonStyle: "bg-[#1F7A5C] hover:bg-[#185F48] text-white",
      featured: false,
      continuation: null,
      comingSoon: false
    },
    {
      name: "Balans",
      subtitle: "30 dana promjene uz jasnu strukturu i podršku",
      price: "190",
      currency: "KM",
      originalPrice: "230",
      savings: "Uštedi 40KM",
      description: "Kroz personalizovane jelovnike, jasne smjernice i podršku, učiš kako da organizuješ ishranu i gradiš održive navike koje ćeš primjenjivati i nakon završetka programa.",
      idealFor: "Za tebe ako si spreman/a za strukturiran pristup i želiš konkretne rezultate",
      features: [
        "Uvodne konsultacije (video poziv)",
        "Detaljna anamneza i analiza dnevnika ishrane",
        "Savjeti i personalizovane preporuke za ishranu",
        "2 individualna sedmična jelovnika",
        "Lista namirnica za kupovinu",
        "Podrška putem poruka tokom 30 dana"
      ],
      badge: "Najpopularniji",
      buttonText: "Biraj Balans",
      accentColor: "#9FE2BF",
      buttonStyle: "bg-[#1F7A5C] hover:bg-[#185F48] text-white",
      featured: true,
      continuation: "Nastavak saradnje 150KM/mjesec.",
      comingSoon: false
    },
    {
      name: "Transformacija",
      subtitle: "90 dana resetovanja tijela i navika",
      price: "390",
      currency: "KM",
      originalPrice: "450",
      savings: "Uštedi 100KM",
      description: "Tromjesečni program koji te vodi kroz proces razumijevanja, promjene i održavanja balansa. Kroz redovne razgovore, planove i podršku, učiš da se oslanjaš na sebe i svoje tijelo.",
      idealFor: "Za tebe ako želiš duboku promjenu i dugoročne rezultate",
      features: [
        "3 mjeseca kontinuirane podrške",
        "6 individualnih jelovnika",
        "Smjernice i preporuke za ishranu",
        "Rad na odnosu s hranom",
        "Mjesečne kontrole i analiza napretka",
        "Podrška putem poruka tokom 90 dana"
      ],
      badge: null,
      buttonText: "Vrijeme je za promjenu",
      accentColor: "#F3E6D3",
      buttonStyle: "bg-[#D8B26E] hover:bg-[#C9A35F] text-white",
      featured: false,
      continuation: null,
      comingSoon: false
    },
    {
      name: "Basic Plan",
      subtitle: "Jednokratna polugodišnja pretplata",
      price: "Uskoro",
      currency: "",
      originalPrice: null,
      savings: null,
      description: "Pristup ekskluzivnoj platformi sa svim resursima koji su ti potrebni za zdraviji život. Zdrave recepte, vježbe, e-bookove i mnogo više - sve na jednom mjestu.",
      idealFor: "Za tebe ako želiš samostalno istraživati i učiti u svom tempu",
      features: [
        "Pristup platformi 6 mjeseci",
        "500+ zdravih recepata",
        "Video vježbe i workout planovi",
        "E-bookovi o ishrani i zdravlju",
        "Novi sadržaj svake sedmice",
        "Pristup zajednici članova"
      ],
      badge: "Uskoro",
      buttonText: "Obavijesti me",
      accentColor: "#ECF8F2",
      buttonStyle: "bg-gray-400 text-white cursor-not-allowed",
      featured: false,
      continuation: null,
      comingSoon: true
    }
  ];

  const getFeatureIcon = (index: number) => {
    const icons = [Utensils, BookOpen, Dumbbell, Sparkles];
    const Icon = icons[index % icons.length];
    return <Icon className="w-5 h-5" />;
  };

  return (
    <section id="pricing" className="py-16 md:py-24 bg-white" aria-label="Paketi usluga nutricioniste">
      <div className="container mx-auto px-4">
        <motion.div
          ref={pricingRef}
          initial={{ opacity: 0, y: 30 }}
          animate={pricingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
        >
          <p className="text-[#1F7A5C] font-medium tracking-wide uppercase mb-2">
            MOJI PROGRAMI
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1F2937]">
            Na koji način možemo raditi zajedno?
          </h2>
          <p className="text-[#6B7280] text-lg">
            Bilo da želiš lagani početak ili potpunu transformaciju — izaberi plan koji ti trenutno najviše odgovara.
          </p>
        </motion.div>

        {/* Horizontal Cards Layout */}
        <div className="space-y-6 max-w-5xl mx-auto">
          {plans.map((plan, planIndex) => (
            <motion.article
              key={planIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={pricingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: planIndex * 0.1 }}
              className={`rounded-2xl overflow-hidden relative transition-all duration-300 hover:shadow-xl ${
                plan.comingSoon 
                  ? "border-2 border-dashed border-[#9FE2BF] bg-[#ECF8F2]/30" 
                  : "bg-white border border-[#E5E7EB] shadow-lg"
              } ${plan.featured ? "ring-2 ring-[#1F7A5C]" : ""}`}
              aria-labelledby={`plan-${plan.name.toLowerCase().replace(' ', '-')}`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute top-4 right-4 z-10">
                  <span 
                    className={`text-xs font-semibold px-4 py-1.5 rounded-full ${
                      plan.comingSoon 
                        ? "bg-[#9FE2BF] text-[#1F7A5C]" 
                        : "bg-[#F3E6D3] text-[#8B6F47]"
                    }`}
                  >
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="flex flex-col lg:flex-row">
                {/* Left Side - Accent Color Strip + Title */}
                <div 
                  className="lg:w-1/3 p-6 lg:p-8 flex flex-col justify-center"
                  style={{ backgroundColor: plan.accentColor }}
                >
                  <h3 
                    id={`plan-${plan.name.toLowerCase().replace(' ', '-')}`}
                    className="text-2xl lg:text-3xl font-bold text-[#1F2937] mb-2"
                  >
                    {plan.name}
                  </h3>
                  <p className="text-sm lg:text-base text-[#6B7280] mb-4">
                    {plan.subtitle}
                  </p>
                  
                  {/* Price */}
                  <div className="mb-4">
                    {plan.comingSoon ? (
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[#1F7A5C]" />
                        <span className="text-2xl font-bold text-[#1F7A5C]">Uskoro</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl lg:text-5xl font-bold text-[#1F7A5C]">
                            {plan.price}
                          </span>
                          <span className="text-lg text-[#6B7280]">{plan.currency}</span>
                        </div>
                        {plan.originalPrice && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-[#9CA3AF] line-through">
                              {plan.originalPrice} {plan.currency}
                            </span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#166534]">
                              {plan.savings}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Ideal For */}
                  <p className="text-xs lg:text-sm text-[#4B5563] italic">
                    {plan.idealFor}
                  </p>
                </div>

                {/* Right Side - Description + Features + CTA */}
                <div className="lg:w-2/3 p-6 lg:p-8 bg-white flex flex-col">
                  <p className="text-[#6B7280] mb-6 leading-relaxed">
                    {plan.description}
                  </p>

                  {/* Features Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 flex-grow">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#ECF8F2] flex items-center justify-center mt-0.5">
                          <Check className="w-3 h-3 text-[#1F7A5C]" />
                        </div>
                        <span className="text-sm text-[#1F2937]">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {plan.comingSoon ? (
                      <button
                        disabled
                        className={`px-8 py-3 rounded-full font-semibold text-center transition-all duration-300 ${plan.buttonStyle}`}
                        aria-disabled="true"
                      >
                        {plan.buttonText}
                      </button>
                    ) : (
                      <a
                        href="#contact"
                        className={`px-8 py-3 rounded-full font-semibold text-center transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 ${plan.buttonStyle}`}
                      >
                        {plan.buttonText}
                      </a>
                    )}
                    {plan.continuation && (
                      <span className="text-sm text-[#6B7280]">{plan.continuation}</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
