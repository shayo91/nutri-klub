import { motion } from "framer-motion";
import { useEffect } from "react";
import { Helmet } from "react-helmet";

export default function CookiePolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <Helmet>
        <title>Pravila o Kolačićima | Nutricionista Jelena Matijaš</title>
        <meta name="description" content="Pravila o kolačićima nutricioniste Jelene Matijaš. Saznajte kako koristimo kolačiće za poboljšanje vašeg iskustva na sajtu." />
        <link rel="canonical" href="https://nutricionistajelena.ba/cookies" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Pravila o Kolačićima</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Posljednji put ažurirano: {new Date().toLocaleDateString('bs-BA')}
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Šta su kolačići</h2>
            <p className="mb-8">
              Kolačići su male tekstualne datoteke pohranjene na vaš uređaj, koje omogućavaju pravilno funkcionisanje stranice, sigurnost, bolje korisničko iskustvo i analizu korištenja stranice.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Kako ih koristimo</h2>
            <p className="mb-4">
              Koristimo kolačiće prve i treće strane za:
            </p>
            <ul className="list-disc list-inside mb-8 space-y-2">
              <li>Osnovno funkcionisanje stranice (ne prikupljaju lične podatke)</li>
              <li>Statistiku i analizu korištenja stranice</li>
              <li>Personalizovane oglase i sigurnost</li>
              <li>Funkcionalnosti poput video sadržaja ili društvenih mreža</li>
              <li>Pamćenje preferencija za bolje iskustvo posjete</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upravljanje kolačićima</h2>
            <p className="mb-8">
              Kolačiće možete kontrolisati ili obrisati putem postavki svog preglednika. Blokiranje određenih kolačića može ograničiti funkcionalnost stranice.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Kontakt</h2>
            <p className="mb-6">
              Za sva pitanja o našoj upotrebi kolačića, kontaktirajte nas:
              <br />
              Email: jelena@jelenamatijas.ba
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
