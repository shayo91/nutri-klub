import { motion } from "framer-motion";
import { useEffect } from "react";
import { Helmet } from "react-helmet";

export default function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <Helmet>
        <title>Uslovi Poslovanja | Nutricionista Jelena Matijaš</title>
        <meta name="description" content="Uslovi poslovanja nutricioniste Jelene Matijaš. Pravila i obaveze za korisnike web stranice i online usluga." />
        <link rel="canonical" href="https://nutricionistajelena.ba/uslovi-poslovanja" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Uslovi Poslovanja</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Posljednji put ažurirano: {new Date().toLocaleDateString('bs-BA')}
            </p>

            <p className="mb-8">
              Molimo vas da pažljivo pročitate ove Uslove poslovanja. Korištenjem naših usluga potvrđujete da ste upoznati sa ovim uslovima i da se slažete da ih poštujete. Ovi uslovi važe za sve posjetioce i korisnike web stranice i online usluga.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Trajanje i raskid ugovora</h2>
            <p className="mb-6">
              Ugovor između Kupca i Jelene Matijaš za pružanje nutricionističkih usluga sklapa se prilikom narudžbe usluge i izvršenog plaćanja, osim u slučaju da se raskine ranije.
            </p>
            <p className="mb-6">
              Kupac ima pravo, u skladu sa Zakonom o zaštiti potrošača u Republici Srpskoj, jednostrano raskinuti ugovor u roku od 7 dana od zaključenja, bez navođenja razloga. Raskid se vrši slanjem pisane izjave putem kontakt obrasca ili e-maila, uz navođenje imena, prezimena, e-mail adrese i podataka o naručenoj usluzi.
            </p>
            <p className="mb-8">
              Prodavatelj će bez odgađanja potvrditi prijem izjave, a povrat sredstava izvršiti najkasnije u roku od 14 dana od prijema obavijesti, na isti način plaćanja, osim ako se drugačije ne dogovori.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Prigovori i obavijesti</h2>
            <p className="mb-8">
              Ako niste zadovoljni uslugom, prigovor možete uputiti putem e-maila ili kontakt obrasca. U prigovoru navedite svoje ime, prezime, e-mail adresu i opis usluge.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Intelektualno vlasništvo</h2>
            <p className="mb-8">
              Sav sadržaj na web stranici – uključujući tekstove, fotografije, dizajn i planove ishrane – vlasništvo je Jelene Matijaš i ne smije se koristiti bez prethodne pisane saglasnosti.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Odricanje od odgovornosti</h2>
            <p className="mb-8">
              Korištenje usluge je na vlastitu odgovornost. Usluge se pružaju bez garancije na rezultate, uključujući mršavljenje, poboljšanje zdravstvenog stanja ili postizanje specifičnih ciljeva. Rezultati zavise od individualnih faktora i mogu varirati od osobe do osobe.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Mjerodavno pravo</h2>
            <p className="mb-8">
              Ovi Uslovi poslovanja tumače se u skladu sa zakonima Republike Srpske. Za sve sporove nadležan je sud prema sjedištu pružaoca usluge.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Kontakt</h2>
            <p className="mb-6">
              Za sva pitanja u vezi sa ovim Uslovima poslovanja, kontaktirajte nas:
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
