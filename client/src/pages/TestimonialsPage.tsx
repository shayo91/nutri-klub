import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { useEffect } from "react";
import { Helmet } from "react-helmet";

// Header is handled by the main layout

interface SuccessStory {
  id: number;
  name: string;
  age: number;
  profession: string;
  beforeImage: string;
  afterImage: string;
  weightLoss: string;
  timeframe: string;
  story: string;
  beforeStats: {
    weight: string;
    bmi: string;
    bodyFat?: string;
  };
  afterStats: {
    weight: string;
    bmi: string;
    bodyFat?: string;
  };
  testimonial: string;
}

const successStories: SuccessStory[] = [
  {
    id: 1,
    name: "Marija Petrović",
    age: 34,
    profession: "Profesorka",
    beforeImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=600&fit=crop&crop=face",
    afterImage: "https://images.unsplash.com/photo-1594736797933-d0f31cc1d181?w=400&h=600&fit=crop&crop=face",
    weightLoss: "-15 kg",
    timeframe: "6 meseci",
    story: "Posle rođenja deteta nisam mogla da se vratim u formu. Sve dijete su bile neuspešne.",
    beforeStats: {
      weight: "78 kg",
      bmi: "28.5",
      bodyFat: "35%"
    },
    afterStats: {
      weight: "63 kg",
      bmi: "23.0",
      bodyFat: "24%"
    },
    testimonial: "Jelena je potpuno promenila moj pristup ishrani. Naučila sam da se hranim zdravo bez odricanja. Plan je bio jednostavan za praćenje i uklapao se savršeno u moj užurban raspored mame. Za 6 meseci sam smršala 15kg i što je najvažnije - zadržala sam rezultate!"
  },
  {
    id: 2,
    name: "Stefan Jovanović",
    age: 29,
    profession: "IT Menadžer",
    beforeImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face",
    afterImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face",
    weightLoss: "-12 kg",
    timeframe: "4 meseca",
    story: "Rad za kompjuterom ceo dan je doveo do loših navika u ishrani i nedostatka energije.",
    beforeStats: {
      weight: "89 kg",
      bmi: "26.8",
      bodyFat: "22%"
    },
    afterStats: {
      weight: "77 kg",
      bmi: "23.2",
      bodyFat: "15%"
    },
    testimonial: "Kao neko ko radi za kompjuterom ceo dan, uvek sam imao problema sa ishranom. Jelenin plan je bio praktičan i lako primenljiv. Dobio sam energiju koju nisam imao godinama i konačno se osećam zdravo!"
  },
  {
    id: 3,
    name: "Ana Milosavljević",
    age: 31,
    profession: "Mama dvoje dece",
    beforeImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=600&fit=crop&crop=face",
    afterImage: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=600&fit=crop&crop=face",
    weightLoss: "-18 kg",
    timeframe: "8 meseci",
    story: "Posle drugog porođaja, gubila sam motivaciju i veru da mogu da se vratim u formu.",
    beforeStats: {
      weight: "82 kg",
      bmi: "30.1",
      bodyFat: "38%"
    },
    afterStats: {
      weight: "64 kg",
      bmi: "23.5",
      bodyFat: "26%"
    },
    testimonial: "Jelena je razumela moje izazove kao mame dvoje male dece. Kreirala je plan koji se uklapao u moj kaotičan raspored. Rezultati su bili neverovatni - ne samo što sam smršala, već sam dobila samopouzdanje koje sam izgubila!"
  },
  {
    id: 4,
    name: "Miloš Stojanović",
    age: 42,
    profession: "Preduzetnik",
    beforeImage: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop&crop=face",
    afterImage: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=600&fit=crop&crop=face",
    weightLoss: "-22 kg",
    timeframe: "10 meseci",
    story: "Stress na poslu je doveo do pogrešnih navika u ishrani i značajnog povećanja težine.",
    beforeStats: {
      weight: "102 kg",
      bmi: "32.8",
      bodyFat: "28%"
    },
    afterStats: {
      weight: "80 kg",
      bmi: "25.7",
      bodyFat: "18%"
    },
    testimonial: "Kao preduzetnik, uvek sam stavljao posao na prvo mesto i zanemarivao zdravlje. Jelena mi je pokazala kako da integriram zdravu ishranu u užurban raspored. Transformacija je bila neverovatna!"
  }
];

export default function TestimonialsPage() {
  const { ref: headerRef, inView: headerInView } = useAnimateOnScroll();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Recenzije i Rezultati | Nutricionista Jelena Matijaš BiH</title>
        <meta name="description" content="Pogledajte transformacije i iskustva klijenata nutricioniste Jelene Matijaš. Rezultati mršavljenja i zdrave ishrane u Bosni i Hercegovini." />
        <meta property="og:title" content="Recenzije i Rezultati | Nutricionista Jelena Matijaš" />
        <meta property="og:description" content="Pogledajte transformacije i iskustva klijenata nutricioniste u BiH. Rezultati personalizovanih planova ishrane." />
        <meta property="og:image" content="https://nutriputovanje.com/attached_assets/Untitled_design_(18)_1770122157577.png" />
        <meta property="og:locale" content="bs_BA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Recenzije i Rezultati | Nutricionista Jelena Matijaš" />
        <meta name="twitter:description" content="Pogledajte transformacije i iskustva klijenata nutricioniste u BiH. Rezultati personalizovanih planova ishrane." />
        <meta name="twitter:image" content="https://nutriputovanje.com/attached_assets/Untitled_design_(18)_1770122157577.png" />
        <link rel="canonical" href="https://nutriputovanje.com/testimonials" />
      </Helmet>
      {/* Hero Section */}
      <section className="py-16 md:py-24" style={{ backgroundColor: "#F5F5F0" }}>
        <div className="container mx-auto px-4">
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold font-poppins mb-6 text-gray-800">
              Šta Kažu Naši Klijenti?
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              Fokusirajte se na lične planove ishrane za zdraviji život.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-primary font-medium tracking-wide uppercase mb-2">
              PRIČE USPEHA
            </p>
            <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
              Inspirativne Transformacije
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Svaka priča je jedinstvena, ali cilj je isti - trajno zdravlje i dobrobit kroz pravilnu ishranu
            </p>
          </motion.div>

          <div className="space-y-16">
            {successStories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-16 items-center`}
              >
                {/* Before/After Images */}
                <div className="flex-1 max-w-lg">
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-center mb-6">
                        {story.name}, {story.age}
                      </h3>
                      <p className="text-center text-gray-600 mb-6">{story.profession}</p>

                      {/* Image Comparison */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="text-center">
                          <img
                            src={story.beforeImage}
                            alt={`${story.name} pre nutricionista transformacija`}
                            className="w-full h-64 object-cover rounded-lg"
                            loading="lazy"
                          />
                          <p className="text-sm font-medium text-gray-500 mt-2">PRE</p>
                        </div>
                        <div className="text-center">
                          <img
                            src={story.afterImage}
                            alt={`${story.name} posle nutricionista transformacija mršavljenje`}
                            className="w-full h-64 object-cover rounded-lg"
                            loading="lazy"
                          />
                          <p className="text-sm font-medium text-gray-500 mt-2">POSLE</p>
                        </div>
                      </div>

                      {/* Stats Comparison */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">PRE:</h4>
                            <p>Težina: {story.beforeStats.weight}</p>
                            <p>BMI: {story.beforeStats.bmi}</p>
                            {story.beforeStats.bodyFat && <p>Telesna mast: {story.beforeStats.bodyFat}</p>}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">POSLE:</h4>
                            <p>Težina: {story.afterStats.weight}</p>
                            <p>BMI: {story.afterStats.bmi}</p>
                            {story.afterStats.bodyFat && <p>Telesna mast: {story.afterStats.bodyFat}</p>}
                          </div>
                        </div>
                      </div>

                      {/* Results */}
                      <div className="text-center mt-6">
                        <div className="bg-primary text-white rounded-lg p-4">
                          <p className="text-2xl font-bold">{story.weightLoss}</p>
                          <p className="text-sm opacity-90">za {story.timeframe}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Story Content */}
                <div className="flex-1 max-w-lg">
                  <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="mb-6">
                      <h4 className="text-xl font-bold mb-4">Moja priča:</h4>
                      <p className="text-gray-600 italic mb-6">"{story.story}"</p>
                    </div>

                    <div className="border-l-4 border-primary pl-6">
                      <h4 className="text-lg font-bold mb-3">Iskustvo sa nutritcionistom:</h4>
                      <p className="text-gray-700 leading-relaxed">
                        {story.testimonial}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
                      <span>Verifikovano iskustvo</span>
                      <div className="flex text-yellow-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <i key={i} className="fas fa-star"></i>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h3 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
              Spremni Ste Za Svoju Transformaciju?
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              Pridružite se našim zadovoljnim klijentima i počnite svoju priču uspeha već danas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.href = '/#contact'}
                className="bg-primary text-white px-8 py-4 rounded-lg font-medium hover:bg-primary-dark transition duration-300 shadow-lg"
              >
                Zakazujte Konsultacije
              </button>
              <button 
                onClick={() => window.location.href = '/#quiz'}
                className="bg-white text-primary border-2 border-primary px-8 py-4 rounded-lg font-medium hover:bg-primary hover:text-white transition duration-300"
              >
                Počnite Kviz
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}