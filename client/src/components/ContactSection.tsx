import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
    privacyAgreed: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const { ref: headerRef, inView: headerInView } = useAnimateOnScroll();
  const { ref: contentRef, inView: contentInView } = useAnimateOnScroll(0.3);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checkbox.checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.privacyAgreed) {
      toast({
        title: "Error",
        description: "Please agree to the privacy policy",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await apiRequest("POST", "/api/contact", formData);
      
      toast({
        title: "Message sent",
        description: "Thank you for your message. We'll get back to you soon!",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        privacyAgreed: false
      });
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "There was a problem sending your message. Please try again later.",
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
          <p className="text-primary font-medium tracking-wide uppercase mb-2">GET IN TOUCH</p>
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
            Contact Me
          </h2>
          <p className="text-gray-600">
            Have questions or ready to start your nutrition journey? Reach out to me for a consultation or to book an appointment.
          </p>
        </motion.div>
        
        <motion.div 
          ref={contentRef}
          initial={{ opacity: 0, y: 20 }}
          animate={contentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col lg:flex-row gap-10"
        >
          {/* Contact Form */}
          <div className="w-full lg:w-7/12 bg-white rounded-xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold font-poppins mb-6">Send a Message</h3>
            
            <form id="contact-form" className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                    placeholder="Your name" 
                    required 
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                    placeholder="Your email" 
                    required 
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                  placeholder="Message subject" 
                  required 
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
                <textarea 
                  id="message" 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5} 
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                  placeholder="Your message" 
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
                  I agree to the <a href="#" className="text-primary hover:underline">Privacy Policy</a> and consent to being contacted.
                </label>
              </div>
              
              <button 
                type="submit" 
                className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-md font-medium transition duration-300 ease-in-out shadow-md hover:shadow-lg disabled:opacity-70"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
          
          {/* Contact Information */}
          <div className="w-full lg:w-5/12">
            <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
              <h3 className="text-2xl font-bold font-poppins mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-secondary p-3 rounded-full mr-4">
                    <i className="fas fa-map-marker-alt text-primary"></i>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Office Location</h4>
                    <p className="text-gray-600">123 Nutrition Street, Healthy City, 10001</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-secondary p-3 rounded-full mr-4">
                    <i className="fas fa-phone text-primary"></i>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Phone Number</h4>
                    <p className="text-gray-600">+123 456 7890</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-secondary p-3 rounded-full mr-4">
                    <i className="fas fa-envelope text-primary"></i>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Email Address</h4>
                    <p className="text-gray-600">jelena@nutritionist.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-secondary p-3 rounded-full mr-4">
                    <i className="fas fa-clock text-primary"></i>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Working Hours</h4>
                    <p className="text-gray-600">Monday - Friday: 9am - 6pm</p>
                    <p className="text-gray-600">Saturday: 10am - 3pm</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="font-bold mb-3">Follow Me</h4>
                <div className="flex space-x-4">
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="Facebook"
                    className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="Instagram"
                    className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a 
                    href="https://tiktok.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="TikTok"
                    className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition"
                  >
                    <i className="fab fa-tiktok"></i>
                  </a>
                  <a 
                    href="https://youtube.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="YouTube"
                    className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition"
                  >
                    <i className="fab fa-youtube"></i>
                  </a>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden shadow-lg h-64">
              {/* Map placeholder */}
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <i className="fas fa-map-marked-alt text-4xl text-gray-400 mb-3"></i>
                  <p className="text-gray-500">Google Maps Embed</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
