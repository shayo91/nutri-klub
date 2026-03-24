import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll";
import { Link } from "wouter";

export interface BlogPost {
	id: number | string;
	title: string;
	excerpt: string;
	category: string;
	categories?: string[];
	image: string;
	thumbnail?: string;
	date: string;
	slug: string;
}

const POSTS_PER_PAGE = 3;

const DEFAULT_CATEGORY_FILTERS = [
	"Recepti",
	"Savjeti",
	"Zdravlje",
	"Planovi ishrane",
	"Mršavljenje",
	"Debljanje",
];

function formatPostDate(isoOrText: string): string {
	const d = new Date(isoOrText);
	if (!isNaN(d.getTime())) {
		return d.toLocaleDateString("sr-RS");
	}
	return isoOrText;
}

interface BlogSectionProps {
	posts?: BlogPost[];
	categories?: string[];
	isLoading?: boolean;
	/** Omit for dedicated /blog page (avoids duplicate id="blog") */
	sectionId?: string | false;
	showAllPosts?: boolean;
}

export default function BlogSection({
	posts,
	categories,
	isLoading = false,
	sectionId = "blog",
	showAllPosts = false,
}: BlogSectionProps) {
	const [activeFilter, setActiveFilter] = useState<string>("all");
	const [visibleCount, setVisibleCount] = useState(
		showAllPosts ? 10_000 : POSTS_PER_PAGE,
	);

	const blogPosts = useMemo(() => {
		const items = [...(posts ?? [])]
		items.sort((a, b) => {
			const da = new Date(a.date).getTime()
			const db = new Date(b.date).getTime()
			const aValid = !isNaN(da)
			const bValid = !isNaN(db)
			if (aValid && bValid) return db - da
			if (aValid) return -1
			if (bValid) return 1
			return 0
		})
		return items
	}, [posts])

	const availableCategories = useMemo(() => {
		if (categories && categories.length > 0) return categories;
		const fromPosts = new Set<string>();
		for (const p of blogPosts) {
			if (p.categories?.length) {
				for (const c of p.categories) fromPosts.add(c);
			} else if (p.category) {
				fromPosts.add(p.category);
			}
		}
		if (fromPosts.size > 0) return Array.from(fromPosts).sort();
		return DEFAULT_CATEGORY_FILTERS;
	}, [categories, blogPosts]);

	const { ref: headerRef, inView: headerInView } = useAnimateOnScroll();
	const { ref: filtersRef, inView: filtersInView } = useAnimateOnScroll(0.15);
	const { ref: loadMoreRef, inView: loadMoreInView } = useAnimateOnScroll(0.3);

	const filteredPosts =
		activeFilter === "all"
			? blogPosts
			: blogPosts.filter((post) => {
					if (post.categories && post.categories.length > 0) {
						return post.categories.includes(activeFilter);
					}
					return post.category === activeFilter;
				});

	const visiblePosts = showAllPosts
		? filteredPosts
		: filteredPosts.slice(0, visibleCount);
	const hasMorePosts =
		!showAllPosts && visibleCount < filteredPosts.length;

	const handleFilterChange = (category: string) => {
		setActiveFilter(category);
		setVisibleCount(showAllPosts ? 10_000 : POSTS_PER_PAGE);
	};

	const handleLoadMore = () => {
		setVisibleCount((prev) => prev + POSTS_PER_PAGE);
	};

	const htmlId = sectionId === false ? undefined : sectionId ?? "blog";

	return (
		<section
			id={htmlId}
			aria-label="Blog o ishrani"
			className="py-16 md:py-24 bg-secondary"
		>
			<div className="container mx-auto px-4">
				<motion.div
					ref={headerRef}
					initial={{ opacity: 0, y: 12 }}
					animate={
						headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }
					}
					transition={{ duration: 0.45 }}
					className="text-center max-w-3xl mx-auto mb-16"
				>
					<p className="text-[#5DAD8C] font-semibold tracking-wide uppercase mb-2">
						BLOG O ISHRANI
					</p>
					<h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6 text-gray-800">
						Recepti i Savjeti o Ishrani
					</h2>
					<p className="text-gray-700">
						Istražite našu kolekciju zdravih recepata, savjeta o ishrani i
						wellness savjeta da vam pomognemo na vašem putovanju ka boljem
						zdravlju.
					</p>
				</motion.div>

				<motion.div
					ref={filtersRef}
					initial={{ opacity: 0, y: 12 }}
					animate={
						filtersInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }
					}
					transition={{ duration: 0.45, delay: 0.15 }}
					className="flex flex-wrap justify-center mb-12"
				>
					<button
						type="button"
						onClick={() => handleFilterChange("all")}
						className={`px-6 py-2 m-1 rounded-full font-medium transition ${
							activeFilter === "all"
								? "text-white"
								: "bg-white text-gray-600 hover:bg-gray-100"
						}`}
						style={
							activeFilter === "all"
								? { backgroundColor: "rgb(93, 173, 140)" }
								: {}
						}
					>
						Sve
					</button>
					{availableCategories.map((category) => (
						<button
							type="button"
							key={category}
							onClick={() => handleFilterChange(category)}
							className={`px-6 py-2 m-1 rounded-full font-medium transition ${
								activeFilter === category
									? "text-white"
									: "bg-white text-gray-600 hover:bg-gray-100"
							}`}
							style={
								activeFilter === category
									? { backgroundColor: "rgb(93, 173, 140)" }
									: {}
							}
						>
							{category}
						</button>
					))}
				</motion.div>

				{isLoading ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{[0, 1, 2].map((k) => (
							<div
								key={k}
								className="bg-white rounded-xl overflow-hidden shadow-lg h-96 animate-pulse"
							>
								<div className="h-56 bg-gray-200" />
								<div className="p-6 space-y-3">
									<div className="h-4 bg-gray-200 rounded w-1/3" />
									<div className="h-6 bg-gray-200 rounded w-full" />
									<div className="h-4 bg-gray-200 rounded w-full" />
								</div>
							</div>
						))}
					</div>
				) : visiblePosts.length === 0 ? (
					<p className="text-center text-gray-600 py-12">
						Trenutno nema članaka koji odgovaraju filteru.
					</p>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{visiblePosts.map((post, index) => (
							<BlogPostCard key={post.id} post={post} index={index} />
						))}
					</div>
				)}

				{hasMorePosts && (
					<motion.div
						ref={loadMoreRef}
						initial={{ opacity: 1, y: 12 }}
						animate={
							loadMoreInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 12 }
						}
						transition={{ duration: 0.45, delay: 0.3 }}
						className="text-center mt-12"
					>
						<button
							type="button"
							onClick={handleLoadMore}
							className="inline-block px-8 py-4 text-white rounded-md font-medium transition duration-300 ease-in-out shadow-md hover:shadow-lg hover:opacity-90"
							style={{ backgroundColor: "rgb(93, 173, 140)" }}
						>
							Učitaj Još
						</button>
					</motion.div>
				)}
			</div>
		</section>
	);
}

function BlogPostCard({ post, index }: { post: BlogPost; index: number }) {
	const { ref, inView } = useAnimateOnScroll(0.2 + index * 0.1);
	const [imageLoaded, setImageLoaded] = useState(false);
	const [imageError, setImageError] = useState(false);
	const isDesktopStagger =
		typeof window !== "undefined" &&
		window.matchMedia("(min-width: 769px)").matches &&
		!window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	const handleImageLoad = useCallback(() => {
		setImageLoaded(true);
	}, []);

	const handleImageError = useCallback(() => {
		setImageError(true);
		setImageLoaded(true);
	}, []);

	const displayCategory =
		post.categories && post.categories.length > 0
			? post.categories[0]
			: post.category;

	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, y: 12 }}
			animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
			transition={{
				duration: 0.45,
				delay: isDesktopStagger ? 0.2 + index * 0.1 : 0,
			}}
		>
			<Link href={`/clanci/${post.slug}`}>
				<div className="bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl h-full flex flex-col">
					<div className="h-56 overflow-hidden bg-gray-100 relative">
						{!imageLoaded && (
							<div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 flex items-center justify-center">
								<div className="w-12 h-12 rounded-full bg-gray-300"></div>
							</div>
						)}
						<img
							src={
								imageError
									? "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop&q=80"
									: post.thumbnail || post.image
							}
							alt={`${post.title} - savjeti nutricioniste za zdravu ishranu`}
							className={`w-full h-full object-cover transition-all duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
							width={600}
							height={400}
							loading="lazy"
							onLoad={handleImageLoad}
							onError={handleImageError}
						/>
					</div>
					<div className="p-6 flex flex-col flex-grow">
						<div className="flex items-center mb-3">
							<span
								className="text-white text-xs px-3 py-1 rounded-full font-medium"
								style={{ backgroundColor: "rgb(93, 173, 140)" }}
							>
								{displayCategory}
							</span>
							<span className="text-gray-500 text-sm ml-auto">
								{formatPostDate(post.date)}
							</span>
						</div>
						<h3 className="text-xl font-bold font-poppins mb-3 text-gray-800">
							{post.title}
						</h3>
						<p className="text-gray-600 mb-4 flex-grow">{post.excerpt}</p>
						<span
							className="font-medium transition flex items-center"
							style={{ color: "rgb(93, 173, 140)" }}
						>
							Pročitajte Članak{" "}
							<ArrowRight className="ml-2 inline-block h-4 w-4" />
						</span>
					</div>
				</div>
			</Link>
		</motion.div>
	);
}
