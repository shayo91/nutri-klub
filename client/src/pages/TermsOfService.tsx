import { motion } from "framer-motion";
import { useEffect } from "react";

export default function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8"
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Uslovi Korišćenja</h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                Poslednji put ažurirano: {new Date().toLocaleDateString('sr-RS')}
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Prihvatanje Uslova</h2>
              <p className="mb-6">
                Pristupanjem i korišćenjem usluga nutricioniste Jelene Matijaš, slažete se sa ovim 
                Uslovima korišćenja. Ako se ne slažete sa bilo kojim delom ovih uslova, 
                molimo vas da ne koristite naše usluge.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Opis Usluga</h2>
              <p className="mb-4">Naše usluge uključuju:</p>
              <ul className="list-disc list-inside mb-6 space-y-2">
                <li>Personalizovane planove ishrane</li>
                <li>Nutritivne konsultacije</li>
                <li>Edukativne materijale o zdravoj ishrani</li>
                <li>Praćenje napretka i podrška</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Odgovornost Korisnika</h2>
              <p className="mb-4">Kao korisnik, obavezujete se da ćete:</p>
              <ul className="list-disc list-inside mb-6 space-y-2">
                <li>Pružiti tačne i potpune informacije o svom zdravstvenom stanju</li>
                <li>Konsultovati se sa lekarom pre početka bilo kojeg programa ishrane</li>
                <li>Koristiti usluge u skladu sa datim instrukcijama</li>
                <li>Ne deliti lične planove ishrane sa trećim licima</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Medicinska Odgovornost</h2>
              <p className="mb-6">
                Nutritivni saveti ne zamenjuju medicinsku dijagnozu ili tretman. Uvek se 
                konsultujte sa kvalifikovanim lekarom pre donošenja važnih odluka o svojoj ishrani, 
                posebno ako imate postojeće zdravstvene probleme.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Plaćanje i Otkazivanje</h2>
              <p className="mb-6">
                Sve usluge se plaćaju unapred. Otkazivanje je moguće uz 24-satno obaveštenje. 
                Povraćaj sredstava se vrši u skladu sa našom politikom povraćaja.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Intelektualna Svojina</h2>
              <p className="mb-6">
                Sav sadržaj na ovom sajtu, uključujući planove ishrane, recepte i edukativne 
                materijale, zaštićen je autorskim pravima i pripada Jeleni Matijaš.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Ograničenje Odgovornosti</h2>
              <p className="mb-6">
                Jelena Matijaš neće biti odgovorna za bilo kakve direktne, indirektne ili 
                posledične štete nastale korišćenjem naših usluga.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Izmene Uslova</h2>
              <p className="mb-6">
                Zadržavamo pravo da menjamo ove Uslove korišćenja u bilo kom trenutku. 
                Izmene će biti objavljene na ovoj stranici.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Kontakt</h2>
              <p className="mb-6">
                Za sva pitanja u vezi sa ovim Uslovima korišćenja, kontaktirajte nas:
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