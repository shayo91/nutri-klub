import { useState } from "react";
import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import ebookCoverImage from "@assets/image_1764108519857.png";

type Ebook = {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  originalPrice?: number;
  isFree: boolean;
  downloadUrl?: string;
  pages: number;
  category: string;
};

export default function EbookSection() {
  const { ref: headerRef, inView: headerInView } = useAnimateOnScroll();
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const ebooks: Ebook[] = [
    {
      id: 1,
      title: "Mini vodič kroz 4 faze menstrualnog ciklusa i kako jesti u svakoj.",
      description: "Žurimo, jurimo, ganjamo, očekujemo da smo svaki dan iste.. jednako produktivne, kreativne, smirene, fokusirane, motivisane. A istina je: mi nismo stvorene da budemo iste.",
      image: ebookCoverImage,
      price: 0,
      isFree: true,
      downloadUrl: "/attached_assets/vodic-zdrava-ishrana.pdf",
      pages: 10,
      category: "Besplatni vodič"
    },
    {
      id: 2,
      title: "Mediteranska Dijeta - Kompletan Plan",
      description: "Detaljni vodič kroz mediteransku dijetu sa 60 recepata, planovima obroka i naučnim objašnjenjima prednosti.",
      image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=600&fit=crop",
      price: 2499,
      originalPrice: 3499,
      isFree: false,
      pages: 120,
      category: "Premium vodič"
    },
    {
      id: 3,
      title: "Plan Mršavljenja za 30 Dana",
      description: "Strukturiran program mršavljenja sa dnevnim planovima obroka, vežbama i motivacionim savetima.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop",
      price: 1999,
      originalPrice: 2999,
      isFree: false,
      pages: 80,
      category: "Program mršavljenja"
    }
  ];

  const handleDownload = async (ebook: Ebook) => {
    if (ebook.isFree && ebook.downloadUrl) {
      setDownloadingId(ebook.id);
      
      // Simuliramo download
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = ebook.downloadUrl!;
        link.download = `${ebook.title.replace(/\s+/g, '-').toLowerCase()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setDownloadingId(null);
      }, 1000);
    } else {
      // Redirect to purchase page
      window.location.href = `/purchase/${ebook.id}`;
    }
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-primary font-medium tracking-wide uppercase mb-2">
            E-BOOK BIBLIOTEKA
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
            Preuzmite naše stručne vodiče
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Kolekcija vodiča kreiranih da ti olakšaju razumijevanje ishrane i zdravih navika. 
            Bilo da tek počinješ ili želiš da unaprijediš svoju rutinu, ovdje ćeš pronaći podršku i kvalitetne informacije.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {ebooks.map((ebook, index) => (
            <motion.div
              key={ebook.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border"
            >
              {/* Book Cover */}
              <div className="relative">
                <img
                  src={ebook.image}
                  alt={`${ebook.title} - nutricionista e-knjiga plan ishrane BiH`}
                  className="w-full h-64 object-cover"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    ebook.isFree 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {ebook.category}
                  </span>
                </div>
                {ebook.isFree && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    BESPLATNO
                  </div>
                )}
                {!ebook.isFree && ebook.originalPrice && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    -{Math.round((1 - ebook.price / ebook.originalPrice) * 100)}%
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-bold text-lg mb-3 line-clamp-2">
                  {ebook.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {ebook.description}
                </p>
                
                <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                  <span>{ebook.pages} stranica</span>
                  <span>PDF format</span>
                </div>

                {/* Price and Download */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {ebook.isFree ? (
                      <span className="text-2xl font-bold text-green-600">Besplatno</span>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-primary">
                          {ebook.price.toLocaleString('sr-RS')} RSD
                        </span>
                        {ebook.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            {ebook.originalPrice.toLocaleString('sr-RS')} RSD
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleDownload(ebook)}
                    disabled={downloadingId === ebook.id}
                    className={`px-6 py-2 rounded-md font-medium transition duration-300 ease-in-out ${
                      ebook.isFree
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-primary hover:bg-primary-dark text-white'
                    } disabled:opacity-70`}
                  >
                    {downloadingId === ebook.id ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Preuzimanje...</span>
                      </div>
                    ) : ebook.isFree ? (
                      'Preuzmite'
                    ) : (
                      'Kupite'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <div className="bg-primary/5 rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Imate pitanja o našim e-bookovima?</h3>
            <p className="text-gray-600 mb-6">
              Kontaktirajte nas za više informacija ili personalizovane preporuke
            </p>
            <a
              href="#contact"
              className="inline-block px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-md font-medium transition duration-300 ease-in-out shadow-md hover:shadow-lg"
            >
              Kontaktiraj Nas
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}