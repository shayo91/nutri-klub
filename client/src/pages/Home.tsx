import HeroSection from "@/components/HeroSection";
import BMICalculator from "@/components/BMICalculator";
import PricingSection from "@/components/PricingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import BlogSection from "@/components/BlogSection";
import ContactSection from "@/components/ContactSection";
import ProgramsSection from "@/components/ProgramsSection";
import EmailButton from "@/components/WhatsAppButton";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "@/lib/types";

export default function Home() {
  const { data: blogPosts } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog-posts'],
    staleTime: 60 * 1000,
  });

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
      <BMICalculator />
      <TestimonialsSection />
      <PricingSection />
      <ProgramsSection />
      <BlogSection posts={blogPosts} />
      <ContactSection />
      <EmailButton />
    </>
  );
}
