import type { ReactNode } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Leaf, BookOpen, ClipboardList, MessageCircleQuestion, Calendar } from "lucide-react";

interface FeatureCard {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function ProgramsSection() {
  const { ref, inView } = useAnimateOnScroll(0.1);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const features: FeatureCard[] = [
    {
      icon: <BookOpen className="w-8 h-8 text-[#5DAD8C]" />,
      title: "Baza recepata",
      description: "Jednostavni, balansirani i nutritivno bogati obroci prilagođeni svakodnevnom životu"
    },
    {
      icon: <ClipboardList className="w-8 h-8 text-[#5DAD8C]" />,
      title: "Dnevnik ishrane",
      description: "Prostor gdje ćemo zajedno pratiti tvoje obroke, navike i napredak"
    },
    {
      icon: <MessageCircleQuestion className="w-8 h-8 text-[#5DAD8C]" />,
      title: "Prostor za pitanja",
      description: "Mjesto gdje možeš postavljati pitanja i dobiti stručne nutricionističke odgovore"
    },
    {
      icon: <Calendar className="w-8 h-8 text-[#5DAD8C]" />,
      title: "Mjesečna pretplata",
      description: "Kontinuiran pristup edukativnom sadržaju"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/coming-soon", { email: email.trim() });
      setIsSubmitted(true);
      setEmail("");
      toast({
        title: "Hvala!",
        description: "Obavijestit ćemo te kada platforma bude dostupna.",
      });
    } catch (err) {
      const fallback = "Došlo je do greške. Pokušajte ponovo.";
      const enToBcs: Record<string, string> = {
        "Invalid email address": "Unesite ispravnu email adresu.",
        "Validation failed": "Podaci nisu ispravni.",
        "Error processing signup": "Prijava nije uspjela. Pokušajte ponovo.",
      };
      let description = fallback;
      if (err instanceof Error && err.message) {
        const match = err.message.match(/^\d+\s*:\s*(\{[\s\S]*\})\s*$/);
        if (match) {
          try {
            const body = JSON.parse(match[1]);
            const raw = body.message ?? body.errors?.[0]?.message ?? "";
            description = enToBcs[raw] ?? (typeof raw === "string" && raw ? raw : fallback);
          } catch {
            description = enToBcs[err.message] ?? fallback;
          }
        } else {
          description = enToBcs[err.message] ?? (err.message || fallback);
        }
      }
      toast({
        title: "Greška",
        description,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="coming-soon" aria-label="Uskoro dostupni programi" className="py-16 md:py-24 bg-[#5DAD8C]" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Leaf className="w-8 h-8 text-white" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Nešto novo u pripremi
            </h2>
          </div>
          <p className="text-white/90 text-lg max-w-3xl mx-auto leading-relaxed">
            Na ovoj web stranici uskoro vas očekuje novi praktičan prostor za sve koji žele da unaprijede ishranu i stvore nove navike uz nutricionističku podršku.
          </p>
        </motion.div>

        {/* Feature Cards Header */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-white text-xl font-semibold text-center mb-8"
        >
          Šta te očekuje?
        </motion.p>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -6, boxShadow: "0 12px 30px -8px rgba(0,0,0,0.2)" }}
              className="bg-white rounded-xl p-6 shadow-lg transition-all duration-300 text-center"
            >
              <div className="mb-4 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-[#333333] mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-[#666666] leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <p className="text-white italic text-lg mb-2">
            I još mnogo toga...
          </p>
          <p className="text-white mb-6">
            Prati novosti i budi među prvima koji će imati pristup.
          </p>

          {/* Email Signup Form */}
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <label htmlFor="programs-email" className="sr-only">
                E-mail adresa za obavijesti
              </label>
              <input
                id="programs-email"
                name="programs-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tvoja email adresa"
                required
                className="flex-grow px-5 py-3 rounded-full bg-white text-[#333333] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-md"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-white text-[#5DAD8C] font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Šaljem..." : "Obavijesti me"}
              </button>
            </form>
          ) : (
            <div className="bg-white/20 rounded-full py-3 px-6 inline-block">
              <p className="text-white font-medium">
                Hvala! Obavijestit ćemo te kada platforma bude dostupna.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
