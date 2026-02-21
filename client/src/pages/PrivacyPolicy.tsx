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
        <title>Pravila Privatnosti | Nutricionista Jelena Matijaš</title>
        <meta name="description" content="Pravila privatnosti nutricioniste Jelene Matijaš. Saznajte kako prikupljamo, koristimo i štitimo vaše podatke." />
        <link rel="canonical" href="https://nutricionistajelena.ba/pravila-privatnosti" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Pravila Privatnosti</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Posljednji put ažurirano: {new Date().toLocaleDateString('bs-BA')}
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Koje podatke prikupljamo</h2>
            <p className="mb-8">
              Prikupljamo informacije koje nam sami dostavite putem narudžbe usluge, kontakt obrasca ili prijave na newsletter, uključujući ime i prezime, e-mail, broj telefona i podatke relevantne za plan ishrane. Podaci se prikupljaju isključivo uz vašu saglasnost ili radi izvršenja ugovornih obaveza.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Komentari i newsletter</h2>
            <p className="mb-4">
              <strong>Komentari:</strong> Prikupljamo podatke koje unesete u obrazac za komentare, uključujući IP adresu i podatke o pregledniku, radi zaštite od neželjene pošte. Nakon odobrenja, komentar postaje javan.
            </p>
            <p className="mb-8">
              <strong>Newsletter:</strong> Ako se prijavite, prikupljamo ime, prezime i e-mail. Svaki newsletter sadrži opciju odjave, kojom možete u svakom trenutku prestati primati obavijesti.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Mediji i ugrađeni sadržaj</h2>
            <p className="mb-6">
              Ako učitavate slike, uklonite podatke o lokaciji (EXIF GPS) radi zaštite privatnosti.
            </p>
            <p className="mb-8">
              Na stranici može biti ugrađeni sadržaj s drugih web stranica (video, slike, članci), koji može prikupljati podatke i koristiti kolačiće.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Dijeljenje podataka</h2>
            <p className="mb-8">
              Vaši podaci se ne dijele s trećim stranama, osim kada je to zakonski obavezno ili nužno za pružanje usluge (npr. tehnička podrška).
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Čuvanje podataka i vaša prava</h2>
            <p className="mb-6">
              Podaci se čuvaju koliko je potrebno za pružanje usluge ili dok ne zatražite njihovo brisanje. Komentari i metapodaci mogu se čuvati neodređeno radi identifikacije budućih komentara.
            </p>
            <p className="mb-8">
              Imate pravo na pristup, ispravku, brisanje ili izvoz svojih podataka, osim kada zakon nalaže njihovo čuvanje.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Kontakt</h2>
            <p className="mb-6">
              Za sva pitanja u vezi sa ovim Pravilima privatnosti, možete nas kontaktirati na:
              <br />
              Email: planishrane@nutricionistajelena.ba
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
