import { useEffect } from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { getLocationBySlug } from "@/data/locations";
import NotFound from "@/pages/not-found";
import PricingSection from "@/components/PricingSection";
import ProgramsSection from "@/components/ProgramsSection";
import CTABanner from "@/components/CTABanner";
import ContactSection from "@/components/ContactSection";

const BASE_URL = "https://nutricionistajelena.ba";
const OG_IMAGE = "https://nutricionistajelena.ba/attached_assets/jelena-hero.png";

// Helper function to get location name in correct grammatical case ("za" + location)
function getLocationNameForCase(name: string): string {
	switch (name) {
		case 'Banja Luka':
			return 'Banju Luku';
		case 'Bosna i Hercegovina':
			return 'Bosnu i Hercegovinu';
		default:
			return name;
	}
}

// Helper function for genitive case ("iz" + location)
function getLocationNameGenitive(name: string): string {
	switch (name) {
		case 'Banja Luka':
			return 'Banja Luke';
		case 'Bosna i Hercegovina':
			return 'Bosne i Hercegovine';
		case 'Tuzla':
			return 'Tuzle';
		case 'Zenica':
			return 'Zenice';
		default:
			// For masculine nouns ending in consonant or -o: add "a" (Sarajevo → Sarajeva, Prijedor → Prijedora, Mostar → Mostara)
			return name + 'a';
	}
}

export default function NutricionistaLocation() {
	const [location_path] = useLocation();
	
	// Extract location slug from URL - direct parsing
	let locationSlug: string | null = null;
	const urlMatch = location_path.match(/\/nutricionista-([^/]+)$/);
	if (urlMatch && urlMatch[1]) {
		locationSlug = urlMatch[1];
	}
	
	const location = locationSlug ? getLocationBySlug(locationSlug) : undefined;
	const { ref, inView } = useAnimateOnScroll(0.1);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	if (!location) {
		return <NotFound />;
	}

	const canonical = `${BASE_URL}/nutricionista-${location.slug}`;

	// JSON-LD: LocalBusiness (bez lažnih ocjena — u skladu sa Google smjernicama)
	const localBusinessSchema = {
		"@context": "https://schema.org",
		"@type": "ProfessionalService",
		"@id": `${canonical}#business`,
		name: `Nutricionista ${location.name} – Jelena Matijaš`,
		description: location.metaDescription,
		url: canonical,
		image: OG_IMAGE,
		areaServed: {
			"@type": "City",
			name: location.name,
		},
		priceRange: "KM 80–300",
		address: {
			"@type": "PostalAddress",
			addressCountry: "BA",
			addressLocality: location.name,
		},
		sameAs: [
			"https://www.instagram.com/nutriputovanje/",
			"https://www.facebook.com/nutricionistajelena/",
		],
	}

	const faqSchema = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: location.faq.map((item) => ({
			"@type": "Question",
			name: item.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: item.answer,
			},
		})),
	}

	return (
		<>
			<Helmet>
				<title>{location.title}</title>
				<meta name="description" content={location.metaDescription} />
				<meta
					name="keywords"
					content={`nutricionista ${location.name}, nutricionista ${location.slug.replace(/-/g, " ")}, online nutricionista, plan ishrane, mršavljenje, savjetovanje ishrana`}
				/>
				<meta property="og:title" content={location.title} />
				<meta property="og:description" content={location.metaDescription} />
				<meta property="og:image" content={OG_IMAGE} />
				<meta property="og:url" content={canonical} />
				<meta property="og:locale" content="bs_BA" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content={location.title} />
				<meta name="twitter:description" content={location.metaDescription} />
				<meta name="twitter:image" content={OG_IMAGE} />
				<link rel="canonical" href={canonical} />
				<script type="application/ld+json">
					{JSON.stringify(localBusinessSchema)}
				</script>
				<script type="application/ld+json">
					{JSON.stringify(faqSchema)}
				</script>
			</Helmet>

			<main className="min-h-screen bg-white font-sans">
				<section
					className="py-16 md:py-24"
					style={{ backgroundColor: "#9FE2BF" }}
					aria-label={`Nutricionista za ${location.name}`}
				>
					<div className="container mx-auto px-4 max-w-6xl">
						<motion.div
							ref={ref}
							initial={{ opacity: 0, y: 20 }}
							animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
							transition={{ duration: 0.6 }}
						>
							<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
								Nutricionista za {getLocationNameForCase(location.name)} – online savjetovanje
							</h1>
							<p className="text-base md:text-lg text-gray-800 leading-relaxed mb-8">
								{location.introParagraph}
							</p>
							<Button 
								onClick={() => {
									const contactSection = document.getElementById('contact');
									if (contactSection) {
										contactSection.scrollIntoView({ behavior: 'smooth' });
									}
								}}
								className="bg-[#5DAD8C] hover:bg-[#4A9A79] text-white px-8 py-3 text-lg font-semibold rounded-lg transition-colors"
							>
								📅 Zakaži besplatnu konsultaciju
							</Button>
						</motion.div>
					</div>
				</section>

				<section
					className="py-16 md:py-20"
					style={{ backgroundColor: "#ECF8F2" }}
					aria-label="Klijenti iz vaše regije"
				>
					<div className="container mx-auto px-4 max-w-4xl text-center">
						<div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6" style={{ backgroundColor: "#9FE2BF" }}>
							<svg className="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
							</svg>
						</div>
						<h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
							Zašto naši klijenti iz {getLocationNameGenitive(location.name)} biraju online savjetovanje?
						</h2>
						<p className="text-base md:text-lg text-gray-700 leading-relaxed">
							{location.clientsParagraph}
						</p>
					</div>
				</section>

				<PricingSection />
				<ProgramsSection />

				{/* FAQ Section */}
				<section className="py-16 md:py-20 bg-white" aria-label="Često postavljana pitanja">
					<div className="container mx-auto px-4 max-w-4xl">
						<h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 text-center">
							Često postavljana pitanja – Nutricionista {location.name}
						</h2>
						<div className="space-y-6">
							{location.faq.map((item, index) => (
								<div 
									key={index} 
									className="bg-gray-50 rounded-lg p-6 border-l-4" 
									style={{ borderColor: "#5DAD8C" }}
								>
									<h3 className="text-lg font-semibold text-gray-900 mb-3">
										{item.question}
									</h3>
									<p className="text-gray-700 leading-relaxed">
										{item.answer}
									</p>
								</div>
							))}
							</div>
					</div>
				</section>

				<CTABanner />
				<ContactSection />
			</main>
		</>
	);
}
