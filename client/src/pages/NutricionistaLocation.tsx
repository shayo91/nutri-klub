import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { getLocationBySlug } from "@/data/locations";
import NotFound from "@/pages/not-found";
import ProcessSection from "@/components/ProcessSection";
import ProgramsSection from "@/components/ProgramsSection";
import CTABanner from "@/components/CTABanner";
import ContactSection from "@/components/ContactSection";
import WhatsAppButton from "@/components/WhatsAppButton";

const BASE_URL = "https://nutricionistajelena.ba";
const OG_IMAGE = "https://nutricionistajelena.ba/attached_assets/jelena-hero.png";

export default function NutricionistaLocation() {
	const [, params] = useRoute("/nutricionista-:location");
	const location = params?.location ? getLocationBySlug(params.location) : undefined;
	const { ref, inView } = useAnimateOnScroll(0.1);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	if (!location) {
		return <NotFound />;
	}

	const canonical = `${BASE_URL}/nutricionista-${location.slug}`;

	return (
		<>
			<Helmet>
				<title>{location.title}</title>
				<meta name="description" content={location.metaDescription} />
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
								Nutricionista za {location.name} – online savjetovanje
							</h1>
							<p className="text-base md:text-lg text-gray-800 leading-relaxed mb-6">
								{location.introParagraph}
							</p>
							<p className="text-base text-gray-700">
								<Link href="/">
									<a className="text-[#5DAD8C] hover:text-[#4A9A79] font-medium underline">
										Na početnu
									</a>
								</Link>
							</p>
						</motion.div>
					</div>
				</section>

				<section
					className="py-12 md:py-16"
					style={{ backgroundColor: "#ECF8F2" }}
					aria-label="Klijenti iz vaše regije"
				>
					<div className="container mx-auto px-4 max-w-6xl">
						<h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
							Zašto klijenti iz {location.name} biraju online savjetovanje
						</h2>
						<p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-3xl">
							{location.clientsParagraph}
						</p>
					</div>
				</section>

				<ProcessSection />
				<ProgramsSection />
				<CTABanner />
				<ContactSection />
				<WhatsAppButton />
			</main>
		</>
	);
}
