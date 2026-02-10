import { useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "wouter";
import Layout from "@/components/Layout";

type Ebook = {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  originalPrice?: number;
  pages: number;
  features: string[];
};

export default function Purchase() {
  const { id } = useParams();
  const [isProcessing, setIsProcessing] = useState(false);

  const ebooks: { [key: string]: Ebook } = {
    "2": {
      id: 2,
      title: "Mediteranska Dijeta - Kompletan Plan",
      description: "Detaljni vodič kroz mediteransku dijetu sa 60 recepata, planovima obroka i naučnim objašnjenjima prednosti.",
      image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=600&fit=crop",
      price: 2499,
      originalPrice: 3499,
      pages: 120,
      features: [
        "60 autentičnih mediteranskih recepata",
        "14-dnevni plan obroka",
        "Lista za kupovinu namirnica",
        "Naučno objašnjenje prednosti",
        "Saveti za prilagođavanje",
        "Nutritivne informacije za svaki recept"
      ]
    },
    "3": {
      id: 3,
      title: "Plan Mršavljenja za 30 Dana",
      description: "Strukturiran program mršavljenja sa dnevnim planovima obroka, vežbama i motivacionim savetima.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop",
      price: 1999,
      originalPrice: 2999,
      pages: 80,
      features: [
        "30-dnevni detaljni plan",
        "Recepti za svaki obrok",
        "Program vežbanja",
        "Tracker napretka",
        "Motivacioni saveti",
        "Saveti za održavanje rezultata"
      ]
    }
  };

  const ebook = ebooks[id || ""];

  if (!ebook) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">E-book nije pronađen</h1>
            <a href="/" className="text-primary hover:underline">Vratite se na početnu</a>
          </div>
        </div>
      </Layout>
    );
  }

  const handlePurchase = () => {
    setIsProcessing(true);
    // Simulacija purchase procesa
    setTimeout(() => {
      alert("Hvala na kupovini! E-book će biti poslat na vašu email adresu.");
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Product Info */}
              <div>
                <img
                  src={ebook.image}
                  alt={`${ebook.title} - e-knjiga nutricionista plan ishrane`}
                  className="w-full max-w-md mx-auto rounded-xl shadow-lg"
                />
              </div>

              {/* Purchase Form */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold mb-4">{ebook.title}</h1>
                <p className="text-gray-600 mb-6">{ebook.description}</p>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Šta dobijate:</h3>
                  <ul className="space-y-2">
                    {ebook.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-3xl font-bold text-primary">
                        {ebook.price.toLocaleString('sr-RS')} RSD
                      </div>
                      {ebook.originalPrice && (
                        <div className="text-lg text-gray-500 line-through">
                          {ebook.originalPrice.toLocaleString('sr-RS')} RSD
                        </div>
                      )}
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>{ebook.pages} stranica</div>
                      <div>PDF format</div>
                    </div>
                  </div>

                  <button
                    onClick={handlePurchase}
                    disabled={isProcessing}
                    className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold text-lg transition duration-300 ease-in-out shadow-md hover:shadow-lg disabled:opacity-70"
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Obrađujemo...</span>
                      </div>
                    ) : (
                      'Kupite Sada'
                    )}
                  </button>

                  <div className="mt-4 text-center text-sm text-gray-500">
                    <p>Sigurno plaćanje • 30 dana garancije • Trenutni download</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}