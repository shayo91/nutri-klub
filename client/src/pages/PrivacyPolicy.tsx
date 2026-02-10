import { motion } from "framer-motion";
import { useEffect } from "react";
import { Helmet } from "react-helmet";

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-16">
        <Helmet>
          <title>Politika Privatnosti | Nutricionista Jelena Matijaš</title>
          <meta name="description" content="Politika privatnosti nutricioniste Jelene Matijaš. Saznajte kako štitimo vaše lične podatke i zdravstvene informacije." />
          <link rel="canonical" href="https://nutriputovanje.com/privacy" />
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8"
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Politika Privatnosti</h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                Poslednji put ažurirano: {new Date().toLocaleDateString('sr-RS')}
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Uvod</h2>
              <p className="mb-6">
                Jelena Matijaš, sertifikovani nutricionista, posvećena je zaštiti vaše privatnosti. 
                Ova Politika privatnosti objašnjava kako prikupljamo, koristimo i štitimo vaše lične 
                podatke kada koristite naše usluge i posetite naš veb-sajt.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Podaci koje prikupljamo</h2>
              <p className="mb-4">Prikupljamo sledeće vrste podataka:</p>
              <ul className="list-disc list-inside mb-6 space-y-2">
                <li>Lične informacije: ime, email adresa, broj telefona</li>
                <li>Zdravstveni podaci: informacije o ishrani, alergijama, zdravstvenom stanju</li>
                <li>Podaci o korišćenju sajta: IP adresa, browser informacije, stranice koje posetite</li>
                <li>Komunikacija: poruke koje nam šaljete preko kontakt forme</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Kako koristimo vaše podatke</h2>
              <p className="mb-4">Vaše podatke koristimo za:</p>
              <ul className="list-disc list-inside mb-6 space-y-2">
                <li>Pružanje personalizovanih nutritivnih saveta i planova ishrane</li>
                <li>Komunikaciju sa vama u vezi sa našim uslugama</li>
                <li>Poboljšanje kvaliteta naših usluga</li>
                <li>Poštovanje zakonskih obaveza</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Deljenje podataka</h2>
              <p className="mb-6">
                Ne prodajemo, ne iznajmljujemo niti delimo vaše lične podatke sa trećim stranama, 
                osim u slučajevima predviđenim zakonom ili uz vaš izričit pristanak.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Zaštita podataka</h2>
              <p className="mb-6">
                Koristimo odgovarajuće tehničke i organizacione mere za zaštitu vaših podataka 
                od neovlašćenog pristupa, izmene, otkrivanja ili uništavanja.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Vaša prava</h2>
              <p className="mb-4">Imate pravo da:</p>
              <ul className="list-disc list-inside mb-6 space-y-2">
                <li>Zatražite pristup svojim ličnim podacima</li>
                <li>Zatražite ispravku netačnih podataka</li>
                <li>Zatražite brisanje svojih podataka</li>
                <li>Povučete svoj pristanak za obradu podataka</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Kontakt</h2>
              <p className="mb-6">
                Za sva pitanja u vezi sa ovom Politikom privatnosti, možete nas kontaktirati na:
                <br />
                Email: jelena@nutricionista.rs
                <br />
                Telefon: +387 65 123 456
                <br />
                Adresa: Jovana Ducića 8, Banja Luka, Bosna i Hercegovina
              </p>
            </div>
          </motion.div>
        </div>
      </div>
  );
}