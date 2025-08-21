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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false); // Close mobile menu after clicking a link
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white ${isScrolled ? "shadow-md" : ""} transition-shadow duration-300`}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>
            <span className="text-primary text-2xl font-bold font-poppins">
              NutriHub
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <button
            onClick={() => scrollToSection('home')}
            className="font-medium text-primary hover:text-primary-dark transition"
          >
            {t("nav.home")}
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="font-medium text-dark hover:text-primary transition"
          >
            {t("nav.about")}
          </button>
          <button
            onClick={() => scrollToSection('services')}
            className="font-medium text-dark hover:text-primary transition"
          >
            {t("nav.services")}
          </button>
          <button
            onClick={() => scrollToSection('process')}
            className="font-medium text-dark hover:text-primary transition"
          >
            Proces
          </button>
          <button
            onClick={() => scrollToSection('testimonials')}
            className="font-medium text-dark hover:text-primary transition"
          >
            Recenzije
          </button>
          <button
            onClick={() => scrollToSection('blog')}
            className="font-medium text-dark hover:text-primary transition"
          >
            {t("nav.blog")}
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="font-medium text-dark hover:text-primary transition"
          >
            {t("nav.contact")}
          </button>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="text-gray-700 focus:outline-none"
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

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md py-4 px-4 space-y-3">
            <button onClick={() => scrollToSection('home')} className="block w-full text-left py-2 text-gray-700 hover:text-primary transition font-medium">
              {t("nav.home")}
            </button>
            <button onClick={() => scrollToSection('about')} className="block w-full text-left py-2 text-gray-700 hover:text-primary transition font-medium">
              {t("nav.about")}
            </button>
            <button onClick={() => scrollToSection('services')} className="block w-full text-left py-2 text-gray-700 hover:text-primary transition font-medium">
              {t("nav.services")}
            </button>
            <button onClick={() => scrollToSection('process')} className="block w-full text-left py-2 text-gray-700 hover:text-primary transition font-medium">
              Proces
            </button>
            <button onClick={() => scrollToSection('testimonials')} className="block w-full text-left py-2 text-gray-700 hover:text-primary transition font-medium">
              Recenzije
            </button>
            <button onClick={() => scrollToSection('blog')} className="block w-full text-left py-2 text-gray-700 hover:text-primary transition font-medium">
              {t("nav.blog")}
            </button>
            <button onClick={() => scrollToSection('contact')} className="block w-full text-left py-2 text-gray-700 hover:text-primary transition font-medium">
              {t("nav.contact")}
            </button>
          </nav>
        )}

        {/* Language Selector & Contact Info */}
        <div className="hidden lg:flex items-center space-x-6">
          {/* Add your language selector and contact info here */}
        </div>
      </div>
    </header>
  );
}