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
      cardStyle: "bg-white border border-gray-100 shadow-md",
      buttonStyle: "bg-[#9FE2BF] hover:bg-[#8CD4AF] text-gray-800",
      featured: false
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
      cardStyle: "bg-gradient-to-br from-[#9FE2BF] to-[#6DC5A0] shadow-2xl",
      buttonStyle: "bg-[#2E8B57] hover:bg-[#267349] text-white",
      featured: true
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
      cardStyle: "bg-gradient-to-br from-[#F5F0E8] to-[#EAE0D5] border border-[#D4C4B0] shadow-lg",
      buttonStyle: "bg-gradient-to-r from-[#C9A96E] to-[#B8956A] hover:from-[#B8956A] hover:to-[#A68455] text-white",
      featured: false
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
          <p className="text-primary font-medium tracking-wide uppercase mb-2" data-testid="text-pricing-subtitle">
            PAKETI
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6" data-testid="text-pricing-title">
            Na koji način možemo raditi zajedno?
          </h2>
          <p className="text-gray-600 text-lg" data-testid="text-pricing-description">
            Bilo da želiš lagani početak ili potpunu transformaciju — izaberi plan koji ti trenutno najviše odgovara.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto items-center">
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
              whileHover={{ scale: 1.03 }}
              className={`rounded-[20px] overflow-hidden relative flex flex-col transition-all duration-300 ${plan.cardStyle} ${
                plan.featured ? "md:scale-105 z-10 md:-my-4" : ""
              }`}
              data-testid={`card-pricing-${plan.name.toLowerCase()}`}
            >
              {plan.badge && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
                  <span 
                    className="bg-[#F5EFE6] text-[#8B7355] text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm border border-[#E5DDD0]"
                    data-testid={`badge-${plan.name.toLowerCase()}`}
                  >
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className={`p-8 flex-1 flex flex-col ${plan.badge ? "pt-14" : ""}`}>
                <div className="mb-4">
                  <h3 
                    className={`text-2xl font-bold mb-2 ${plan.featured ? "text-white" : "text-gray-800"}`}
                    data-testid={`text-plan-name-${planIndex}`}
                  >
                    {plan.name}
                  </h3>
                  <p 
                    className={`text-sm ${plan.featured ? "text-white/80" : "text-gray-500"}`}
                    data-testid={`text-plan-subtitle-${planIndex}`}
                  >
                    {plan.subtitle}
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span 
                      className={`text-5xl font-bold ${plan.featured ? "text-white" : "text-gray-800"}`}
                      data-testid={`text-plan-price-${planIndex}`}
                    >
                      {plan.price}
                    </span>
                    <span className={`text-xl ${plan.featured ? "text-white/80" : "text-gray-600"}`}>
                      {plan.currency}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span 
                      className={`text-base line-through ${plan.featured ? "text-white/60" : "text-gray-400"}`}
                      data-testid={`text-original-price-${planIndex}`}
                    >
                      {plan.originalPrice} {plan.currency}
                    </span>
                    <span 
                      className={`text-sm font-semibold px-3 py-1 rounded-full ${
                        plan.featured 
                          ? "bg-white/20 text-white" 
                          : "bg-green-50 text-green-600"
                      }`}
                      data-testid={`badge-savings-${planIndex}`}
                    >
                      {plan.savings}
                    </span>
                  </div>
                </div>

                <p 
                  className={`mb-6 leading-relaxed text-sm ${plan.featured ? "text-white/90" : "text-gray-600"}`}
                  data-testid={`text-plan-description-${planIndex}`}
                >
                  {plan.description}
                </p>

                <div className="flex-1">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start" data-testid={`feature-${planIndex}-${index}`}>
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
                          plan.featured ? "bg-white/20" : "bg-[#9FE2BF]/20"
                        }`}>
                          <Check className={`w-3 h-3 ${plan.featured ? "text-white" : "text-[#2E8B57]"}`} />
                        </div>
                        <span className={`text-sm ${plan.featured ? "text-white/90" : "text-gray-700"}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="#contact"
                  className={`block w-full py-4 px-6 rounded-full font-bold text-center transition-all duration-300 shadow-md hover:shadow-lg ${plan.buttonStyle}`}
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
