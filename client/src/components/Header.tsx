import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      
      // Update active section based on scroll position
      const sections = ["home", "pricing", "testimonials", "contact"];
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

  const navLinks = [
    { label: "Početna", target: "home", type: "scroll" },
    { label: "O meni", href: "/about", type: "link" },
    { label: "Usluge", target: "pricing", type: "scroll" },
    { label: "Recenzije", target: "testimonials", type: "scroll" },
    { label: "Kontakt", target: "contact", type: "scroll" },
  ];

  const isActive = (item: typeof navLinks[0]) => {
    if (item.type === "link") {
      return location === item.href;
    }
    return location === "/" && activeSection === item.target;
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white ${isScrolled ? "shadow-md" : ""} transition-shadow duration-300`}
    >
      <div className="container mx-auto px-4 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center" onClick={() => handleNavigation('home')}>
            <span className="text-[#1F7A5C] text-2xl font-bold">
              NutriKlub
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-10">
          {navLinks.map((item, index) => (
            item.type === "link" ? (
              <Link
                key={index}
                href={item.href!}
                className={`relative font-medium transition py-2 ${
                  isActive(item) 
                    ? "text-[#1F7A5C]" 
                    : "text-gray-700 hover:text-[#1F7A5C]"
                }`}
                data-testid={`nav-link-${item.label.toLowerCase().replace(' ', '-')}`}
              >
                {item.label}
                {isActive(item) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1F7A5C] rounded-full" />
                )}
              </Link>
            ) : (
              <button
                key={index}
                onClick={() => handleNavigation(item.target!)}
                className={`relative font-medium transition py-2 ${
                  isActive(item)
                    ? "text-[#1F7A5C]"
                    : "text-gray-700 hover:text-[#1F7A5C]"
                }`}
                data-testid={`nav-link-${item.label.toLowerCase().replace(' ', '-')}`}
              >
                {item.label}
                {isActive(item) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1F7A5C] rounded-full" />
                )}
              </button>
            )
          ))}
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="text-gray-700 focus:outline-none p-2"
            data-testid="button-mobile-menu"
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
        <nav className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg py-4 px-6 space-y-2 border-t border-gray-100">
          {navLinks.map((item, index) => (
            item.type === "link" ? (
              <Link
                key={index}
                href={item.href!}
                className={`block py-3 px-4 rounded-lg font-medium transition ${
                  isActive(item)
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
                onClick={() => handleNavigation(item.target!)}
                className={`block w-full text-left py-3 px-4 rounded-lg font-medium transition ${
                  isActive(item)
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
