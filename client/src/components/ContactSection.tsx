import { useState } from "react";
import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { useToast } from "@/hooks/use-toast"; // Ensure to import the toast hook

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  privacyAgreed: boolean;
}

export default function ContactSection() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
    privacyAgreed: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { ref: headerRef, inView: headerInView } = useAnimateOnScroll();
  const { ref: contentRef, inView: contentInView } = useAnimateOnScroll(0.3);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      setFormData((prevData) => ({
        ...prevData,
        [name]: checkbox.checked,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      toast({
        title: "Uspešno!",
        description: "Poruka je uspešno poslana!",
      });
      
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        privacyAgreed: false,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Greška",
        description: "Došlo je do greške prilikom slanja poruke.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-[#5DAD8C]">
      <div className="container mx-auto px-4">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-white/80 font-medium tracking-wide uppercase mb-2">
            KONTAKT
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6 text-white">
            Pošalji poruku
          </h2>
          <p className="text-white/80">
            Za sve informacije o proizvodima i uslugama ispuni kontakt formu ili mi se javi direktno putem e-maila.
          </p>
        </motion.div>

        {/* Contact Info - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-10 max-w-3xl mx-auto border border-white/20"
        >
          <h3 className="text-xl font-bold font-poppins mb-4 text-white text-center">
            Kontakt Informacije
          </h3>
          <div className="flex justify-center">
            <div className="flex items-center">
              <div className="bg-white text-[#5DAD8C] p-2 rounded-lg mr-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                </svg>
              </div>
              <div>
                <p className="font-medium text-white">Email</p>
                <p className="text-white/80">nutriklub@gmail.com</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          ref={contentRef}
          initial={{ opacity: 0, y: 20 }}
          animate={contentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col lg:flex-row gap-10"
        >
          <div className="w-full lg:w-1/2 bg-white rounded-xl p-8 shadow-lg">
            <form
              id="contact-form"
              className="space-y-6"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Ime
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Unesite svoje ime"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Unesite svoj email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Tema
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Tema poruke"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Poruka
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Vaša poruka"
                  required
                ></textarea>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="privacy"
                  name="privacyAgreed"
                  checked={formData.privacyAgreed}
                  onChange={handleChange}
                  className="mr-2 text-primary focus:ring-primary"
                  required
                />
                <label htmlFor="privacy" className="text-gray-600 text-sm">
                  Slažem se sa{" "}
                  <a href="/privacy" className="text-primary hover:underline">
                    Politikom Privatnosti
                  </a>{" "}
                  i pristajem na kontaktiranje.
                </label>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-md font-medium transition duration-300 ease-in-out shadow-md hover:shadow-lg disabled:opacity-70"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Šaljem..." : "Pošaljite Poruku"}
              </button>
            </form>
          </div>

          {/* Zašto Nutricionista - SEO optimized section */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-xl p-8 shadow-lg h-full">
              <h3 className="text-xl font-bold font-poppins mb-4 text-gray-800">
                Zašto Nutricionista?
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span className="text-gray-700">
                    <strong>Personalizovan plan ishrane</strong> - prilagođen vašim ciljevima, zdravstvenom stanju i načinu života
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span className="text-gray-700">
                    <strong>Stručno savjetovanje</strong> - magistar nutricionizma sa višegodišnjim iskustvom u BiH
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span className="text-gray-700">
                    <strong>Održivo mršavljenje</strong> - bez gladovanja, jojo efekta i striktnih dijeta
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span className="text-gray-700">
                    <strong>Zdravo debljanje</strong> - povećanje tjelesne mase pravilnom ishranom i treningom
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span className="text-gray-700">
                    <strong>Bezglutenska ishrana</strong> - planovi za celijakiju i intoleranciju na gluten
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span className="text-gray-700">
                    <strong>Online konsultacije</strong> - dostupne širom Bosne i Hercegovine iz udobnosti vašeg doma
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span className="text-gray-700">
                    <strong>Kontinuirana podrška</strong> - praćenje napretka i prilagođavanje plana vašim potrebama
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
