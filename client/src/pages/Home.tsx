import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import BMICalculator from "@/components/BMICalculator";
import ProcessSection from "@/components/ProcessSection";
import PricingSection from "@/components/PricingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import BlogSection from "@/components/BlogSection";
import SocialMediaSection from "@/components/SocialMediaSection";
import ContactSection from "@/components/ContactSection";
import PodcastSection from "@/components/PodcastSection";
import VideoSection from "@/components/VideoSection";
import NutritionQuiz from "@/components/NutritionQuiz";
import ResultsSection from "@/components/ResultsSection";
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
      <AboutSection />
      <ProcessSection />
      <PricingSection />
      <ServicesSection />
      <NutritionQuiz />
      <BMICalculator />
      <VideoSection />
      <PodcastSection />
      <TestimonialsSection testimonials={testimonials} />
      <ResultsSection />
      <BlogSection posts={blogPosts} />
      <SocialMediaSection />
      <ContactSection />
    </>
  );
}
