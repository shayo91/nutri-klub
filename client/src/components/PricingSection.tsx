import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { useLanguage } from "@/hooks/useLanguage";

export default function PricingSection() {
  const { t } = useLanguage();
  const { ref: pricingRef, inView: pricingInView } = useAnimateOnScroll(0.2);

  const plans = [
    {
      name: "Starter",
      price: "50€",
      period: "mesečno",
      originalPrice: "70€",
      features: [
        "Personalizovani plan ishrane za 4 nedelje",
        "Lista za kupovinu",
        "20+ zdravih recepata",
        "Email podrška",
        "Jedan poziv za konsultaciju"
      ],
      results: "Izgubite 3-5kg za mesec dana",
      popular: false,
      savings: "Uštedite 20€"
    },
    {
      name: "Transformation",
      price: "100€",
      period: "mesečno",
      originalPrice: "130€",
      features: [
        "Sve iz Starter paketa",
        "Bi-nedeljne video konsultacije (45min)",
        "24/7 WhatsApp podrška",
        "Personalizovani trening plan",
        "Nedeljno praćenje napretka",
        "50+ recepata sa makro podacima",
        "Plan za specijalne prilike"
      ],
      results: "Izgubite 8-15kg za 3 meseca",
      popular: true,
      savings: "Uštedite 30€"
    },
    {
      name: "VIP Coaching",
      price: "150€",
      period: "mesečno",
      originalPrice: "200€",
      features: [
        "Sve iz Transformation paketa",
        "Nedeljne 1-na-1 video konsultacije (60min)",
        "Personalizovani suplementi plan",
        "Prioritetna podrška (odgovor u roku od 2h)",
        "Mesečna analiza napretka sa preporukama",
        "Pristup VIP Facebook grupi",
        "Garancija rezultata ili povrat novca"
      ],
      results: "Izgubite 15-25kg za 6 meseci",
      popular: false,
      savings: "Uštedite 50€"
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
          <p className="text-primary font-medium tracking-wide uppercase mb-2">
            PAKETI
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
            Na koji način možemo raditi zajedno?
          </h2>
          <p className="text-gray-600">
            Bilo da želiš lagani početak ili potpunu transformaciju — izaberi plan koji ti trenutno najviše odgovara.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, planIndex) => (
            <motion.div
              key={planIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={
                pricingInView
                  ? { opacity: 1, y: 0, scale: plan.popular ? 1.05 : 1 }
                  : { opacity: 0, y: 30, scale: 1 }
              }
              transition={{ duration: 0.6, delay: planIndex * 0.15 }}
              className={`bg-white rounded-xl shadow-lg overflow-hidden relative transform transition-transform duration-300 ${
                plan.popular
                  ? "border-2 border-primary shadow-2xl scale-105"
                  : "border border-gray-200"
              }`}
            >
              <div className="p-8">
                {plan.popular && (
                  <div className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full text-center mb-4">
                    NAJPOPULARNIJI
                  </div>
                )}

                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-primary font-semibold text-sm mb-4">{plan.results}</p>

                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-400 line-through">{plan.originalPrice}</span>
                      <span className="text-sm text-green-600 font-semibold">{plan.savings}</span>
                    </div>
                  </div>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className={`w-full py-4 px-6 rounded-md font-bold text-lg transition transform hover:scale-105 shadow-md ${
                    plan.popular
                      ? 'bg-primary text-white hover:bg-primary-dark'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {plan.popular ? 'POČNI TRANSFORMACIJU' : 'Izaberi Plan'}
                </a>

                <p className="text-xs text-gray-500 text-center mt-3">
                  Bez ugovorne obaveze • Otkažite bilo kada
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}