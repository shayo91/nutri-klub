import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";

export default function Header() {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white ${isScrolled ? "shadow-md" : ""} transition-shadow duration-300`}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="text-primary text-2xl font-bold font-poppins">
              NutriHub
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <a
            href="#home"
            className="font-medium text-primary hover:text-primary-dark transition"
          >
            {t("nav.home")}
          </a>
          <a
            href="#about"
            className="font-medium text-dark hover:text-primary transition"
          >
            {t("nav.about")}
          </a>
          <a
            href="#services"
            className="font-medium text-dark hover:text-primary transition"
          >
            {t("nav.services")}
          </a>
          <a
            href="#process"
            className="font-medium text-dark hover:text-primary transition"
          >
            Proces
          </a>
          <a
            href="#testimonials"
            className="font-medium text-dark hover:text-primary transition"
          >
            Recenzije
          </a>
          <a
            href="#blog"
            className="font-medium text-dark hover:text-primary transition"
          >
            {t("nav.blog")}
          </a>
          <a
            href="#contact"
            className="font-medium text-dark hover:text-primary transition"
          >
            {t("nav.contact")}
          </a>
        </nav>

        {/* Language Selector & Contact Info */}
        <div className="hidden lg:flex items-center space-x-6">
          {/* Add your language selector and contact info here */}
        </div>
      </div>
    </header>
  );
}
