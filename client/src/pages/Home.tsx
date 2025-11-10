import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import BMICalculator from "@/components/BMICalculator";
import PricingSection from "@/components/PricingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import BlogSection from "@/components/BlogSection";
import ContactSection from "@/components/ContactSection";
import VideoSection from "@/components/VideoSection";
import ResultsSection from "@/components/ResultsSection";
import EbookSection from "@/components/EbookSection";
import FAQSection from "@/components/FAQSection";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Testimonial, BlogPost } from "@/lib/types";

export default function Home() {
  // Fetch any necessary data
  const { data: blogPosts } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog-posts'],
    staleTime: 60 * 1000, // 1 minute
  });

  const { data: testimonials } = useQuery<Testimonial[]>({
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
      <BMICalculator />
      <ResultsSection />
      <ServicesSection />
      <PricingSection />
      <TestimonialsSection testimonials={testimonials} />
      <FAQSection />
      <VideoSection />
      <EbookSection />
      <BlogSection posts={blogPosts} />
      <ContactSection />
      <WhatsAppButton />
    </>
  );
}
