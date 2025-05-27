import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";
import LanguageSelector from "./LanguageSelector";

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
    <header className={`sticky top-0 z-50 bg-white ${isScrolled ? 'shadow-md' : ''} transition-shadow duration-300`}>
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
          <a href="#home" className="font-medium text-primary hover:text-primary-dark transition">Home</a>
          <a href="#about" className="font-medium text-dark hover:text-primary transition">About</a>
          <a href="#services" className="font-medium text-dark hover:text-primary transition">Services</a>
          <a href="#process" className="font-medium text-dark hover:text-primary transition">Process</a>
          <a href="#testimonials" className="font-medium text-dark hover:text-primary transition">Testimonials</a>
          <a href="#blog" className="font-medium text-dark hover:text-primary transition">Blog</a>
          <a href="#contact" className="font-medium text-dark hover:text-primary transition">Contact</a>
        </nav>
        
        {/* Contact Info */}
        <div className="hidden lg:flex items-center space-x-2">
          <div className="rounded-full bg-secondary p-2">
            <i className="fas fa-phone text-primary"></i>
          </div>
          <div>
            <p className="text-sm text-gray-500">Free Consultation</p>
            <p className="font-medium">+123 456 7890</p>
          </div>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden focus:outline-none" 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <i className="fas fa-bars text-primary text-2xl"></i>
        </button>
      </div>
      
      {/* Mobile Navigation */}
      <nav className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-white px-4 py-3 shadow-inner`}>
        <div className="flex flex-col space-y-3">
          <a href="#home" className="font-medium text-primary hover:text-primary-dark transition" onClick={() => setMobileMenuOpen(false)}>Home</a>
          <a href="#about" className="font-medium text-dark hover:text-primary transition" onClick={() => setMobileMenuOpen(false)}>About</a>
          <a href="#services" className="font-medium text-dark hover:text-primary transition" onClick={() => setMobileMenuOpen(false)}>Services</a>
          <a href="#process" className="font-medium text-dark hover:text-primary transition" onClick={() => setMobileMenuOpen(false)}>Process</a>
          <a href="#testimonials" className="font-medium text-dark hover:text-primary transition" onClick={() => setMobileMenuOpen(false)}>Testimonials</a>
          <a href="#blog" className="font-medium text-dark hover:text-primary transition" onClick={() => setMobileMenuOpen(false)}>Blog</a>
          <a href="#contact" className="font-medium text-dark hover:text-primary transition" onClick={() => setMobileMenuOpen(false)}>Contact</a>
        </div>
      </nav>
    </header>
  );
}
