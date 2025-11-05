import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";

export default function Header() {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location, setLocation] = useLocation();

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

  const handleNavigation = (target: string) => {
    if (location !== "/") {
      // If not on home page, navigate to home first, then scroll
      setLocation("/");
      setTimeout(() => {
        const element = document.getElementById(target);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // If on home page, just scroll
      const element = document.getElementById(target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white ${isScrolled ? "shadow-md" : ""} transition-shadow duration-300`}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center" onClick={() => handleNavigation('home')}>
            <span className="text-primary text-2xl font-bold font-poppins">
              NutriKlub
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <button
            onClick={() => handleNavigation('home')}
            className="font-medium text-primary hover:text-primary-dark transition"
          >
            {t("nav.home")}
          </button>
          <button
            onClick={() => handleNavigation('services')}
            className="font-medium text-dark hover:text-primary transition"
          >
            {t("nav.services")}
          </button>
          <Link href="/testimonials" className="font-medium text-dark hover:text-primary transition">
            Šta kažu ljudi?
          </Link>
          <button
            onClick={() => handleNavigation('testimonials')}
            className="font-medium text-dark hover:text-primary transition"
          >
            Recenzije
          </button>
          <button
            onClick={() => handleNavigation('blog')}
            className="font-medium text-dark hover:text-primary transition"
          >
            {t("nav.blog")}
          </button>
          <button
            onClick={() => handleNavigation('contact')}
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
            <button onClick={() => handleNavigation('home')} className="block w-full text-left py-2 text-gray-700 hover:text-primary transition font-medium">
              {t("nav.home")}
            </button>
            <button onClick={() => handleNavigation('services')} className="block w-full text-left py-2 text-gray-700 hover:text-primary transition font-medium">
              {t("nav.services")}
            </button>
            <Link href="/testimonials" className="block w-full text-left py-2 text-gray-700 hover:text-primary transition font-medium" onClick={() => setMobileMenuOpen(false)}>
              Šta kažu ljudi?
            </Link>
            <button onClick={() => handleNavigation('testimonials')} className="block w-full text-left py-2 text-gray-700 hover:text-primary transition font-medium">
              Recenzije
            </button>
            <button onClick={() => handleNavigation('blog')} className="block w-full text-left py-2 text-gray-700 hover:text-primary transition font-medium">
              {t("nav.blog")}
            </button>
            <button onClick={() => handleNavigation('contact')} className="block w-full text-left py-2 text-gray-700 hover:text-primary transition font-medium">
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