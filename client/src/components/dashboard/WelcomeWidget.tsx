import { Sparkles, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export function WelcomeWidget() {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Dobro jutro";
    if (hour < 18) return "Dobar dan";
    return "Dobro veče";
  };

  const getMotivationalQuote = () => {
    const quotes = [
      "Svaka promjena počinje prvim korakom. Ti si već na pravom putu! 💪",
      "Tvoje zdravlje je investicija, ne trošak. Nastavi naprijed! 🌟",
      "Svaki obrok je prilika da hraniš svoje tijelo i dušu. 🥗",
      "Napredak nije uvijek vidljiv, ali svaki dan računaš se! 🎯",
      "Slušaj svoje tijelo, brini o njemu i vidjet ćeš rezultate. 💚",
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  const formatDate = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("sr-Latn-RS", options);
  };

  return (
    <Card className="bg-gradient-to-br from-[#1F7A5C] via-[#1F7A5C] to-[#185A44] border-0 overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-20 translate-x-20"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-20 -translate-x-20"></div>

      <div className="relative z-10 p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-white/80 mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{formatDate()}</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {getGreeting()}, {user?.firstName || "Korisniče"}! 👋
            </h2>
            <p className="text-white/90 text-lg">
              Dobrodošli na vaš dashboard za zdravu ishranu.
            </p>
          </div>
          <Sparkles className="w-8 h-8 text-[#FFD700]" />
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <p className="text-white text-sm leading-relaxed">
            {getMotivationalQuote()}
          </p>
        </div>
      </div>
    </Card>
  );
}
