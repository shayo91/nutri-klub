import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { SiInstagram, SiFacebook } from "react-icons/si";
import { useAuth } from "@/contexts/AuthContext";

type NavScrollItem = {
  label: string;
  type: "scroll";
  target: string;
};

type NavLinkItem = {
  label: string;
  type: "link";
  href: string;
  /** How to highlight current page (default: exact href match) */
  activeMatch?: "exact" | "dashboard" | "auth";
};

type NavItem = NavScrollItem | NavLinkItem;

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState("home");
  const { isAuthenticated, configLoaded } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      
      const sections = ["home", "testimonials", "pricing", "blog", "contact"];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavigation = (target: string) => {
    if (location !== "/") {
      setLocation("/");
      setTimeout(() => {
        const element = document.getElementById(target);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setActiveSection(target);
    setMobileMenuOpen(false);
  };

  const navLinks = useMemo((): NavItem[] => {
    const platformHref =
      configLoaded && isAuthenticated ? "/dashboard" : "/login";
    const platformActiveMatch: "dashboard" | "auth" =
      configLoaded && isAuthenticated ? "dashboard" : "auth";

    return [
      { label: "Početna", target: "home", type: "scroll" },
      { label: "Recenzije", target: "testimonials", type: "scroll" },
      { label: "Usluge", target: "pricing", type: "scroll" },
      { label: "Blog", href: "/blog", type: "link" },
      {
        label: "Platforma",
        href: platformHref,
        type: "link",
        activeMatch: platformActiveMatch,
      },
      { label: "Kontakt", target: "contact", type: "scroll" },
      { label: "O meni", href: "/o-meni", type: "link" },
    ];
  }, [configLoaded, isAuthenticated]);

  const isNavActive = (item: NavItem) => {
    if (item.type === "scroll") {
      return location === "/" && activeSection === item.target;
    }
    const match = item.activeMatch ?? "exact";
    if (match === "dashboard") return location.startsWith("/dashboard");
    if (match === "auth") {
      return (
        location === "/login" ||
        location === "/register" ||
        location === "/forgot-password" ||
        location.startsWith("/onboarding")
      );
    }
    return location === item.href;
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white ${isScrolled ? "shadow-md" : ""} transition-shadow duration-300`}
    >
      <div className="container mx-auto px-4 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <Link href="/" className="flex items-center" onClick={() => handleNavigation('home')}>
            <img
              src="/logo-jelena-matijas2.svg"
              alt="Nutricionista Jelena Matijaš - logo"
              width={120}
              height={48}
              className="h-8 md:h-10 lg:h-12 w-auto"
            />
          </Link>
        </div>

        {/* Desktop Navigation + Instagram */}
        <div className="hidden lg:flex items-center space-x-8">
          <nav className="flex items-center space-x-8">
            {navLinks.map((item, index) => (
              item.type === "link" ? (
                <Link
                  key={index}
                  href={item.href}
                  className={`relative font-medium transition py-2 ${
                    isNavActive(item) 
                      ? "text-[#1F7A5C]" 
                      : "text-gray-700 hover:text-[#1F7A5C]"
                  }`}
                  data-testid={`nav-link-${item.label.toLowerCase().replace(' ', '-')}`}
                >
                  {item.label}
                  {isNavActive(item) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1F7A5C] rounded-full" />
                  )}
                </Link>
              ) : (
                <button
                  key={index}
                  onClick={() => handleNavigation(item.target)}
                  className={`relative font-medium transition py-2 ${
                    isNavActive(item)
                      ? "text-[#1F7A5C]"
                      : "text-gray-700 hover:text-[#1F7A5C]"
                  }`}
                  data-testid={`nav-link-${item.label.toLowerCase().replace(' ', '-')}`}
                >
                  {item.label}
                  {isNavActive(item) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1F7A5C] rounded-full" />
                  )}
                </button>
              )
            ))}
          </nav>

          {/* Social Links - Desktop */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/nutriputovanje/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-600 hover:text-[#E4405F] transition-colors duration-300"
              data-testid="link-instagram"
              aria-label="Instagram"
            >
              <SiInstagram className="w-5 h-5" />
            </a>
            <a
              href="https://www.facebook.com/nutricionistajelena/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-600 hover:text-[#1877F2] transition-colors duration-300"
              data-testid="link-facebook"
              aria-label="Facebook"
            >
              <SiFacebook className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center gap-3">
          <a
            href="https://www.instagram.com/nutriputovanje/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-[#E4405F] transition-colors duration-300"
            data-testid="link-instagram-mobile"
            aria-label="Instagram"
          >
            <SiInstagram className="w-5 h-5" />
          </a>
          <a
            href="https://www.facebook.com/nutricionistajelena/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-[#1877F2] transition-colors duration-300"
            data-testid="link-facebook-mobile"
            aria-label="Facebook"
          >
            <SiFacebook className="w-5 h-5" />
          </a>
          <button
            onClick={toggleMobileMenu}
            className="text-gray-700 focus:outline-none p-3 min-w-[44px] min-h-[44px] flex items-center justify-center"
            data-testid="button-mobile-menu"
            aria-label={mobileMenuOpen ? "Zatvori meni" : "Otvori meni"}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg py-4 px-6 space-y-2 border-t border-gray-100">
          {navLinks.map((item, index) => (
            item.type === "link" ? (
              <Link
                key={index}
                href={item.href}
                className={`block py-3 px-4 rounded-lg font-medium transition ${
                  isNavActive(item)
                    ? "text-[#1F7A5C] bg-[#ECF8F2] border-l-4 border-[#1F7A5C]"
                    : "text-gray-700 hover:text-[#1F7A5C] hover:bg-gray-50"
                }`}
                onClick={() => setMobileMenuOpen(false)}
                data-testid={`nav-mobile-${item.label.toLowerCase().replace(' ', '-')}`}
              >
                {item.label}
              </Link>
            ) : (
              <button
                key={index}
                onClick={() => handleNavigation(item.target)}
                className={`block w-full text-left py-3 px-4 rounded-lg font-medium transition ${
                  isNavActive(item)
                    ? "text-[#1F7A5C] bg-[#ECF8F2] border-l-4 border-[#1F7A5C]"
                    : "text-gray-700 hover:text-[#1F7A5C] hover:bg-gray-50"
                }`}
                data-testid={`nav-mobile-${item.label.toLowerCase().replace(' ', '-')}`}
              >
                {item.label}
              </button>
            )
          ))}
        </nav>
      )}
    </header>
  );
}
