import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import BMICalculator from "@/components/BMICalculator";
import ProcessSection from "@/components/ProcessSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import BlogSection from "@/components/BlogSection";
import SocialMediaSection from "@/components/SocialMediaSection";
import ContactSection from "@/components/ContactSection";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  // Fetch any necessary data
  const { data: blogPosts } = useQuery({
    queryKey: ['/api/blog-posts'],
    staleTime: 60 * 1000, // 1 minute
  });

  const { data: testimonials } = useQuery({
    queryKey: ['/api/testimonials'],
    staleTime: 60 * 1000, // 1 minute
  });

  // Scroll to hash on load if present
  useEffect(() => {
    if (window.location.hash) {
      const element = document.querySelector(window.location.hash);
      if (element) {
        element.scrollIntoView();
      }
    }
  }, []);

  return (
    <>
      <HeroSection />
      <ProcessSection />
      <AboutSection />
      <ServicesSection />
      <BMICalculator />
      <TestimonialsSection testimonials={testimonials} />
      <BlogSection posts={blogPosts} />
      <SocialMediaSection />
      <ContactSection />
    </>
  );
}
