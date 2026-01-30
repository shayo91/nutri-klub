import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { ChevronLeft, ChevronRight, User } from "lucide-react";

interface Review {
  id: number;
  content: string;
  timestamp: string;
}

const reviews: Review[] = [
  {
    id: 1,
    content: "Sa 65 godina i više zdravstvenih problema dugo sam se liječila i trudila da budem odgovoran pacijent, ali višak kilograma je ostajao veliki problem. Imala sam skoro 100kg i, uprkos raznim dijetama i ranijim pokušajima kod drugih nutricionista, bez uspjeha. Prije godinu dana odlučila sam se za saradnju sa nutricionistkinjom Jelenom i već na prvom susretu osjetila sam iskrenu želju da pomogne, a ne samo profesionalnu obavezu. Jelovnici su bili prilagođeni isključivo meni, mojim zdravstvenim potrebama i ukusu.",
    timestamp: "prije 2 sedmice"
  },
  {
    id: 2,
    content: "Skoro 2 godine sam imala problem, nelagodu, peckanje i blagu bol na lijevoj strani stomaka, ispod rebara. Tegobe su bile naročito izražene poslije jela. Pri tom sam dobila 15 kg viška u menopauzi iako sam dosta fizički aktivna. Bila sam teška, troma, a nisam navikla na takvu JA. 🥴 Išla sam na razno razne preglede, ultrazvuk, vadila nalaze.... sve je bilo u granicama normale i to je pripisano godinama, usporenom metabolizmu....propisivane su tablete protiv gasova i bolova.",
    timestamp: "prije 1 mjesec"
  },
  {
    id: 3,
    content: "Rad sa tobom mi je puno pomogao da napokon uvedem red u ishranu i trening bez stresa i rigidnih pravila (-20kg). Najkorisnije mi je bilo što je sve bilo prilagođeno meni, mom tempu i realnom životu, uz konstantnu podršku i jasna objašnjenja. Tokom saradnje primijetila sam više energije, prije saradnje najveći izazov mi je bio nedostatak motivacije, a kroz rad s tobom sam dobila osjećaj kontrole i jasnog smjera. Iskustvo je bilo jako pozitivno i osjećala sam se sasma podržano.",
    timestamp: "14:32"
  },
  {
    id: 4,
    content: "Strah je bio moje drugo ime, strah od jojo efekta upravljao je sa mnom. Da li ću istrajati, da li ću ja to moći, da li će mi se vratiti kilogrami, glava mi je bila puna pitanja. Jelena me je naučila kako obrok može biti bogato nutritivan, i zasitan, pa je moj tanjir sada šareniji, nego ikada prije. Naučila sam od nje da pravilno formiram obroke i dobila niz ideja za to, uz gubitak 16 kilograma. Pola godine, bila je posvećena našoj saradnji i uvijek tu za sve nedoumice.",
    timestamp: "prije 3 sedmice"
  },
  {
    id: 5,
    content: "Želim da pohvalim nutricionistu Jelenu jer je izuzetno stručna, prijatna i puna razumjevanja. Plan ishrane je prilagodila mom životnom stilu, tako da bez stresa postižem željene rezultate. Jelena prati svaki korak u procesu i uvijek je tu za dodatna pitanja i motivaciju. Ja sam prezadovoljna saradnjom sa njom i moje tople preporuke su svima koji žele zdrave promjene.",
    timestamp: "11:45"
  },
  {
    id: 6,
    content: "Nakon mjeseci netreniranja zbog oporavka od gripa i terapija pod lijekovima, dobijam visak kilograma 106 kg. Danas 95 kg (-11kg), tijelo na vrhuncu snage! Raspoloženje, samopouzdanje, energija - benefiti procesa.",
    timestamp: "prije 1 sedmicu"
  },
  {
    id: 7,
    content: "Mogu samo da kazem da je sa Vama jedno divno iskustvo. Osjecam se lijepo i super je sve. Nemam nikakvu primjedbu sve je ok. Jako ste pozitivni i stalno ste tu za nas. Hvala na svemu i ostanite tako dobri i uspješni kao do sad. Veliki pozdrav!",
    timestamp: "09:23"
  },
  {
    id: 8,
    content: "Divno iskustvo sa Jelenom, kada imate zdravstvene probleme samo želite da vas neko čuje, podržava i ne osuđuje, ona je ta osoba. Njena posvećenost dolazi iz mjesta empatije, sigurnosti i prave ljubavi prema svom znanju.",
    timestamp: "prije 5 dana"
  },
  {
    id: 9,
    content: "Iznad svih očekivanja. Par mjeseci sam sarađivao sa Jelenom i rezultati su impresivni. Profesionalna usluga, konstantna podrška i komunikacija na veoma visokom nivou. Sve preporuke za sve one koji su spremni da izgrade disciplinu, promjene način ishrane i budu u odličnoj formi!",
    timestamp: "16:48"
  },
  {
    id: 10,
    content: "Izuzetno sam zadovoljan saradnjom! Pomogli su mi da bolje razumem ishranu i postignem značajne promene. Preporučujem svakome ko želi da poboljša svoje zdravlje i ishranu.",
    timestamp: "prije 4 dana"
  }
];

export default function TestimonialsSection() {
  const { ref: headerRef, inView: headerInView } = useAnimateOnScroll(0.1);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const slidesPerView = useWindowSize();

  const maxIndex = Math.max(0, reviews.length - slidesPerView);

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = 304;
      carouselRef.current.scrollTo({
        left: index * cardWidth,
        behavior: "smooth"
      });
    }
  };

  const nextSlide = () => {
    const newIndex = Math.min(currentIndex + 1, maxIndex);
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  };

  const prevSlide = () => {
    const newIndex = Math.max(currentIndex - 1, 0);
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(carouselRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (carouselRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 1.5;
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (carouselRef.current) {
      const cardWidth = 304;
      const newIndex = Math.round(carouselRef.current.scrollLeft / cardWidth);
      setCurrentIndex(Math.min(Math.max(newIndex, 0), maxIndex));
    }
  };

  const handleScroll = () => {
    if (carouselRef.current && !isDragging) {
      const cardWidth = 304;
      const newIndex = Math.round(carouselRef.current.scrollLeft / cardWidth);
      setCurrentIndex(Math.min(Math.max(newIndex, 0), maxIndex));
    }
  };

  const truncateText = (text: string, maxLength: number = 180) => {
    if (text.length <= maxLength) return { text, isTruncated: false };
    return { text: text.slice(0, maxLength) + "...", isTruncated: true };
  };

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <p className="text-[#5DAD8C] font-medium tracking-wide uppercase mb-2">
            RECENZIJE
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Šta Moji Klijenti Kažu
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Najljepši dio mog posla su priče ljudi koji su odlučili da promijene svoj odnos prema hrani, i prema sebi. Ovdje možeš pročitati njihove iskrene utiske, male pobjede i velike promjene.
          </p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className={`absolute top-1/2 -left-2 md:-left-6 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-[#5DAD8C] rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
              currentIndex === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-[#4A9A79] hover:scale-110"
            }`}
            aria-label="Prethodna recenzija"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </button>

          <button
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
            className={`absolute top-1/2 -right-2 md:-right-6 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-[#5DAD8C] rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
              currentIndex >= maxIndex ? "opacity-40 cursor-not-allowed" : "hover:bg-[#4A9A79] hover:scale-110"
            }`}
            aria-label="Sljedeća recenzija"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </button>

          {/* Carousel Container */}
          <div
            ref={carouselRef}
            className="flex gap-5 overflow-x-auto scroll-smooth px-4 md:px-8 pb-4 cursor-grab active:cursor-grabbing scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onScroll={handleScroll}
          >
            {reviews.map((review, index) => {
              const { text, isTruncated } = truncateText(review.content);
              const isExpanded = expandedId === review.id;

              return (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="flex-shrink-0 w-[280px] md:w-[300px] bg-white rounded-xl shadow-lg p-4 transition-all duration-300 select-none"
                  style={{ userSelect: "none" }}
                >
                  {/* Avatar */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#E0E0E0] flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>
                    <span className="text-xs text-gray-400">{review.timestamp}</span>
                  </div>

                  {/* Chat Bubble */}
                  <div className="bg-[#5DAD8C] rounded-2xl rounded-bl-md p-4 text-white">
                    <p className="text-sm leading-relaxed">
                      {isExpanded ? review.content : text}
                    </p>
                    {isTruncated && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedId(isExpanded ? null : review.id);
                        }}
                        className="mt-2 text-xs text-white/80 hover:text-white underline transition-colors"
                      >
                        {isExpanded ? "Prikaži manje" : "Pročitaj više..."}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: Math.ceil(reviews.length / slidesPerView) }).map((_, index) => {
              const isActive = Math.floor(currentIndex / slidesPerView) === index;
              return (
                <button
                  key={index}
                  onClick={() => {
                    const newIndex = index * slidesPerView;
                    setCurrentIndex(newIndex);
                    scrollToIndex(newIndex);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    isActive ? "bg-[#5DAD8C]" : "bg-[#5DAD8C]/30"
                  }`}
                  aria-label={`Idi na grupu ${index + 1}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

function useWindowSize() {
  const [slidesPerView, setSlidesPerView] = useState(3);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) {
        setSlidesPerView(1);
      } else if (window.innerWidth < 1024) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(3);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return slidesPerView;
}
