import { useState, useEffect } from "react";
import { Link } from "wouter";
import { X } from "lucide-react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-gray-700 text-sm">
              Koristimo kolačiće kako bismo poboljšali vaše iskustvo na našoj web stranici. Nastavkom korištenja sajta pristajete na upotrebu kolačića.{" "}
              <Link href="/kolacici" className="text-[#5DAD8C] hover:underline font-medium">
                Saznajte više
              </Link>
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={declineCookies}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg transition"
            >
              Odbij
            </button>
            <button
              onClick={acceptCookies}
              className="px-4 py-2 text-sm bg-[#5DAD8C] hover:bg-[#4A9A79] text-white rounded-lg font-medium transition"
            >
              Prihvati
            </button>
            <button
              onClick={declineCookies}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2.5 text-gray-400 hover:text-gray-600 transition"
              aria-label="Zatvori"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
