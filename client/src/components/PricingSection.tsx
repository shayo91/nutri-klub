import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { Check } from "lucide-react";

export default function PricingSection() {
  const { ref: pricingRef, inView: pricingInView } = useAnimateOnScroll(0.1);

  const plans = [
    {
      name: "Start",
      subtitle: "Jednokratne konsultacije za početak bez pritiska.",
      price: "90",
      currency: "KM",
      originalPrice: "120",
      savings: "Uštedi 30KM",
      description: "Individualna konsultacija osmišljena da ti pomogne da razumiješ svoje trenutno stanje, navike i izazove. Kroz razgovor, analizu i konkretne smjernice, dobijaš jasnu sliku šta trebaš mijenjati i kako da napraviš prve korake ka boljem balansu.",
      features: [
        "Detaljna anamneza i analiza dnevnika ishrane",
        "Savjeti za poboljšanje ishrane",
        "Razgovor u trajanju od 1h (video poziv)",
        "Uputstvo sa smjernicama nakon poziva",
        "Prijedlog dnevnog jelovnika za 3 dana"
      ],
      badge: null,
      buttonText: "Započni svoj put",
      cardStyle: "bg-white border border-[#E8E5DA] shadow-md",
      buttonStyle: "bg-[#9FE2BF] hover:bg-[#8FD6B2] text-[#174334]",
      priceColor: "text-[#1F7A5C]",
      textColor: "text-gray-700",
      subtitleColor: "text-gray-500",
      checkBg: "bg-[#9FE2BF]/25",
      checkColor: "text-[#2E8B57]",
      savingsBg: "bg-[#E6F7EE] text-[#2F8E63]",
      continuation: null
    },
    {
      name: "Balans",
      subtitle: "30 dana promjene uz jasnu strukturu i podršku",
      price: "190",
      currency: "KM",
      originalPrice: "230",
      savings: "Uštedi 40KM",
      description: "Kroz personalizovane jelovnike, jasne smjernice i podršku, učiš kako da organizuješ ishranu i gradiš održive navike koje ćeš primjenjivati i nakon završetka programa.",
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
      cardStyle: "bg-gradient-to-b from-white via-white to-[#E8F5EE] border border-[#C5E8D5] shadow-lg",
      buttonStyle: "bg-[#1F7A5C] hover:bg-[#19644A] text-white",
      priceColor: "text-[#1F7A5C]",
      textColor: "text-gray-700",
      subtitleColor: "text-gray-500",
      checkBg: "bg-[#9FE2BF]/30",
      checkColor: "text-[#2E8B57]",
      savingsBg: "bg-[#E6F7EE] text-[#2F8E63]",
      continuation: "Nastavak saradnje 150KM/mjesec."
    },
    {
      name: "Transformacija",
      subtitle: "90 dana resetovanja tijela i navika",
      price: "390",
      currency: "KM",
      originalPrice: "450",
      savings: "Uštedi 100KM",
      description: "Tromjesečni program koji te vodi kroz proces razumijevanja, promjene i održavanja balansa. Kroz redovne razgovore, planove i podršku, učiš da se oslanjaš na sebe i svoje tijelo.",
      features: [
        "3 mjeseca kontinuirane podrške",
        "6 individualnih jelovnika",
        "Smjernice i preporuke za ishranu",
        "Rad na odnosu s hranom",
        "Mjesečne kontrole i analiza napretka",
        "Podrška putem poruka tokom 90 dana"
      ],
      badge: "Najisplativiji",
      buttonText: "Vrijeme je za promjenu",
      cardStyle: "bg-[#FAF7F2] border border-[#E3D7C6] shadow-lg",
      buttonStyle: "bg-gradient-to-r from-[#D6B074] to-[#C19654] hover:from-[#C19654] hover:to-[#AD813F] text-white",
      priceColor: "text-[#1F7A5C]",
      textColor: "text-gray-700",
      subtitleColor: "text-gray-500",
      checkBg: "bg-[#9FE2BF]/25",
      checkColor: "text-[#2E8B57]",
      savingsBg: "bg-[#E6F7EE] text-[#2F8E63]",
      continuation: null
    }
  ];

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
          <p className="text-[#1F7A5C] font-medium tracking-wide uppercase mb-2" data-testid="text-pricing-subtitle">
            PAKETI
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6 text-gray-800" data-testid="text-pricing-title">
            Na koji način možemo raditi zajedno?
          </h2>
          <p className="text-gray-600 text-lg" data-testid="text-pricing-description">
            Bilo da želiš lagani početak ili potpunu transformaciju — izaberi plan koji ti trenutno najviše odgovara.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto items-start pt-8">
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
              whileHover={{ scale: 1.02 }}
              className={`rounded-[20px] overflow-visible relative flex flex-col transition-all duration-300 ${plan.cardStyle} ${
                planIndex === 1 ? "md:scale-105 z-10" : ""
              }`}
              data-testid={`card-pricing-${plan.name.toLowerCase()}`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <span 
                    className="bg-[#F5EEE2] text-[#8B6F47] text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm border border-[#E6D8C5] whitespace-nowrap"
                    data-testid={`badge-${plan.name.toLowerCase()}`}
                  >
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="p-8 flex-1 flex flex-col">
                <div className="mb-4">
                  <h3 
                    className="text-2xl font-bold mb-2 text-gray-800"
                    data-testid={`text-plan-name-${planIndex}`}
                  >
                    {plan.name}
                  </h3>
                  <p 
                    className={`text-sm ${plan.subtitleColor}`}
                    data-testid={`text-plan-subtitle-${planIndex}`}
                  >
                    {plan.subtitle}
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span 
                      className={`text-5xl font-bold ${plan.priceColor}`}
                      data-testid={`text-plan-price-${planIndex}`}
                    >
                      {plan.price}
                    </span>
                    <span className="text-xl text-gray-600">
                      {plan.currency}
                    </span>
                    <span 
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ml-2 ${plan.savingsBg}`}
                      data-testid={`badge-savings-${planIndex}`}
                    >
                      {plan.savings}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span 
                      className="text-base text-gray-400 line-through"
                      data-testid={`text-original-price-${planIndex}`}
                    >
                      {plan.originalPrice} {plan.currency}
                    </span>
                  </div>
                </div>

                <p 
                  className={`mb-6 leading-relaxed text-sm ${plan.textColor}`}
                  data-testid={`text-plan-description-${planIndex}`}
                >
                  {plan.description}
                </p>

                <div className="flex-1">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start" data-testid={`feature-${planIndex}-${index}`}>
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 ${plan.checkBg}`}>
                          <Check className={`w-4 h-4 ${plan.checkColor}`} />
                        </div>
                        <span className={`text-sm ${plan.textColor}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.continuation && (
                  <p 
                    className="text-sm font-medium text-[#1F7A5C] bg-[#E8F5EE] rounded-lg px-4 py-2.5 text-center mb-6 border border-[#C5E8D5]"
                    data-testid={`text-continuation-${planIndex}`}
                  >
                    {plan.continuation}
                  </p>
                )}

                <a
                  href="#contact"
                  className={`block w-full py-3.5 px-6 rounded-full font-semibold text-center transition-all duration-300 shadow-md hover:shadow-lg ${plan.buttonStyle}`}
                  data-testid={`button-schedule-${planIndex}`}
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
