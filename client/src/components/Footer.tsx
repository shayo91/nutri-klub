import { Link } from "wouter";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { SiInstagram, SiFacebook } from "react-icons/si";
import { MapPin, Mail } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);
    try {
      await apiRequest("POST", "/api/subscribe", { email });
      toast({
        title: "Pretplata uspešna",
        description: "Hvala što ste se pretplatili na naš newsletter!",
      });
      setEmail("");
    } catch (error) {
      toast({
        title: "Pretplata neuspešna",
        description:
          "Došlo je do greške prilikom pretplate na newsletter. Pokušajte ponovo.",
        variant: "destructive",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-[#1a1a1a] pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <Link href="/" className="flex items-center mb-6">
              <span className="text-white text-xl font-bold italic">
                NutriKlub
              </span>
            </Link>
            <p className="text-gray-400 mb-6">
              Pomažem ljudima koji žele da unaprijede ishranu kroz praktične, zdrave i ukusne recepte.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://www.instagram.com/nutriputovanje/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 hover:bg-[#E4405F] hover:text-white transition"
              >
                <SiInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/nutricionistajelena/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 hover:bg-[#1877F2] hover:text-white transition"
              >
                <SiFacebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Navigacija</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition">
                  Početna
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition">
                  O Meni
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-gray-400 hover:text-white transition">
                  Usluge
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="text-gray-400 hover:text-white transition">
                  Recenzije
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-gray-400 hover:text-white transition">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Usluge</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#pricing" className="text-gray-400 hover:text-white transition">
                  Individualno Savjetovanje
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-gray-400 hover:text-white transition">
                  Plan Ishrane za Mršavljenje
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-gray-400 hover:text-white transition">
                  Plan Ishrane za Debljanje
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-gray-400 hover:text-white transition">
                  Bezglutenska Ishrana
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-gray-400 hover:text-white transition">
                  Online Nutricionista
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Kontakt</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#5DAD8C] mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">Banja Luka, Bosna i Hercegovina</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#5DAD8C] flex-shrink-0" />
                <a href="mailto:nutriklub@gmail.com" className="text-gray-400 hover:text-white transition">
                  nutriklub@gmail.com
                </a>
              </li>
            </ul>

            <h3 className="text-white font-semibold mt-6 mb-3">Newsletter</h3>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Vaša e-mail adresa"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5DAD8C]/40 focus:border-[#5DAD8C]"
                required
              />
              <button
                type="submit"
                className="w-full py-2 bg-[#5DAD8C] hover:bg-[#4A9A79] text-white rounded-lg font-medium transition duration-300 ease-in-out disabled:opacity-70"
                disabled={isSubscribing}
              >
                {isSubscribing ? "Pretplaćujem se..." : "Pretplatite se"}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Jelena Matijaš. Sva prava zadržana.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/privacy" className="text-gray-500 hover:text-white transition">
                Politika Privatnosti
              </Link>
              <span className="text-gray-700">|</span>
              <Link href="/terms" className="text-gray-500 hover:text-white transition">
                Uslovi Korištenja
              </Link>
              <span className="text-gray-700">|</span>
              <Link href="/cookies" className="text-gray-500 hover:text-white transition">
                Kolačići
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
