import { createContext, useContext, ReactNode } from "react";

const translations = {
  // Navigacija
  'nav.home': 'Početna',
  'nav.about': 'O Meni',
  'nav.services': 'Usluge',
  'nav.blog': 'Blog',
  'nav.contact': 'Kontakt',

  // Hero sekcija
  'hero.brand': 'Jelena Matijaš',
  'hero.title': 'Vaš Put ka Zdravijoj Ishrani Počinje Ovde',
  'hero.subtitle': 'Sertifikovani nutricionista sa 5+ godina iskustva u kreiranju personalizovanih planova ishrane koji donose trajne rezultate.',
  'hero.cta': 'Zakaži Besplatnu Konsultaciju',
  'hero.cta2': 'Izračunaj BMI',

  // O meni sekcija
  'about.subtitle': 'O MENI',
  'about.title': 'Jelena Matijaš - Vaš Partner u Zdravlju',
  'about.description': 'Sa magistarskim diplomom iz nutritivnih nauka i 5+ godina iskustva, pomažem ljudima da pronađu ravnotežu između ukusne hrane i zdravog načina života.',
  'about.description1': 'Magistar sam nutritivnih nauka sa preko 5 godina iskustva u radu sa klijentima različitih profila. Moja misija je da pomognem ljudima da transformišu svoj odnos prema hrani i stvore zdrave navike koje traju ceo život.',
  'about.description2': 'Verujem u holistički pristup ishrani koji uzima u obzir ne samo ono što jedete, već i kako se osećate, kakav je vaš životni ritam i koji su vaši lični ciljevi. Zajedno ćemo kreirati plan koji je održiv, ukusan i prilagođen baš vama.',

  // Usluge sekcija
  'services.subtitle': 'USLUGE',
  'services.title': 'Personalizovane Usluge za Vaše Potrebe',
  'services.description': 'Nudim sveobuhvatan pristup ishrani kroz različite usluge prilagođene vašim životnim potrebama i ciljevima.',

  // Proces sekcija
  'process.subtitle': 'PROCES',
  'process.title': 'Kako Funkcioniše Moj Pristup',
  'process.description': 'Moj proces rada je sistematičan i individualizovan, osmišljen da vam pruži najbolje rezultate kroz jasno definisane korake.',

  // BMI sekcija
  'bmi.title': 'BMI Kalkulator & Analiza Zdravstvenog Statusa',
  'bmi.description': 'Izračunajte svoj Indeks Telesne Mase (BMI) kao početnu tačku za razumevanje vašeg zdravstvenog statusa.',
  'bmi.calculator.title': 'Izračunajte Svoj BMI',
  'bmi.categories': 'BMI Kategorije',
  'bmi.calculate': 'Izračunaj BMI',
  'bmi.weight': 'Težina',
  'bmi.height': 'Visina',
  'bmi.age': 'Godine',
  'bmi.gender': 'Pol',
  'bmi.male': 'Muški',
  'bmi.female': 'Ženski',

  // Kviz sekcija
  'quiz.subtitle': 'KVIZ O ISHRANI',
  'quiz.title': 'Testirajte Svoje Znanje o Ishrani',
  'quiz.description': 'Pройдите naš interaktivni kviz i saznajte koliko znate o zdravoj ishrani. Dobićete personalizovane preporuke na osnovu odgovora.',
  'quiz.start': 'Započni Kviz',

  // Iskustva sekcija
  'testimonials.subtitle': 'USPEŠNE PRIČE',
  'testimonials.title': 'Šta Kažu Moji Klijenti',
  'testimonials.description': 'Pročitajte iskustva ljudi koji su uz moju pomoć transformisali svoj način ishrane.',

  // Blog sekcija
  'blog.subtitle': 'BLOG O ISHRANI',
  'blog.title': 'Recepti, Saveti i Najnovosti',
  'blog.description': 'Pratite moj blog za najnovije članke o zdravoj ishrani, ukusne i nutritivne recepte.',

  // Društvene mreže sekcija
  'social.subtitle': 'DRUŠTVENE MREŽE',
  'social.title': 'Pratite Me za Dnevnu Motivaciju',
  'social.description': 'Budite deo naše zajednice na Instagramu i TikToku.',
  'social.instagram': 'Instagram Sadržaj',
  'social.tiktok': 'TikTok Videi',
  'social.follow': 'Pratite na Instagramu',

  // Kontakt sekcija
  'contact.subtitle': 'KONTAKT',
  'contact.title': 'Spremni za Promenu?',
  'contact.description': 'Kontaktirajte me danas i započnimo zajedno putovanje ka vašem boljem zdravlju.',
  'contact.form.title': 'Pošaljite Poruku',
  'contact.info.title': 'Kontakt Informacije',

  // Footer
  'footer.tagline': 'Sertifikovani nutricionista posvećen vašem zdravlju.',
  'footer.quicklinks': 'Brze Veze',
  'footer.services': 'Usluge',
  'footer.newsletter': 'Newsletter',
  'footer.newsletter.description': 'Prijavite se za mesečni newsletter sa savetima o ishrani.',
  'footer.subscribe': 'Prijavite se',

  // Pricing sekcija
  'pricing.subtitle': 'PAKETI',
  'pricing.title': 'Na koji način možemo raditi zajedno?',
  'pricing.description': 'Bilo da želiš lagani početak ili potpunu transformaciju — izaberi plan koji ti trenutno najviše odgovara.',
  'pricing.basic': 'Osnovni',
  'pricing.premium': 'Premium',
  'pricing.vip': 'VIP',
  'pricing.popular': 'Najpopularniji',
  'pricing.contact': 'Kontaktiraj',
  'pricing.choose': 'Izaberi Plan',

  // Dugmad i linkovi
  'button.learn_more': 'Saznaj Više',
  'button.read_more': 'Čitaj Više',
  'button.view_all': 'Prikaži Sve',
  'button.contact_us': 'Kontaktiraj Nas',
  'button.get_started': 'Počni Odmah',
  'button.book_consultation': 'Zakaži Konsultaciju',
  'button.download': 'Preuzmi',
  'button.play': 'Reprodukuj',
  'button.pause': 'Pauza',
  'button.next': 'Sledeće',
  'button.previous': 'Prethodno',
  'button.close': 'Zatvori',
  'button.submit': 'Pošalji',
  'button.subscribe': 'Pretplati se',

  // Forma labeli
  'form.name': 'Ime',
  'form.email': 'Email',
  'form.subject': 'Naslov',
  'form.message': 'Poruka',
  'form.phone': 'Telefon',
  'form.required': 'Obavezno polje',
  'form.sending': 'Šalje se...',
  'form.sent': 'Poslato!',
  'form.error': 'Greška prilikom slanja',

  // Ostalo
  'loading': 'Učitava...',
  'error': 'Greška',
  'success': 'Uspešno',
  'welcome': 'Dobrodošli',
  'thank_you': 'Hvala vam',
  'read_more': 'Čitaj više',
  'view_all': 'Pogledaj sve',
  'coming_soon': 'Uskoro',
};

interface LanguageContextType {
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const t = (key: string): string => {
    return (translations as any)[key] || key;
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