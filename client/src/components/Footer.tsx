import { Link } from "wouter";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* About */}
          <div>
            <Link href="/" className="flex items-center mb-6">
              <span className="text-primary text-2xl font-bold font-poppins">
                NutriHub
              </span>
            </Link>
            <p className="text-gray-600 mb-6">
              Profesionalni nutricionista posvećen tome da vam pomogne da
              postignete optimalno zdravlje kroz personalizovane planove
              ishrane.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-primary font-medium mb-4">Brze Veze</h3>
            <ul>
              <li>
                <Link href="#services" className="text-gray-600 hover:text-primary">
                  Usluge
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-gray-600 hover:text-primary">
                  O Nama
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-600 hover:text-primary">
                  Politika Privatnosti
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-gray-600 hover:text-primary">
                  Uslovi Korišćenja
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="text-gray-600 hover:text-primary">
                  Politika Kolačića
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-primary font-medium mb-4">
              Pretplatite se na Newsletter
            </h3>
            <p className="text-gray-600 mb-4">
              Ostanite u toku sa najnovijim savetima o ishrani, receptima i
              promocijama.
            </p>
            <form onSubmit={handleSubscribe}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Vaša e-mail adresa"
                className="w-full px-4 py-2 border rounded-md"
                required
              />
              <button
                type="submit"
                className="w-full py-2 bg-primary hover:bg-primary-dark text-white rounded-md font-medium transition duration-300 ease-in-out disabled:opacity-70"
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
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-600 hover:text-primary text-sm transition"
              >
                Politika Privatnosti
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-primary text-sm transition"
              >
                Uslovi Korišćenja
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-primary text-sm transition"
              >
                Politika Kolačića
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
