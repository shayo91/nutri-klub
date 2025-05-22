import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { useState } from "react";

export default function HeroSection() {
  const { ref: textRef, inView: textInView } = useAnimateOnScroll();
  const { ref: formRef, inView: formInView } = useAnimateOnScroll(0.3);
  
  // Form state
  const [formData, setFormData] = useState({
    doctor: "",
    date: "",
    time: "",
    name: "",
    phone: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Appointment form submitted:", formData);
    // Here you would typically send this data to your backend
    alert("Thank you! Your appointment has been scheduled.");
    
    // Reset form
    setFormData({
      doctor: "",
      date: "",
      time: "",
      name: "",
      phone: ""
    });
  };

  return (
    <section id="home" className="relative py-16 md:py-24 overflow-hidden" style={{ backgroundColor: "#f1f5eb" }}>
      {/* Background fruit/vegetable decoration - fixed positioned images */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Avocado top left */}
        <motion.div 
          className="absolute top-0 left-0 w-1/4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ duration: 1 }}
        >
          <img 
            src="https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400" 
            alt="Decorative avocado" 
            className="w-full opacity-25"
          />
        </motion.div>
        
        {/* Grapefruit bottom left */}
        <motion.div 
          className="absolute bottom-0 left-5 w-1/5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <img 
            src="https://images.unsplash.com/photo-1577315734214-4b3dec92d9ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400" 
            alt="Decorative grapefruit" 
            className="w-full opacity-25"
          />
        </motion.div>
        
        {/* Pineapple top right */}
        <motion.div 
          className="absolute top-20 right-0 w-1/4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <img 
            src="https://images.unsplash.com/photo-1550258987-190a2d41a8ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400" 
            alt="Decorative pineapple" 
            className="w-full opacity-25"
          />
        </motion.div>
        
        {/* Lime bottom right */}
        <motion.div 
          className="absolute bottom-10 right-20 w-1/6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <img 
            src="https://images.unsplash.com/photo-1568569350062-ebfa3cb195df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400" 
            alt="Decorative lime" 
            className="w-full opacity-25"
          />
        </motion.div>
        
        {/* Cucumber bottom right */}
        <motion.div 
          className="absolute bottom-0 right-0 w-1/5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <img 
            src="https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400" 
            alt="Decorative cucumber" 
            className="w-full opacity-25"
          />
        </motion.div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Logo/Brand - small copper/gold color */}
        <div className="text-center mb-6">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl" 
            style={{ fontFamily: 'serif', color: '#c59d5f' }}
          >
            NutriHub
          </motion.h2>
        </div>
        
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Left side with woman eating healthy food image */}
          <motion.div 
            ref={textRef}
            initial={{ opacity: 0, x: -50 }}
            animate={textInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2"
          >
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Woman enjoying healthy food" 
                className="w-full h-auto"
              />
            </div>
          </motion.div>

          {/* Right side with appointment booking form */}
          <motion.div 
            ref={formRef}
            initial={{ opacity: 0, x: 50 }}
            animate={formInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:w-1/2 bg-white p-8 rounded-lg shadow-xl"
          >
            <div className="text-center mb-6">
              <p className="text-gray-500 uppercase tracking-widest text-xs">LOREM IPSUM</p>
              <h3 
                className="text-3xl font-light mt-1" 
                style={{ fontFamily: 'serif', color: '#c59d5f' }}
              >
                Book Appointment
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Doctor selection */}
              <div>
                <select 
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:border-primary"
                  required
                >
                  <option value="" disabled>Select doctor</option>
                  <option value="dr-smith">Dr. Smith</option>
                  <option value="dr-johnson">Dr. Johnson</option>
                  <option value="dr-williams">Dr. Williams</option>
                </select>
              </div>
              
              {/* Date picker */}
              <div>
                <input 
                  type="date" 
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:border-primary"
                  required
                />
              </div>
              
              {/* Time picker */}
              <div>
                <input 
                  type="time" 
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:border-primary"
                  required
                />
              </div>
              
              {/* Name */}
              <div>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Full Name" 
                  className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:border-primary"
                  required
                />
              </div>
              
              {/* Phone */}
              <div>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone" 
                  className="w-full px-4 py-3 border border-gray-200 rounded focus:outline-none focus:border-primary"
                  required
                />
              </div>
              
              {/* Submit button */}
              <div>
                <button 
                  type="submit" 
                  className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-medium transition duration-300 ease-in-out uppercase tracking-wider"
                  style={{ backgroundColor: '#c59d5f' }}
                >
                  Schedule
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
