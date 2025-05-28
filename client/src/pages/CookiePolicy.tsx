import { motion } from "framer-motion";
import Layout from "@/components/Layout";

export default function CookiePolicy() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8"
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Politika Kolačića</h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                Poslednji put ažurirano: {new Date().toLocaleDateString('sr-RS')}
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Šta su kolačići?</h2>
              <p className="mb-6">
                Kolačići (cookies) su male tekstualne datoteke koje se čuvaju na vašem uređaju 
                kada posetite naš veb-sajt. Oni nam pomažu da sajt funkcioniše pravilno i 
                pružimo vam bolje korisničko iskustvo.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Koje vrste kolačića koristimo</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Neophodni kolačići</h3>
              <p className="mb-4">
                Ovi kolačići su potrebni za osnovno funkcionisanje sajta i ne mogu se onemogućiti. 
                Uključuju:
              </p>
              <ul className="list-disc list-inside mb-6 space-y-2">
                <li>Kolačići za sesiju koji omogućavaju navigaciju kroz sajt</li>
                <li>Bezbednosni kolačići koji štite od zloupotrebe</li>
                <li>Kolačići za čuvanje vaših podešavanja</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Funkcionalni kolačići</h3>
              <p className="mb-4">
                Ovi kolačići poboljšavaju funkcionalnost sajta:
              </p>
              <ul className="list-disc list-inside mb-6 space-y-2">
                <li>Pamćenje vašeg izbora jezika</li>
                <li>Čuvanje vaših preferencija</li>
                <li>Poboljšanje brzine učitavanja stranica</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Analitički kolačići</h3>
              <p className="mb-6">
                Ovi kolačići nam pomažu da razumemo kako koristite naš sajt i 
                poboljšimo ga na osnovu tih informacija. Svi podaci se prikupljaju anonimno.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Upravljanje kolačićima</h2>
              <p className="mb-4">
                Možete kontrolisati kolačiće na sledeće načine:
              </p>
              <ul className="list-disc list-inside mb-6 space-y-2">
                <li>Kroz podešavanja vašeg web browsera</li>
                <li>Koristeći naš banner za upravljanje kolačićima</li>
                <li>Brisanjem postojećih kolačića iz browsera</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Posledice onemogućavanja kolačića</h2>
              <p className="mb-6">
                Ako onemogućite kolačiće, neki delovi našeg sajta možda neće funkcionisati 
                pravilno. Možda nećete moći da se prijavite, čuvate podešavanja ili 
                koristite određene funkcionalnosti.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Kolačići trećih strana</h2>
              <p className="mb-6">
                Možemo koristiti usluge trećih strana (kao što su Google Analytics) 
                koje postavljaju svoje kolačiće. Ovi kolačići su regulisani 
                politikama privatnosti tih kompanija.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Ažuriranje politike</h2>
              <p className="mb-6">
                Možemo ažurirati ovu Politiku kolačića s vremena na vreme. 
                Sve izmene će biti objavljene na ovoj stranici sa novim datumom ažuriranja.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Kontakt</h2>
              <p className="mb-6">
                Za sva pitanja o našoj upotrebi kolačića, kontaktirajte nas:
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
    </Layout>
  );
}