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
        <meta name="description" content="Nutricionista Banja Luka i online nutricionist za cijelu BiH. Personalizovani planovi ishrane za mršavljenje, debljanje i zdrav život. Dijeta savjeti, zdravlje ishrana i besplatne konsultacije." />
        <meta property="og:title" content="Nutricionista Jelena Matijaš | Planovi Ishrane BiH" />
        <meta property="og:description" content="Online nutricionist i nutricionista Banja Luka. Personalizovani planovi ishrane za mršavljenje i debljanje. Dijeta savjeti i zdravlje ishrana." />
        <meta property="og:image" content="https://nutricionistajelena.ba/attached_assets/jelena-hero.png" />
        <meta property="og:locale" content="bs_BA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Nutricionista Jelena Matijaš | Planovi Ishrane BiH" />
        <meta name="twitter:description" content="Online nutricionist i nutricionista Banja Luka. Personalizovani planovi ishrane za mršavljenje i debljanje." />
        <meta name="twitter:image" content="https://nutricionistajelena.ba/attached_assets/jelena-hero.png" />
        <link rel="canonical" href="https://nutricionistajelena.ba" />
      </Helmet>
      <HeroSection />
      <BMICalculator />
      <TestimonialsSection />
      <PricingSection />
      <ProgramsSection />
      <BlogSection posts={blogData?.posts} categories={blogData?.categories} />
      <CTABanner />
      <FAQSection />
      <ContactSection />
      <EmailButton />
    </>
  );
}
