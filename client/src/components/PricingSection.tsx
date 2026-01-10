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
      headerBg: "bg-[#F3E6D3]",
      buttonStyle: "bg-[#1F7A5C] hover:bg-[#185F48] text-white",
      featured: false,
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
      headerBg: "bg-[#ECF8F2]",
      buttonStyle: "bg-[#1F7A5C] hover:bg-[#185F48] text-white",
      featured: true,
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
      badge: null,
      buttonText: "Vrijeme je za promjenu",
      headerBg: "bg-[#F3E6D3]",
      buttonStyle: "bg-[#D8B26E] hover:bg-[#C9A35F] text-white",
      featured: false,
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
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1F2937]" data-testid="text-pricing-title">
            Na koji način možemo raditi zajedno?
          </h2>
          <p className="text-[#6B7280] text-lg" data-testid="text-pricing-description">
            Bilo da želiš lagani početak ili potpunu transformaciju — izaberi plan koji ti trenutno najviše odgovara.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 max-w-7xl mx-auto items-end pt-8">
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
              className={`rounded-[20px] overflow-visible relative flex flex-col transition-all duration-300 bg-white border border-[#E5E7EB] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] ${
                plan.featured ? "md:scale-105 z-10" : ""
              }`}
              data-testid={`card-pricing-${plan.name.toLowerCase()}`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <span 
                    className="bg-[#F3E6D3] text-[#8B6F47] text-xs font-semibold px-5 py-2 rounded-full shadow-sm border border-[#E6D8C5] whitespace-nowrap"
                    data-testid={`badge-${plan.name.toLowerCase()}`}
                  >
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Header Zone */}
              <div className={`${plan.headerBg} rounded-t-[20px] px-8 py-6 text-center border-b border-[#E5E7EB]/50`}>
                <h3 
                  className="text-2xl font-bold text-[#1F2937] mb-2"
                  data-testid={`text-plan-name-${planIndex}`}
                >
                  {plan.name}
                </h3>
                <p 
                  className="text-sm text-[#6B7280]"
                  data-testid={`text-plan-subtitle-${planIndex}`}
                >
                  {plan.subtitle}
                </p>
              </div>

              {/* Body Zone */}
              <div className="bg-white rounded-b-[20px] px-8 py-8 flex-1 flex flex-col">
                {/* Price */}
                <div className="mb-6 text-center">
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span 
                      className="text-5xl font-bold text-[#1F7A5C]"
                      data-testid={`text-plan-price-${planIndex}`}
                    >
                      {plan.price}
                    </span>
                    <span className="text-xl text-[#6B7280]">
                      {plan.currency}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <span 
                      className="text-base text-[#9CA3AF] line-through"
                      data-testid={`text-original-price-${planIndex}`}
                    >
                      {plan.originalPrice} {plan.currency}
                    </span>
                    <span 
                      className="text-xs font-semibold px-3 py-1 rounded-full bg-[#DCFCE7] text-[#166534]"
                      data-testid={`badge-savings-${planIndex}`}
                    >
                      {plan.savings}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p 
                  className="mb-6 leading-relaxed text-sm text-[#6B7280] text-center"
                  data-testid={`text-plan-description-${planIndex}`}
                >
                  {plan.description}
                </p>

                {/* Features */}
                <div className="flex-1">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start" data-testid={`feature-${planIndex}-${index}`}>
                        <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 bg-[#ECF8F2]">
                          <Check className="w-4 h-4 text-[#1F7A5C]" />
                        </div>
                        <span className="text-sm text-[#1F2937]">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Button */}
                <a
                  href="#contact"
                  className={`block w-full py-4 px-6 rounded-full font-semibold text-center transition-all duration-300 shadow-md hover:shadow-lg ${plan.buttonStyle}`}
                  data-testid={`button-schedule-${planIndex}`}
                >
                  {plan.buttonText}
                </a>

                {/* Continuation text below button - fixed height container for alignment */}
                <div className="h-8 mt-4 flex items-center justify-center">
                  {plan.continuation ? (
                    <p 
                      className="text-sm text-[#6B7280] text-center"
                      data-testid={`text-continuation-${planIndex}`}
                    >
                      {plan.continuation}
                    </p>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
