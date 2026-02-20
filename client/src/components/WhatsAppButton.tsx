import { motion, AnimatePresence } from "framer-motion";
import { useState, type MouseEvent } from "react";
import { Mail } from "lucide-react";

export default function EmailButton() {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 2, duration: 0.3 }}
    >
      <motion.a
        href="#contact"
        onClick={handleClick}
        className="group flex items-center text-white rounded-full shadow-lg transition-all duration-300"
        style={{ backgroundColor: "#9FE2BF" }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        data-testid="button-contact"
        aria-label="Pošalji poruku ili idi na kontakt"
      >
        <div className="p-4">
          <Mail className="w-6 h-6" />
        </div>
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="overflow-hidden pr-4 whitespace-nowrap"
            >
              <span className="text-sm font-medium">Pošalji poruku</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.a>
    </motion.div>
  );
}