import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'sr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    
    // Hero Section
    'hero.brand': 'NutriHub',
    'hero.title': 'Transform Your Health With Expert Nutrition',
    'hero.subtitle': 'Personalized nutrition plans designed to help you achieve optimal health, increased energy, and lasting wellness through science-backed dietary strategies.',
    'hero.cta': 'Start Your Journey',
    'hero.cta2': 'Learn More',
    'hero.trust1': '500+ Satisfied Clients',
    'hero.trust2': '10+ Years Experience', 
    'hero.trust3': 'Certified Expert',
    
    // About Section
    'about.subtitle': 'ABOUT ME',
    'about.title': 'Professional Nutritionist With a Passion for Healthy Living',
    'about.description1': "I'm a certified nutritionist with a Master's degree in Nutrition Science and over 10 years of experience helping clients transform their health through personalized nutrition plans.",
    'about.description2': 'My approach combines scientific knowledge with practical, sustainable solutions that fit your lifestyle. I believe that nutrition should be enjoyable, not restrictive, and that small, consistent changes lead to remarkable results.',
    'about.cta': 'Book a Consultation',
    
    // Process Section
    'process.subtitle': 'OUR PROCESS',
    'process.title': 'How We Create Your Nutrition Plan',
    'process.description': 'My personalized approach ensures that your nutrition plan is as unique as you are, designed to fit your lifestyle and help you achieve your goals.',
    
    // Services Section
    'services.subtitle': 'OUR SERVICES',
    'services.title': 'Nutrition Services Tailored to Your Needs',
    'services.description': 'Discover our comprehensive range of nutrition services designed to help you achieve your health and wellness goals.',
    
    // Quiz Section
    'quiz.subtitle': 'PERSONALIZED NUTRITION',
    'quiz.title': 'Discover Your Optimal Nutrition Plan',
    'quiz.description': 'Take our quick quiz to receive personalized nutrition recommendations based on your goals, preferences, and lifestyle.',
    'quiz.ready.title': 'Ready to Find Your Perfect Nutrition Plan?',
    'quiz.ready.description': 'Answer 5 quick questions about your goals and preferences, and we\'ll provide personalized nutrition recommendations designed specifically for you.',
    'quiz.start': 'Start Quiz',
    
    'process.step1.title': 'Comprehensive Assessment',
    'process.step1.description': 'We begin with a thorough evaluation of your current health status, medical history, lifestyle habits, food preferences, and specific goals.',
    'process.step2.title': 'Personalized Plan Creation',
    'process.step2.description': 'Using the information gathered, I develop a customized nutrition plan that aligns with your objectives while considering your preferences and lifestyle.',
    'process.step3.title': 'Implementation & Support',
    'process.step3.description': 'I provide ongoing guidance and support to ensure successful implementation of your nutrition plan with regular adjustments as needed.',
    'process.cta': 'Start Your Nutrition Journey',
    
    // Pricing Section
    'pricing.subtitle': 'NUTRITION PLANS',
    'pricing.title': 'Choose Your Path to Better Health',
    'pricing.description': 'We offer personalized nutrition plans designed to meet your specific health goals, dietary preferences, and lifestyle needs.',
    'pricing.plan1.title': 'Essential Plan',
    'pricing.plan1.description': 'Perfect for individuals starting their nutrition journey.',
    'pricing.plan2.title': 'Premium Plan',
    'pricing.plan2.description': 'Comprehensive support for optimal nutrition and wellness.',
    'pricing.plan3.title': 'Ultimate Plan',
    'pricing.plan3.description': 'The gold standard for those seeking transformative results.',
    'pricing.cta': 'Get Started',
    'pricing.popular': 'MOST POPULAR',
    
    // Quiz Section
    'quiz.subtitle': 'PERSONALIZED NUTRITION',
    'quiz.title': 'Discover Your Optimal Nutrition Plan',
    'quiz.description': 'Take our quick quiz to receive personalized nutrition recommendations based on your goals, preferences, and lifestyle.',
    'quiz.start': 'Start Quiz',
    'quiz.next': 'Next',
    'quiz.previous': 'Previous',
    'quiz.results': 'See Results',
    'quiz.retake': 'Retake Quiz',
    
    // Contact Section
    'contact.subtitle': 'GET IN TOUCH',
    'contact.title': 'Ready to Transform Your Health?',
    'contact.description': "Let's discuss your nutrition goals and create a personalized plan that works for your lifestyle.",
    'contact.form.name': 'Your Name',
    'contact.form.email': 'Your Email',
    'contact.form.subject': 'Subject',
    'contact.form.message': 'Your Message',
    'contact.form.privacy': 'I agree to the privacy policy',
    'contact.form.submit': 'Send Message',
    
    // BMI Calculator
    'bmi.subtitle': 'HEALTH ASSESSMENT',
    'bmi.title': 'Calculate Your BMI',
    'bmi.description': 'Get a quick assessment of your body mass index and understand what it means for your health.',
    'bmi.weight': 'Weight',
    'bmi.height': 'Height',
    'bmi.age': 'Age',
    'bmi.gender': 'Gender',
    'bmi.male': 'Male',
    'bmi.female': 'Female',
    'bmi.calculate': 'Calculate BMI',
    
    // Contact Section
    'contact.subtitle': 'GET IN TOUCH',
    'contact.title': 'Contact Me',
    'contact.description': 'Have questions or ready to start your nutrition journey? Reach out to me for a consultation or to book an appointment.',
    'contact.form.title': 'Send a Message',
    'contact.info.title': 'Contact Information',
    
    // Footer
    'footer.tagline': 'Professional nutritionist committed to helping you achieve optimal health through personalized nutrition plans.',
    'footer.quicklinks': 'Quick Links',
    'footer.services': 'Services',
    'footer.newsletter': 'Subscribe to Newsletter',
    'footer.newsletter.description': 'Stay updated with the latest nutrition tips, recipes, and wellness advice.',
    'footer.subscribe': 'Subscribe',
    
    // Videos & Podcasts
    'videos.subtitle': 'NUTRITION VIDEOS',
    'videos.title': 'Watch Valuable Nutrition Content',
    'videos.description': 'Explore our video library filled with practical advice, cooking demonstrations, and nutritional insights.',
    'podcasts.subtitle': 'NUTRITION PODCASTS',
    'podcasts.title': 'Listen to Expert Nutrition Advice',
    'podcasts.description': 'Tune into our podcasts for the latest nutrition insights and expert interviews.',
    
    // Testimonials
    'testimonials.subtitle': 'TESTIMONIALS',
    'testimonials.title': 'What Our Clients Say',
    'testimonials.description': 'Real stories from people who transformed their health with our nutrition programs.',
    
    // Blog
    'blog.subtitle': 'NUTRITION BLOG',
    'blog.title': 'Latest Nutrition Insights',
    'blog.description': 'Stay updated with the latest nutrition science, healthy recipes, and wellness tips.',
    'blog.readMore': 'Read More',
    'blog.allPosts': 'All Posts',
    
    // Common
    'common.learnMore': 'Learn More',
    'common.getStarted': 'Get Started',
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
  },
  sr: {
    // Navigation
    'nav.home': 'Početna',
    'nav.about': 'O meni',
    'nav.services': 'Usluge',
    'nav.blog': 'Blog',
    'nav.contact': 'Kontakt',
    
    // Hero Section
    'hero.brand': 'NutriHub',
    'hero.title': 'Vaše Zdravlje Je Naša Misija',
    'hero.subtitle': 'Stručni nutricionista sa preko 10 godina iskustva u kreiranju personalizovanih planova ishrane za optimalno zdravlje i dugotrajan wellness.',
    'hero.cta': 'Zakažite Konsultaciju',
    'hero.cta2': 'Saznajte Više',
    'hero.trust1': '500+ Zadovoljnih Klijenata',
    'hero.trust2': '10+ Godina Iskustva',
    'hero.trust3': 'Sertifikovani Stručnjak',
    
    // About Section
    'about.subtitle': 'O MENI',
    'about.title': 'Profesionalni Nutricionista Sa Strašću Za Zdrav Život',
    'about.description1': 'Ja sam sertifikovani nutricionista sa magistarskim stepenom iz nauke o ishrani i preko 10 godina iskustva u pomaganju klijentima da transformišu svoje zdravlje kroz personalizovane planove ishrane.',
    'about.description2': 'Moj pristup kombinuje naučno znanje sa praktičnim, održivim rešenjima koja odgovaraju vašem životnom stilu. Verujem da ishrana treba da bude prijatna, a ne ograničavajuća, i da male, dosledne promene vode do izuzetnih rezultata.',
    'about.cta': 'Zakažite Konsultaciju',
    
    // Process Section
    'process.subtitle': 'NAŠ PROCES',
    'process.title': 'Kako Kreiramo Vaš Plan Ishrane',
    'process.description': 'Moj personalizovani pristup osigurava da vaš plan ishrane bude jedinstven kao što ste vi, dizajniran da odgovara vašem životnom stilu i pomogne vam da postignete svoje ciljeve.',
    'process.step1.title': 'Sveobuhvatna Procena',
    'process.step1.description': 'Počinjemo temeljnim evaluiranjem vašeg trenutnog zdravstvenog stanja, medicinske istorije, životnih navika, prehrambenih preferencija i specifičnih ciljeva.',
    'process.step2.title': 'Kreiranje Personalizovanog Plana',
    'process.step2.description': 'Koristeći prikupljene informacije, razvijam prilagođeni plan ishrane koji se usklađuje sa vašim ciljevima, uzimajući u obzir vaše preferencije i životni stil.',
    'process.step3.title': 'Implementacija i Podrška',
    'process.step3.description': 'Pružam kontinuirano vođenje i podršku kako bih osigurao uspešnu implementaciju vašeg plana ishrane sa redovnim prilagođavanjima prema potrebi.',
    'process.cta': 'Počnite Svoje Nutritivno Putovanje',
    
    // Pricing Section
    'pricing.subtitle': 'PLANOVI ISHRANE',
    'pricing.title': 'Odaberite Svoj Put Ka Boljem Zdravlju',
    'pricing.description': 'Nudimo personalizovane planove ishrane dizajnirane da zadovolje vaše specifične zdravstvene ciljeve, dijetetske preferencije i potrebe životnog stila.',
    'pricing.plan1.title': 'Osnovni Plan',
    'pricing.plan1.description': 'Savršen za pojedince koji počinju svoje putovanje sa ishranom.',
    'pricing.plan2.title': 'Premium Plan',
    'pricing.plan2.description': 'Sveobuhvatna podrška za optimalnu ishranu i blagostanje.',
    'pricing.plan3.title': 'Ultimativni Plan',
    'pricing.plan3.description': 'Zlatni standard za one koji traže transformativne rezultate.',
    'pricing.cta': 'Počnite',
    'pricing.popular': 'NAJPOPULARNIJI',
    
    // Quiz Section
    'quiz.subtitle': 'PERSONALIZOVANA ISHRANA',
    'quiz.title': 'Otkrijte Svoj Optimalan Plan Ishrane',
    'quiz.description': 'Uradite naš brzi kviz da biste dobili personalizovane preporuke za ishranu na osnovu vaših ciljeva, preferencija i životnog stila.',
    'quiz.start': 'Počnite Kviz',
    'quiz.next': 'Sledeće',
    'quiz.previous': 'Prethodno',
    'quiz.results': 'Pogledajte Rezultate',
    'quiz.retake': 'Ponovite Kviz',
    
    // Contact Section
    'contact.subtitle': 'STUPITE U KONTAKT',
    'contact.title': 'Spremni da Transformišete Svoje Zdravlje?',
    'contact.description': 'Hajde da razgovaramo o vašim ciljevima ishrane i kreiramo personalizovan plan koji funkcioniše za vaš životni stil.',
    'contact.form.name': 'Vaše Ime',
    'contact.form.email': 'Vaš Email',
    'contact.form.subject': 'Tema',
    'contact.form.message': 'Vaša Poruka',
    'contact.form.privacy': 'Slažem se sa pravilima privatnosti',
    'contact.form.submit': 'Pošaljite Poruku',
    
    // BMI Calculator
    'bmi.subtitle': 'PROCENA ZDRAVLJA',
    'bmi.title': 'Izračunajte Svoj BMI',
    'bmi.description': 'Dobijte brzu procenu vašeg indeksa telesne mase i razumejte šta to znači za vaše zdravlje.',
    'bmi.weight': 'Težina',
    'bmi.height': 'Visina',
    'bmi.age': 'Godine',
    'bmi.gender': 'Pol',
    'bmi.male': 'Muški',
    'bmi.female': 'Ženski',
    'bmi.calculate': 'Izračunaj BMI',
    
    // Services
    'services.subtitle': 'NAŠE USLUGE',
    'services.title': 'Profesionalne Usluge Ishrane',
    'services.description': 'Sveobuhvatna rešenja ishrane prilagođena vašim individualnim potrebama i zdravstvenim ciljevima.',
    
    // Videos & Podcasts
    'videos.subtitle': 'VIDEO SADRŽAJI',
    'videos.title': 'Gledajte Vredne Sadržaje o Ishrani',
    'videos.description': 'Istražite našu video biblioteku punu praktičnih saveta, demonstracija kuvanja i nutritivnih uvida.',
    'podcasts.subtitle': 'PODKASTI O ISHRANI',
    'podcasts.title': 'Slušajte Stručne Savete o Ishrani',
    'podcasts.description': 'Uključite se u naše podkaste za najnovije uvide o ishrani i intervjue sa stručnjacima.',
    
    // Testimonials
    'testimonials.subtitle': 'UTISCI KLIJENATA',
    'testimonials.title': 'Šta Naši Klijenti Kažu',
    'testimonials.description': 'Istinite priče ljudi koji su transformisali svoje zdravlje uz naše programe ishrane.',
    
    // Blog
    'blog.subtitle': 'BLOG O ISHRANI',
    'blog.title': 'Najnoviji Uvidi o Ishrani',
    'blog.description': 'Budite u toku sa najnovijom naukom o ishrani, zdravim receptima i savetima za wellness.',
    'blog.readMore': 'Pročitajte Više',
    'blog.allPosts': 'Svi Članci',
    
    // Common
    'common.learnMore': 'Saznajte Više',
    'common.getStarted': 'Počnite',
    'common.loading': 'Učitavanje...',
    'common.error': 'Došlo je do greške',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};