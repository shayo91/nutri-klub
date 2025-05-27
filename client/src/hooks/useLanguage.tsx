import { createContext, useContext, ReactNode } from 'react';

interface LanguageContextType {
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Svi tekstovi su sada na srpskom - samo jedan jezik
const translations = {
  // Navigacija
  'nav.home': 'Početna',
  'nav.about': 'O Meni',
  'nav.services': 'Usluge',
  'nav.blog': 'Blog',
  'nav.contact': 'Kontakt',
  
  // Hero sekcija
  'hero.brand': 'NutriHub',
  'hero.title': 'Vaše Zdravlje Je Naša Misija',
  'hero.subtitle': 'Stručni nutricionista sa preko 10 godina iskustva u kreiranju personalizovanih planova ishrane za optimalno zdravlje i dugotrajan wellness.',
  'hero.cta': 'Zakažite Konsultaciju',
  'hero.cta2': 'Saznajte Više',
  
  // O meni sekcija
  'about.subtitle': 'O MENI',
  'about.title': 'Profesionalni Nutricionista Sa Strašću Za Zdrav Život',
  'about.cta': 'Zakažite Konsultaciju',
  
  // Proces sekcija
  'process.subtitle': 'NAŠ PROCES',
  'process.title': 'Kako Kreiramo Vaš Plan Ishrane',
  'process.description': 'Moj personalizovani pristup osigurava da vaš plan ishrane bude jedinstven kao što ste vi, dizajniran da odgovara vašem načinu života i pomogne vam da postignete svoje ciljeve.',
  
  // Usluge sekcija
  'services.subtitle': 'NAŠE USLUGE',
  'services.title': 'Usluge Ishrane Prilagođene Vašim Potrebama',
  'services.description': 'Otkrijte naš sveobuhvatan spektar usluga ishrane dizajniran da vam pomogne da postignete svoje zdravstvene i wellness ciljeve.',
  
  // Kviz sekcija
  'quiz.subtitle': 'PERSONALIZOVANA ISHRANA',
  'quiz.title': 'Otkrijte Svoj Optimalni Plan Ishrane',
  'quiz.description': 'Uradite naš brzi kviz da biste dobili personalizovane preporuke za ishranu na osnovu vaših ciljeva, preferencija i načina života.',
  'quiz.ready.title': 'Spremni ste da pronađete savršen plan ishrane?',
  'quiz.ready.description': 'Odgovorite na 5 brzih pitanja o vašim ciljevima i preferencijama, a mi ćemo vam pružiti personalizovane preporuke za ishranu dizajnirane specijalno za vas.',
  'quiz.start': 'Započni Kviz',
  
  // BMI sekcija
  'bmi.subtitle': 'PROCENA ZDRAVLJA',
  'bmi.title': 'BMI Kalkulator i Zdravstvena Tabela',
  'bmi.description': 'Izračunajte svoj Indeks Telesne Mase (BMI) da biste dobili brzu procenu svog statusa težine. Zapamtite, BMI je samo jedan pokazatelj zdravlja i treba ga razmotriti uz druge faktore.',
  'bmi.calculator.title': 'Izračunajte Svoj BMI',
  'bmi.categories': 'BMI Kategorije',
  'bmi.calculate': 'Izračunaj BMI',
  'bmi.weight': 'Težina',
  'bmi.height': 'Visina',
  'bmi.age': 'Godine',
  'bmi.gender': 'Pol',
  'bmi.male': 'Muški',
  'bmi.female': 'Ženski',
  
  // Video sekcija
  'videos.subtitle': 'NUTRITIVNI VIDEI',
  'videos.title': 'Pogledajte Vredan Sadržaj o Ishrani',
  'videos.description': 'Istražite našu video biblioteku punu praktičnih saveta, demonstracija kuvanja i uvida u ishranu da vam pomognemo na vašem zdravstvenom putovanju.',
  
  // Podcast sekcija
  'podcasts.subtitle': 'NUTRITIVNI PODKASTI',
  'podcasts.title': 'Slušajte Stručne Savete o Ishrani',
  'podcasts.description': 'Uključite se u naše podkaste za najnovije uvide u ishranu, intervjue sa stručnjacima i praktične savete za poboljšanje vašeg zdravstvenog putovanja.',
  
  // Iskustva sekcija
  'testimonials.subtitle': 'ISKUSTVA',
  'testimonials.title': 'Šta Kažu Moji Klijenti',
  'testimonials.description': 'Pročitajte o iskustvima i rezultatima ljudi koji su transformisali svoje zdravlje i život kroz naše programe ishrane.',
  
  // Blog sekcija
  'blog.subtitle': 'BLOG O ISHRANI',
  'blog.title': 'Recepti i Saveti o Ishrani',
  'blog.description': 'Istražite našu kolekciju zdravih recepata, saveta o ishrani i wellness saveta da vam pomognemo na vašem putovanju ka boljem zdravlju.',
  
  // Društvene mreže sekcija
  'social.subtitle': 'DRUŠTVENE MREŽE',
  'social.title': 'Pratite Me za Dnevnu Inspiraciju',
  'social.description': 'Pridružite se našoj zajednici na Instagramu i TikToku za dnevne savete o ishrani, ideje za recepte i wellness motivaciju.',
  'social.instagram': 'Instagram Objave',
  'social.tiktok': 'TikTok Videi',
  'social.follow': 'Pratite na Instagram',
  
  // Kontakt sekcija
  'contact.subtitle': 'STUPITE U KONTAKT',
  'contact.title': 'Kontaktirajte Me',
  'contact.description': 'Imate pitanja ili ste spremni da počnete svoje putovanje u ishrani? Obratite mi se za konsultaciju ili da zakažete termin.',
  'contact.form.title': 'Pošaljite Poruku',
  'contact.info.title': 'Informacije za Kontakt',
  
  // Footer
  'footer.tagline': 'Profesionalni nutricionista posvećen tome da vam pomogne da postignete optimalno zdravlje kroz personalizovane planove ishrane.',
  'footer.quicklinks': 'Brze Veze',
  'footer.services': 'Usluge',
  'footer.newsletter': 'Pretplatite se na Newsletter',
  'footer.newsletter.description': 'Ostanite u toku sa najnovijim savetima o ishrani, receptima i wellness savetima.',
  'footer.subscribe': 'Pretplati se',
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const t = (key: string): string => {
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ t }}>
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