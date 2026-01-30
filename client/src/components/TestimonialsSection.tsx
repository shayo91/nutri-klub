import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { ChevronLeft, ChevronRight, X, Signal, Wifi, Battery } from "lucide-react";

interface Review {
  id: number;
  content: string;
  time: string;
}

const reviews: Review[] = [
  {
    id: 1,
    content: "Sa 65 godina i više zdravstvenih problema dugo sam se liječila i trudila da budem odgovoran pacijent, ali višak kilograma je ostajao veliki problem. Imala sam skoro 100kg i, uprkos raznim dijetama i ranijim pokušajima kod drugih nutricionista, bez uspjeha. Prije godinu dana odlučila sam se za saradnju sa nutricionistkinjom Jelenom i već na prvom susretu osjetila sam iskrenu želju da pomogne, a ne samo profesionalnu obavezu. Jelovnici su bili prilagođeni isključivo meni, mojim zdravstvenim potrebama i ukusu. Danas sam lakša za 25 kilograma i osjećam se bolje nego ikada! Naučila sam da jedem pravilno, bez gladovanja i stresa. Jelena je bila uz mene na svakom koraku, odgovarala na svako pitanje i pružala podršku kada mi je bilo najpotrebnije.",
    time: "14:32"
  },
  {
    id: 2,
    content: "Skoro 2 godine sam imala problem, nelagodu, peckanje i blagu bol na lijevoj strani stomaka, ispod rebara. Tegobe su bile naročito izražene poslije jela. Pri tom sam dobila 15 kg viška u menopauzi iako sam dosta fizički aktivna. Bila sam teška, troma, a nisam navikla na takvu JA. 🥴 Išla sam na razno razne preglede, ultrazvuk, vadila nalaze.... sve je bilo u granicama normale i to je pripisano godinama, usporenom metabolizmu....propisivane su tablete protiv gasova i bolova. Ali problem je i dalje bio tu. Nisam se mirila s činjenicom da u svojoj 54 toj godini ne mogu da funkcionišem normalno. Riješila sam da probam otići kod nutricioniste. Nisam pogriješila. Napokon osvježenje, neko ko sluša, neko ko je zainteresovan za moj problem. Jelena mi je pomogla da shvatim uzroke mojih tegoba i prilagodila plan ishrane mojim potrebama.",
    time: "16:35"
  },
  {
    id: 3,
    content: "Rad sa tobom mi je puno pomogao da napokon uvedem red u ishranu i trening bez stresa i rigidnih pravila (-20kg). Najkorisnije mi je bilo što je sve bilo prilagođeno meni, mom tempu i realnom životu, uz konstantnu podršku i jasna objašnjenja. Tokom saradnje primijetila sam više energije, prije saradnje najveći izazov mi je bio nedostatak motivacije, a kroz rad s tobom sam dobila osjećaj kontrole i jasnog smjera. Iskustvo je bilo jako pozitivno i osjećala sam se potpuno podržano kroz cijeli proces.",
    time: "11:45"
  },
  {
    id: 4,
    content: "Strah je bio moje drugo ime, strah od jojo efekta upravljao je sa mnom. Da li ću istrajati, da li ću ja to moći, da li će mi se vratiti kilogrami, glava mi je bila puna pitanja. Jelena me je naučila kako obrok može biti bogato nutritivan, i zasitan, pa je moj tanjir sada šareniji, nego ikada prije. Naučila sam od nje da pravilno formiram obroke i dobila niz ideja za to, uz gubitak 16 kilograma. Pola godine, bila je posvećena našoj saradnji i uvijek tu za sve nedoumice i pitanja koja sam imala.",
    time: "09:23"
  },
  {
    id: 5,
    content: "Želim da pohvalim nutricionistu Jelenu jer je izuzetno stručna, prijatna i puna razumjevanja. Plan ishrane je prilagodila mom životnom stilu, tako da bez stresa postižem željene rezultate. Jelena prati svaki korak u procesu i uvijek je tu za dodatna pitanja i motivaciju. Ja sam prezadovoljna saradnjom sa njom i moje tople preporuke su svima koji žele zdrave promjene.",
    time: "15:18"
  },
  {
    id: 6,
    content: "Nakon mjeseci netreniranja zbog oporavka od gripa i terapija pod lijekovima, dobijam visak kilograma 106 kg. Danas 95 kg (-11kg), tijelo na vrhuncu snage! Raspoloženje, samopouzdanje, energija - benefiti procesa. Prezadovoljan sam rezultatima i preporučujem svima!",
    time: "12:47"
  },
  {
    id: 7,
    content: "Mogu samo da kazem da je sa Vama jedno divno iskustvo. Osjecam se lijepo i super je sve. Nemam nikakvu primjedbu sve je ok. Jako ste pozitivni i stalno ste tu za nas. Hvala na svemu i ostanite tako dobri i uspješni kao do sad. Veliki pozdrav!",
    time: "10:05"
  },
  {
    id: 8,
    content: "Divno iskustvo sa Jelenom, kada imate zdravstvene probleme samo želite da vas neko čuje, podržava i ne osuđuje, ona je ta osoba. Njena posvećenost dolazi iz mjesta empatije, sigurnosti i prave ljubavi prema svom znanju. Preporučujem je svima koji traže podršku na svom putu ka zdravlju.",
    time: "17:22"
  },
  {
    id: 9,
    content: "Iznad svih očekivanja. Par mjeseci sam sarađivao sa Jelenom i rezultati su impresivni. Profesionalna usluga, konstantna podrška i komunikacija na veoma visokom nivou. Sve preporuke za sve one koji su spremni da izgrade disciplinu, promjene način ishrane i budu u odličnoj formi!",
    time: "13:56"
  },
  {
    id: 10,
    content: "Izuzetno sam zadovoljan saradnjom! Pomogli su mi da bolje razumem ishranu i postignem značajne promene. Preporučujem svakome ko želi da poboljša svoje zdravlje i ishranu. Hvala na svemu!",
    time: "08:41"
  }
];

const row1Reviews = reviews.slice(0, 5);
const row2Reviews = reviews.slice(5, 10);

interface CarouselRowProps {
  reviews: Review[];
  onOpenModal: (review: Review) => void;
  inView: boolean;
  rowIndex: number;
}

function CarouselRow({ reviews, onOpenModal, inView, rowIndex }: CarouselRowProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const slidesPerView = useWindowSize();

  const totalSlides = reviews.length;

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = 290;
      carouselRef.current.scrollTo({
        left: index * cardWidth,
        behavior: "smooth"
      });
    }
  };

  const nextSlide = () => {
    const newIndex = currentIndex >= totalSlides - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  };

  const prevSlide = () => {
    const newIndex = currentIndex <= 0 ? totalSlides - 1 : currentIndex - 1;
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
      const cardWidth = 290;
      const newIndex = Math.round(carouselRef.current.scrollLeft / cardWidth);
      setCurrentIndex(Math.min(Math.max(newIndex, 0), totalSlides - 1));
    }
  };

  const handleScroll = () => {
    if (carouselRef.current && !isDragging) {
      const cardWidth = 290;
      const newIndex = Math.round(carouselRef.current.scrollLeft / cardWidth);
      setCurrentIndex(Math.min(Math.max(newIndex, 0), totalSlides - 1));
    }
  };

  const truncateText = (text: string, maxLength: number = 320) => {
    if (text.length <= maxLength) return { text, isTruncated: false };
    return { text: text.slice(0, maxLength) + "...", isTruncated: true };
  };

  return (
    <div className="relative">
      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 -left-2 md:-left-6 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-[#7B6BA8] rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-[#6A5A97] hover:scale-110"
        aria-label="Prethodna recenzija"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 -right-2 md:-right-6 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-[#7B6BA8] rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-[#6A5A97] hover:scale-110"
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

          return (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: (rowIndex * 5 + index) * 0.03 }}
              whileHover={{ y: -4 }}
              className="flex-shrink-0 w-[270px] md:w-[280px] select-none"
              style={{ userSelect: "none" }}
            >
              {/* Phone Frame */}
              <div className="bg-gray-100 rounded-[28px] overflow-hidden shadow-xl border-4 border-white">
                {/* Phone Status Bar */}
                <div className="bg-gray-100 px-4 py-2 flex items-center justify-between text-gray-500 text-xs">
                  <span className="font-medium">{review.time}</span>
                  <div className="flex items-center gap-1">
                    <Signal className="w-3 h-3" />
                    <Wifi className="w-3 h-3" />
                    <Battery className="w-4 h-4" />
                  </div>
                </div>
                
                {/* Chat Area */}
                <div className="bg-white p-3 min-h-[420px] flex flex-col">
                  {/* Chat Bubble */}
                  <div className="bg-[#EFEBF5] rounded-2xl rounded-br-sm p-4 shadow-sm max-w-full">
                    <p className="text-[#1A1A1A] leading-relaxed" style={{ fontSize: '16px' }}>
                      {text}
                    </p>
                    {isTruncated && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenModal(review);
                        }}
                        className="mt-3 text-[#7B6BA8] font-medium hover:underline transition-colors"
                        style={{ fontSize: '16px' }}
                      >
                        Pročitaj više...
                      </button>
                    )}
                  </div>
                  
                  {/* Spacer */}
                  <div className="flex-grow" />
                  
                  {/* Message Input Area */}
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-grow bg-gray-100 rounded-full py-2 px-4 text-gray-400 text-sm">
                      Message...
                    </div>
                    <div className="w-8 h-8 bg-[#7B6BA8] rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {reviews.map((_, index) => {
          const isActive = currentIndex === index;
          return (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                scrollToIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                isActive ? "bg-[#7B6BA8]" : "bg-[#7B6BA8]/30"
              }`}
              aria-label={`Idi na recenziju ${index + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const { ref: headerRef, inView: headerInView } = useAnimateOnScroll(0.1);
  const [modalReview, setModalReview] = useState<Review | null>(null);

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <p className="text-[#7B6BA8] font-medium tracking-wide uppercase mb-2">
            RECENZIJE
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Šta Moji Klijenti Kažu
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Najljepši dio mog posla su priče ljudi koji su odlučili da promijene svoj odnos prema hrani, i prema sebi. Ovdje možeš pročitati njihove iskrene utiske, male pobjede i velike promjene.
          </p>
        </motion.div>

        {/* Row 1 */}
        <CarouselRow 
          reviews={row1Reviews} 
          onOpenModal={setModalReview} 
          inView={headerInView}
          rowIndex={0}
        />

        {/* Spacing between rows */}
        <div className="h-8" />

        {/* Row 2 */}
        <CarouselRow 
          reviews={row2Reviews} 
          onOpenModal={setModalReview} 
          inView={headerInView}
          rowIndex={1}
        />
      </div>

      {/* Modal for Full Text */}
      <AnimatePresence>
        {modalReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setModalReview(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-[#7B6BA8] px-6 py-4 flex items-center justify-between">
                <span className="text-white font-medium">Recenzija</span>
                <button
                  onClick={() => setModalReview(null)}
                  className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Modal Content - Phone Style */}
              <div className="bg-white p-4 overflow-y-auto max-h-[60vh]">
                <div className="bg-[#EFEBF5] rounded-2xl rounded-br-sm p-5 shadow-sm">
                  <p className="text-[#1A1A1A] leading-relaxed whitespace-pre-wrap" style={{ fontSize: '16px' }}>
                    {modalReview.content}
                  </p>
                  <p className="text-gray-500 text-xs mt-4 text-right">{modalReview.time}</p>
                </div>
              </div>
              
              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setModalReview(null)}
                  className="bg-[#7B6BA8] text-white px-6 py-2 rounded-full font-medium hover:bg-[#6A5A97] transition-colors"
                >
                  Zatvori
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
