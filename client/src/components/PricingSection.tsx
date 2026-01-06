import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { Check } from "lucide-react";

export default function PricingSection() {
  const { ref: pricingRef, inView: pricingInView } = useAnimateOnScroll(0.1);

  const plans = [
    {
      name: "Konsultacije",
      price: "60",
      currency: "KM",
      description: "Individualna konsultacija osmišljena da ti pomogne da razumiješ svoje trenutno stanje, navike i izazove. Kroz razgovor, analizu i konkretne smjernice, dobijaš jasnu sliku šta trebaš mijenjati i kako da napraviš prve korake ka boljem balansu.",
      features: [
        "Detaljna anamneza i analiza dnevnika ishrane",
        "Savjeti za poboljšanje ishrane",
        "Razgovor u trajanju od 1h (video poziv)",
        "Uputstvo sa smjernicama nakon poziva",
        "Prijedlog dnevnog jelovnika"
      ],
      popular: false,
      originalPrice: null,
      savings: null,
      continuation: null
    },
    {
      name: "Balans",
      subtitle: "30 dana promjene uz jasnu strukturu i podršku",
      price: "190",
      currency: "KM",
      description: "Kroz personalizovane jelovnike, jasne smjernice i podršku, učiš kako da organizuješ ishranu i gradiš održive navike koje ćeš primjenjivati i nakon završetka programa.",
      features: [
        "Uvodne konsultacije (video poziv)",
        "Detaljna anamneza i analiza dnevnika ishrane",
        "Savjeti i personalizovane preporuke za ishranu",
        "2 individualna sedmična jelovnika",
        "Lista namirnica za kupovinu",
        "Podrška putem poruka tokom 30 dana"
      ],
      popular: true,
      originalPrice: "230",
      savings: "Uštedi 40KM",
      continuation: "Nastavak saradnje 150KM/mjesečno"
    },
    {
      name: "Transformacija",
      subtitle: "90 dana resetovanja tijela i navika",
      price: "390",
      currency: "KM",
      description: "Tromjesečni program koji te vodi kroz proces razumijevanja, promjene i održavanja balansa. Kroz redovne razgovore, planove i podršku, učiš da se oslanjaš na sebe i svoje tijelo.",
      features: [
        "3 mjeseca kontinuirane podrške",
        "6 individualnih jelovnika",
        "Smjernice i preporuke za ishranu",
        "Rad na odnosu s hranom",
        "Mjesečne kontrole i analiza napretka",
        "Podrška putem poruka tokom 90 dana"
      ],
      popular: false,
      originalPrice: "450",
      savings: "Uštedi 100KM",
      continuation: null
    }
  ];

  return (
    <section id="pricing" className="py-16 md:py-24 bg-gray-50">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
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
              className={`bg-white rounded-3xl overflow-hidden relative flex flex-col ${
                plan.popular
                  ? "border-2 border-primary shadow-2xl md:scale-105 z-10"
                  : "border border-gray-200 shadow-lg"
              }`}
              data-testid={`card-pricing-${plan.name.toLowerCase()}`}
            >
              {plan.popular && (
                <div className="bg-primary text-white text-sm font-bold py-2 text-center" data-testid="badge-popular">
                  NAJPOPULARNIJI
                </div>
              )}

              <div className="p-8 flex-1 flex flex-col">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-1" data-testid={`text-plan-name-${planIndex}`}>{plan.name}</h3>
                  {plan.subtitle && (
                    <p className="text-sm text-gray-500" data-testid={`text-plan-subtitle-${planIndex}`}>{plan.subtitle}</p>
                  )}
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-primary" data-testid={`text-plan-price-${planIndex}`}>{plan.price}</span>
                    <span className="text-xl text-gray-600">{plan.currency}</span>
                  </div>
                  {plan.originalPrice && (
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-lg text-gray-400 line-through" data-testid={`text-original-price-${planIndex}`}>{plan.originalPrice} {plan.currency}</span>
                      <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full" data-testid={`badge-savings-${planIndex}`}>
                        {plan.savings}
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-gray-600 mb-8 leading-relaxed" data-testid={`text-plan-description-${planIndex}`}>
                  {plan.description}
                </p>

                <div className="flex-1">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start" data-testid={`feature-${planIndex}-${index}`}>
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                          <Check className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.continuation && (
                  <p className="text-sm text-gray-500 text-center mb-6 font-medium bg-gray-50 py-2 px-4 rounded-lg" data-testid={`text-continuation-${planIndex}`}>
                    {plan.continuation}
                  </p>
                )}

                <a
                  href="#contact"
                  className={`block w-full py-4 px-6 rounded-full font-bold text-lg text-center transition-all transform hover:scale-105 shadow-md ${
                    plan.popular
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'bg-primary/10 text-primary hover:bg-primary/20'
                  }`}
                  data-testid={`button-schedule-${planIndex}`}
                >
                  ZAKAŽI TERMIN
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
