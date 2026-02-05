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
import { Helmet } from "react-helmet";

interface BlogResponse {
  posts: BlogPost[];
  categories: string[];
}

export default function Home() {
  const { data: blogData } = useQuery<BlogResponse>({
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
      <Helmet>
        <title>Nutricionista Jelena Matijaš | Planovi Ishrane BiH | Mršavljenje i Debljanje</title>
        <meta name="description" content="Nutricionista u Bosni i Hercegovini. Personalizovani planovi ishrane za mršavljenje, debljanje i zdrav život. Online konsultacije dostupne širom BiH. Bezglutenska ishrana i nutritivno savjetovanje." />
        <meta property="og:title" content="Nutricionista Jelena Matijaš | Planovi Ishrane BiH" />
        <meta property="og:description" content="Personalizovani planovi ishrane za mršavljenje, debljanje i zdrav život. Magistar nutricionizma sa 5+ godina iskustva." />
        <link rel="canonical" href="https://nutriputovanje.com" />
      </Helmet>
      <HeroSection />
      <BMICalculator />
      <TestimonialsSection />
      <PricingSection />
      <ProgramsSection />
      <BlogSection posts={blogData?.posts} categories={blogData?.categories} />
      <ContactSection />
      <EmailButton />
    </>
  );
}
