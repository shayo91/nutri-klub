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
    <section id="contact" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-primary font-medium tracking-wide uppercase mb-2">
            KONTAKTIRAJTE ME
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
            Pošaljite Poruku
          </h2>
          <p className="text-gray-600">
            Imate pitanja ili ste spremni da započnete svoj put ka zdravlju?
            Obratite mi se za konsultaciju ili zakazivanje termina.
          </p>
        </motion.div>

        <motion.div
          ref={contentRef}
          initial={{ opacity: 0, y: 20 }}
          animate={contentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col lg:flex-row gap-10"
        >
          <div className="w-full lg:w-7/12 bg-white rounded-xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold font-poppins mb-6">
              Pošaljite Svoj Upit
            </h3>
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
                  <a href="/privacy-policy" className="text-primary hover:underline">
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

          {/* Contact Information and Map */}
          <div className="w-full lg:w-5/12 space-y-6">
            {/* Contact Info */}
            <div className="bg-primary/5 rounded-xl p-6">
              <h3 className="text-xl font-bold font-poppins mb-4 text-gray-800">
                Kontakt Informacije
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-primary text-white p-2 rounded-lg mr-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Email</p>
                    <p className="text-gray-600">jelena@nutricionista.rs</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-primary text-white p-2 rounded-lg mr-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Telefon</p>
                    <p className="text-gray-600">+387 65 123 456</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-primary text-white p-2 rounded-lg mr-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Adresa</p>
                    <p className="text-gray-600">Jovana Ducića 8<br />Banja Luka, BiH</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 bg-primary/5">
                <h3 className="text-lg font-bold font-poppins text-gray-800">
                  Naša Lokacija
                </h3>
              </div>
              <div className="h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2875.4726946236873!2d17.185!3d44.776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475e01c72c5b8965%3A0x4b82e8bfc0b3e0a5!2sJovana%20Du%C4%8Di%C4%87a%208%2C%20Banja%20Luka%2078000%2C%20Bosnia%20and%20Herzegovina!5e0!3m2!1sen!2srs!4v1700000000000!5m2!1sen!2srs"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokacija kancelarije - Jovana Ducića 8, Banja Luka"
                ></iframe>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
