import HeroSection from "@/components/HeroSection";
import BMICalculator from "@/components/BMICalculator";
import PricingSection from "@/components/PricingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import BlogSection from "@/components/BlogSection";
import ContactSection from "@/components/ContactSection";
import ProgramsSection from "@/components/ProgramsSection";
import FAQSection from "@/components/FAQSection";
import CTABanner from "@/components/CTABanner";
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
  const { data: blogData, isPending: blogLoading } = useQuery<BlogResponse>({
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
        <title>Nutricionista Banja Luka | Jelena Matijaš – plan ishrane i online savjetovanje BiH</title>
        <meta name="description" content="Nutricionista Banja Luka: Jelena Matijaš, magistar nutricionizma. Online savjetovanje i personalizovani planovi ishrane za cijelu BiH – mršavljenje, debljanje, zdrava ishrana. Zakažite konsultaciju." />
        <meta property="og:title" content="Nutricionista Banja Luka | Jelena Matijaš – plan ishrane BiH" />
        <meta property="og:description" content="Nutricionista Banja Luka i online savjetovanje za cijelu BiH. Personalizovani planovi ishrane – mršavljenje, debljanje, zdrava ishrana." />
        <meta property="og:image" content="https://nutricionistajelena.ba/attached_assets/jelena-hero.png" />
        <meta property="og:locale" content="bs_BA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Nutricionista Banja Luka | Jelena Matijaš – plan ishrane BiH" />
        <meta name="twitter:description" content="Nutricionista Banja Luka i online savjetovanje za cijelu BiH. Planovi ishrane za mršavljenje, debljanje i zdravlje." />
        <meta name="twitter:image" content="https://nutricionistajelena.ba/attached_assets/jelena-hero.png" />
        <link rel="canonical" href="https://nutricionistajelena.ba" />
      </Helmet>
      <HeroSection />
      <BMICalculator />
      <TestimonialsSection />
      <PricingSection />
      <ProgramsSection />
      <BlogSection
        posts={blogData?.posts}
        categories={blogData?.categories}
        isLoading={blogLoading}
      />
      <CTABanner />
      <FAQSection />
      <ContactSection />
      <EmailButton />
    </>
  );
}
