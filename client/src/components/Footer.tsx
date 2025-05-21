import { Link } from "wouter";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);
    try {
      await apiRequest("POST", "/api/subscribe", { email });
      toast({
        title: "Subscription successful",
        description: "Thank you for subscribing to our newsletter!",
      });
      setEmail("");
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "There was an error subscribing to the newsletter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* About */}
          <div>
            <Link href="/">
              <a className="flex items-center mb-6">
                <span className="text-primary text-2xl font-bold font-poppins">
                  Jelena <span className="text-dark">Matijaš</span>
                </span>
              </a>
            </Link>
            <p className="text-gray-600 mb-6">
              Professional nutritionist committed to helping you achieve optimal health through personalized nutrition plans.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition">
                <i className="fab fa-tiktok"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold font-poppins mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#home" className="text-gray-600 hover:text-primary transition">Home</a></li>
              <li><a href="#about" className="text-gray-600 hover:text-primary transition">About Me</a></li>
              <li><a href="#services" className="text-gray-600 hover:text-primary transition">Services</a></li>
              <li><a href="#blog" className="text-gray-600 hover:text-primary transition">Blog</a></li>
              <li><a href="#contact" className="text-gray-600 hover:text-primary transition">Contact</a></li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="text-lg font-bold font-poppins mb-6">Services</h4>
            <ul className="space-y-3">
              <li><a href="#services" className="text-gray-600 hover:text-primary transition">Personalized Meal Plans</a></li>
              <li><a href="#services" className="text-gray-600 hover:text-primary transition">One-on-One Coaching</a></li>
              <li><a href="#services" className="text-gray-600 hover:text-primary transition">Weight Management</a></li>
              <li><a href="#services" className="text-gray-600 hover:text-primary transition">Sports Nutrition</a></li>
              <li><a href="#services" className="text-gray-600 hover:text-primary transition">Family Nutrition</a></li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold font-poppins mb-6">Subscribe to Newsletter</h4>
            <p className="text-gray-600 mb-4">
              Stay updated with the latest nutrition tips, recipes, and wellness advice.
            </p>
            <form className="space-y-3" onSubmit={handleSubscribe}>
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button 
                type="submit" 
                className="w-full py-2 bg-primary hover:bg-primary-dark text-white rounded-md font-medium transition duration-300 ease-in-out disabled:opacity-70"
                disabled={isSubscribing}
              >
                {isSubscribing ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Jelena Matijaš. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-primary text-sm transition">Privacy Policy</a>
              <a href="#" className="text-gray-600 hover:text-primary text-sm transition">Terms of Service</a>
              <a href="#" className="text-gray-600 hover:text-primary text-sm transition">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
