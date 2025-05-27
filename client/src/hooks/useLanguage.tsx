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
  'hero.title': 'Transformišite Svoje Zdravlje Uz Stručnu Nutricionistu',
  'hero.subtitle': 'Sertifikovani nutricionista sa preko 15 godina iskustva. Kreiram personalizovane planove ishrane koji se uklapaju u vaš život i pomažu vam da postignete trajne rezultate kroz naučno zasnovane pristupe.',
  'hero.cta': 'Zakažite Konsultaciju',
  'hero.cta2': 'Saznajte Više',
  
  // O meni sekcija
  'about.subtitle': 'O MENI',
  'about.title': 'Jelena Matijaš - Vaš Partner u Zdravlju',
  'about.cta': 'Zakažite Konsultaciju',
  
  // Proces sekcija
  'process.subtitle': 'NAŠ PROCES',
  'process.title': 'Kako Kreiramo Vaš Plan Ishrane',
  'process.description': 'Moj personalizovani pristup osigurava da vaš plan ishrane bude jedinstven kao što ste vi, dizajniran da odgovara vašem načinu života i pomogne vam da postignete svoje ciljeve kroz održive promene.',
  
  // Usluge sekcija
  'services.subtitle': 'NAŠE USLUGE',
  'services.title': 'Kompletan Spektar Usluga Ishrane',
  'services.description': 'Od personalizovanih planova ishrane do grupnih radionica - otkrijte kako mogu da vam pomognem da postignete optimalno zdravlje kroz pravilnu ishranu.',
  
  // Kviz sekcija
  'quiz.subtitle': 'PERSONALIZOVANA ISHRANA',
  'quiz.title': 'Otkrijte Svoj Idealan Plan Ishrane',
  'quiz.description': 'Uradite naš detaljni kviz da biste dobili personalizovane preporuke zasnovane na vašim zdravstvenim ciljevima, životnim navikama i preferencijama u ishrani.',
  'quiz.ready.title': 'Spremni da pronađete plan ishrane koji vam odgovara?',
  'quiz.ready.description': 'Kroz nekoliko jednostavnih pitanja ću analizirati vaše potrebe i kreirati preporuke koje će vam pomoći da ostvarite željene rezultate na zdrav i održiv način.',
  'quiz.start': 'Započni Kviz',
  
  // BMI sekcija
  'bmi.subtitle': 'ANALIZA ZDRAVLJA',
  'bmi.title': 'BMI Kalkulator & Analiza Zdravstvenog Statusa',
  'bmi.description': 'Izračunajte svoj Indeks Telesne Mase (BMI) kao početnu tačku za razumevanje vašeg zdravstvenog statusa. Važno je napomenuti da BMI treba posmatrati uz druge faktore za kompletnu sliku.',
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
  'videos.subtitle': 'EDUKATIVNI SADRŽAJ',
  'videos.title': 'Naučite Kroz Video Materijale',
  'videos.description': 'Pristupite mojoj kolekciji edukativnih video materijala koji pokrivaju sve aspekte zdrave ishrane - od osnovnih principa do naprednih tehnika pripreme obroka.',
  
  // Podcast sekcija
  'podcasts.subtitle': 'AUDIO SADRŽAJ',
  'podcasts.title': 'Slušajte Ekspertske Savete o Ishrani',
  'podcasts.description': 'Poslušajte moje podkaste gde delim najnovija saznanja iz oblasti ishrane, intervjue sa kolegama i praktične savete koje možete primeniti već danas.',
  
  // Iskustva sekcija
  'testimonials.subtitle': 'USPEŠNE PRIČE',
  'testimonials.title': 'Šta Kažu Moji Klijenti',
  'testimonials.description': 'Pročitajte iskustva ljudi koji su uz moju pomoć transformisali svoj način ishrane i kvalitet života. Njihove priče su najbolji dokaz efikasnosti našeg pristupa.',
  
  // Blog sekcija
  'blog.subtitle': 'BLOG O ISHRANI',
  'blog.title': 'Recepti, Saveti i Najnovosti',
  'blog.description': 'Pratite moj blog za najnovije članke o zdravoj ishrani, ukusne i nutritivne recepte, kao i savete koji će vam pomoći da održite zdravu lifestyle.',
  
  // Društvene mreže sekcija
  'social.subtitle': 'DRUŠTVENE MREŽE',
  'social.title': 'Pratite Me za Dnevnu Motivaciju',
  'social.description': 'Budite deo naše zajednice na Instagramu i TikToku gde svakodnevno delim kratke savete, recepte, motivaciju i odgovore na česta pitanja o ishrani.',
  'social.instagram': 'Instagram Sadržaj',
  'social.tiktok': 'TikTok Videi',
  'social.follow': 'Pratite na Instagramu',
  
  // Kontakt sekcija
  'contact.subtitle': 'KONTAKT',
  'contact.title': 'Spremni za Promenu?',
  'contact.description': 'Kontaktirajte me danas i započnimo zajedno putovanje ka vašem boljem zdravlju. Dostupna sam za konsultacije, pitanja i zakazivanje termina.',
  'contact.form.title': 'Pošaljite Poruku',
  'contact.info.title': 'Kontakt Informacije',
  
  // Footer
  'footer.tagline': 'Sertifikovani nutricionista posvećen vašem zdravlju. Kroz individualni pristup i naučno zasnovane metode pomažem vam da postignete trajne rezultate.',
  'footer.quicklinks': 'Brze Veze',
  'footer.services': 'Usluge',
  'footer.newsletter': 'Newsletter',
  'footer.newsletter.description': 'Prijavite se za mesečni newsletter sa savetima o ishrani, sezonskim receptima i ekskluzivnim ponudama.',
  'footer.subscribe': 'Prijavite se',
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