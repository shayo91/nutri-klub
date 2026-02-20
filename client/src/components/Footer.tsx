import { Link } from "wouter";
import { useState } from "react";
import { SiInstagram, SiFacebook } from "react-icons/si";
import { MapPin, Mail } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter disabled – "Dolazi uskoro"
  };

  return (
    <footer className="bg-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <Link href="/" className="flex items-center mb-6">
              <span className="text-[#1F7A5C] text-xl font-bold italic">
                NutriKlub
              </span>
            </Link>
            <p className="text-gray-600 mb-6">
              Pomažem ljudima koji žele da unaprijede ishranu kroz praktične,
              zdrave i ukusne recepte.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://www.instagram.com/nutriputovanje/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 bg-[#ECF8F2] rounded-full flex items-center justify-center text-[#1F7A5C] hover:bg-[#E4405F] hover:text-white transition"
              >
                <SiInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/nutricionistajelena/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 bg-[#ECF8F2] rounded-full flex items-center justify-center text-[#1F7A5C] hover:bg-[#1877F2] hover:text-white transition"
              >
                <SiFacebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-[#1F7A5C] font-semibold mb-4">Navigacija</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-[#1F7A5C] transition"
                >
                  Početna
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-[#1F7A5C] transition"
                >
                  O Meni
                </Link>
              </li>
              <li>
                <Link
                  href="/#pricing"
                  className="text-gray-600 hover:text-[#1F7A5C] transition"
                >
                  Usluge
                </Link>
              </li>
              <li>
                <Link
                  href="/#testimonials"
                  className="text-gray-600 hover:text-[#1F7A5C] transition"
                >
                  Recenzije
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className="text-gray-600 hover:text-[#1F7A5C] transition"
                >
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[#1F7A5C] font-semibold mb-4">Usluge</h3>
            <ul className="space-y-2">
              <li>Individualno Savjetovanje</li>
              <li>Plan Ishrane za Mršavljenje</li>
              <li>Plan Ishrane za Debljanje</li>
              <li>Bezglutenska Ishrana</li>
              <li>Online Nutricionista</li>
            </ul>
          </div>

          <div>
            <h3 className="text-[#1F7A5C] font-semibold mb-4">Kontakt</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#5DAD8C] mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">
                  Banja Luka, Bosna i Hercegovina
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#5DAD8C] flex-shrink-0" />
                <a
                  href="mailto:jelena@jelenamatijas.ba"
                  className="text-gray-600 hover:text-[#1F7A5C] transition"
                >
                  jelena@jelenamatijas.ba
                </a>
              </li>
            </ul>

            <h3 className="text-[#1F7A5C] font-semibold mt-6 mb-3">
              Newsletter
            </h3>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <label htmlFor="newsletter-email" className="sr-only">
                E-mail adresa za newsletter
              </label>
              <input
                id="newsletter-email"
                name="newsletter-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Dolazi uskoro"
                disabled
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F7A5C]/20 focus:border-[#1F7A5C] disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled
                className="w-full py-2 bg-[#5EBA9A] text-white rounded-full font-medium transition duration-300 ease-in-out disabled:opacity-70 shadow-md cursor-not-allowed"
              >
                Pretplatite se
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Jelena Matijaš. Sva prava zadržana.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <Link
                href="/privacy"
                className="text-gray-500 hover:text-[#1F7A5C] transition"
              >
                Pravila Privatnosti
              </Link>
              <span className="text-gray-300">|</span>
              <Link
                href="/terms"
                className="text-gray-500 hover:text-[#1F7A5C] transition"
              >
                Uslovi Poslovanja
              </Link>
              <span className="text-gray-300">|</span>
              <Link
                href="/cookies"
                className="text-gray-500 hover:text-[#1F7A5C] transition"
              >
                Kolačići
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
