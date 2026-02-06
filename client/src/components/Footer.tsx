import { Link } from "wouter";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { SiInstagram, SiFacebook } from "react-icons/si";

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
    <footer className="bg-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
          {/* About */}
          <div>
            <Link href="/" className="flex items-center mb-6">
              <span className="text-[#1F7A5C] text-xl font-bold">
                Nutricionista Jelena Matijaš
              </span>
            </Link>
            <p className="text-gray-600 mb-6">
              Pomažem ljudima koji žele da unaprijede ishranu kroz praktične, zdrave i ukusne recepte.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/nutriputovanje/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 bg-[#ECF8F2] rounded-full flex items-center justify-center text-[#1F7A5C] hover:bg-[#1F7A5C] hover:text-white transition"
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
            <h3 className="text-[#1F7A5C] font-medium mb-4">Brze Veze</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#pricing" className="text-gray-600 hover:text-[#1F7A5C] transition">
                  Usluge
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-[#1F7A5C] transition">
                  O Meni
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="text-gray-600 hover:text-[#1F7A5C] transition">
                  Recenzije
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-gray-600 hover:text-[#1F7A5C] transition">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-[#1F7A5C] transition">
                  Politika Privatnosti
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-[#1F7A5C] transition">
                  Uslovi Korištenja
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[#1F7A5C] font-medium mb-4">
              Pretplatite se na Newsletter
            </h3>
            <p className="text-gray-600 mb-4">
              Ostanite u toku sa najnovijim savetima o ishrani, receptima i
              promocijama.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Vaša e-mail adresa"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F7A5C]/20 focus:border-[#1F7A5C]"
                required
              />
              <button
                type="submit"
                className="w-full py-2 bg-[#1F7A5C] hover:bg-[#185F48] text-white rounded-lg font-medium transition duration-300 ease-in-out disabled:opacity-70"
                disabled={isSubscribing}
              >
                {isSubscribing ? "Pretplaćujem se..." : "Pretplatite se"}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Jelena Matijaš. Sva prava zadržana.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
