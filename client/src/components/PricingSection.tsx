import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { Check } from "lucide-react";

export default function PricingSection() {
  const { ref: pricingRef, inView: pricingInView } = useAnimateOnScroll(0.1);

  const plans = [
    {
      name: "Konsultacije",
      subtitle: "Za one koji žele početne smjernice",
      price: "80",
      currency: "KM",
      originalPrice: "120",
      features: [
        "Online konsultacije (60 minuta)",
        "Analiza dnevnika ishrane",
        "Pisane smjernice za poboljšanje ishrane",
        "Podrška putem poruka tokom 30 dana"
      ],
      badge: null,
      buttonText: "Prijavi se",
      featured: false
    },
    {
      name: "Mjesečni",
      nameSecondLine: "mentorski program",
      subtitle: "Za one koji žele promjenu i jasnu strukturu",
      price: "200",
      currency: "KM",
      originalPrice: "250",
      features: [
        "Online uvodne konsultacije (upoznavanje, anamneza i postavljanje ciljeva)",
        "Analiza dnevnika ishrane i prijedlozi za izmjene",
        "Pisane smjernice za poboljšanje ishrane",
        "Dva individualna sedmična jelovnika",
        "Podrška putem poruka tokom 30 dana",
        "Kontrolni poziv nakon mjesec dana"
      ],
      badge: "Najpopularnije",
      buttonText: "Prijavi se",
      featured: true
    },
    {
      name: "Višemjesečni",
      nameSecondLine: "mentorski program",
      subtitle: "Za one koji žele dugoročnu podršku i trajne rezultate",
      price: "400",
      currency: "KM",
      originalPrice: "500",
      features: [
        "3 mjeseca saradnje",
        "Uvodne konsultacije, analiza dnevnika ishrane, pisane smjernice",
        "Šest individualnih sedmičnih jelovnika",
        "Podrška putem poruka tokom 90 dana",
        "Kontrolni poziv (x3)"
      ],
      badge: null,
      buttonText: "Prijavi se",
      featured: false
    }
  ];

  return (
    <section id="pricing" aria-label="Paketi i cijene" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          ref={pricingRef}
          initial={{ opacity: 0, y: 30 }}
          animate={pricingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#333333]">
            Na koji način možemo raditi zajedno?
          </h2>
          <p className="text-[#333333] text-lg">
            Bilo da želiš lagani početak ili potpunu transformaciju — izaberi paket koji ti trenutno najviše odgovara.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((plan, planIndex) => (
            <motion.div
              key={planIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={
                pricingInView
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 30 }
              }
              transition={{ duration: 0.6, delay: planIndex * 0.15 }}
              whileHover={{ 
                y: -8,
                boxShadow: "0 20px 40px -12px rgba(0,0,0,0.15)"
              }}
              className={`rounded-2xl overflow-visible relative flex flex-col transition-all duration-300 ${
                plan.featured 
                  ? "bg-[#5DAD8C] text-white md:scale-105 z-10 shadow-xl" 
                  : "bg-white border border-[#E5E7EB] shadow-lg"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <span className="bg-white text-[#5DAD8C] text-sm font-bold px-5 py-2 rounded-full shadow-md whitespace-nowrap">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="px-6 md:px-8 pt-10 pb-8 flex-1 flex flex-col">
                {/* Header */}
                <div className="text-center mb-6">
                  <h3 className={`text-xl md:text-2xl font-bold ${plan.nameSecondLine ? "mb-0" : "mb-2"} ${
                    plan.featured ? "text-white" : "text-[#333333]"
                  }`}>
                    {plan.name}
                  </h3>
                  {plan.nameSecondLine && (
                    <p className={`text-xl md:text-2xl font-bold mb-2 ${
                      plan.featured ? "text-white" : "text-[#333333]"
                    }`}>
                      {plan.nameSecondLine}
                    </p>
                  )}
                  <p className={`text-sm ${
                    plan.featured ? "text-white/90" : "text-[#666666]"
                  }`}>
                    {plan.subtitle}
                  </p>
                </div>

                {/* Price */}
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className={`text-4xl md:text-5xl font-bold ${
                      plan.featured ? "text-white" : "text-[#5DAD8C]"
                    }`}>
                      {plan.price}
                    </span>
                    <span className={`text-lg ${
                      plan.featured ? "text-white/90" : "text-[#666666]"
                    }`}>
                      {plan.currency}
                    </span>
                  </div>
                  <span className={`text-base line-through ${
                    plan.featured ? "text-white/70" : "text-[#999999]"
                  }`}>
                    {plan.originalPrice} {plan.currency}
                  </span>
                </div>

                {/* Features */}
                <div className="flex-1">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
                          plan.featured ? "bg-white/20" : "bg-[#5DAD8C]/10"
                        }`}>
                          <Check className={`w-3 h-3 ${
                            plan.featured ? "text-white" : "text-[#5DAD8C]"
                          }`} />
                        </div>
                        <span className={`text-sm leading-relaxed ${
                          plan.featured ? "text-white/95" : "text-[#333333]"
                        }`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Button */}
                <a
                  href="#contact"
                  className={`block w-full py-4 px-6 rounded-full font-semibold text-center transition-all duration-300 ${
                    plan.featured 
                      ? "bg-white text-[#5DAD8C] hover:bg-gray-100 shadow-md hover:shadow-lg" 
                      : "bg-[#5DAD8C] text-white hover:bg-[#4A9A79] shadow-md hover:shadow-lg"
                  }`}
                >
                  {plan.buttonText}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
