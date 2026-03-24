import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Helmet } from "react-helmet";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

interface BlogPostData {
	id: string;
	title: string;
	excerpt: string;
	category: string;
	categories?: string[];
	image: string;
	date: string;
	slug: string;
	author: {
		name: string;
		avatar?: string;
	};
	bodyMarkdown?: string;
}

const markdownComponents: Components = {
	img: ({ src, alt }) => (
		<img
			src={src ?? ""}
			alt={alt ?? "Ilustracija članka"}
			className="w-full rounded-lg shadow-md my-6"
			width={800}
			height={450}
			loading="lazy"
		/>
	),
	a: ({ href, children }) => (
		<a
			href={href}
			className="text-primary hover:underline"
			target="_blank"
			rel="noopener noreferrer"
		>
			{children}
		</a>
	),
}

export default function BlogPost() {
	const [, params] = useRoute("/clanci/:slug");
	const [post, setPost] = useState<BlogPostData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		window.scrollTo(0, 0);
		if (params?.slug) {
			fetchBlogPost(params.slug);
		}
	}, [params?.slug]);

	const fetchBlogPost = async (slug: string) => {
		try {
			setLoading(true);
			const trimmedSlug = slug.trim();
			if (!trimmedSlug) {
				setError(true);
				return;
			}
			const url = `/api/blog-posts/by-slug/${encodeURIComponent(trimmedSlug)}`;
			const response = await fetch(url);
			if (response.ok) {
				const fullPost = (await response.json()) as BlogPostData;
				setPost(fullPost);
			} else {
				setError(true);
			}
		} catch (err) {
			console.error("Error fetching blog post:", err);
			setError(true);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-gray-600">Učitavam članak...</p>
				</div>
			</div>
		);
	}

	if (error || !post) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-4xl font-bold text-gray-800 mb-4">Članak nije pronađen</h1>
					<p className="text-gray-600 mb-8">
						Žao nam je, traženi članak ne postoji ili je uklonjen.
					</p>
					<Link href="/blog">
						<a className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
							<ArrowLeft className="w-4 h-4 mr-2" />
							Nazad na blog
						</a>
					</Link>
				</div>
			</div>
		);
	}

	const body = post.bodyMarkdown?.trim() ?? "";
	const displayCategory =
		post.categories && post.categories.length > 0
			? post.categories[0]
			: post.category;

	return (
		<div className="min-h-screen bg-gray-50">
			<Helmet>
				<title>{post.title} | Nutricionista Jelena Matijaš</title>
				<meta
					name="description"
					content={
						post.excerpt ||
						`${post.title} - savjeti nutricionista za zdravlje i ishranu u BiH`
					}
				/>
				<meta
					property="og:title"
					content={`${post.title} | Nutricionista Jelena Matijaš`}
				/>
				<meta
					property="og:description"
					content={
						post.excerpt ||
						`${post.title} - savjeti nutricionista za zdravlje i ishranu u BiH`
					}
				/>
				<meta property="og:type" content="article" />
				{post.image && <meta property="og:image" content={post.image} />}
				<meta property="og:locale" content="bs_BA" />
				<link
					rel="canonical"
					href={`https://nutricionistajelena.ba/clanci/${post.slug}`}
				/>
				<meta property="article:author" content={post.author.name} />
				<meta property="article:section" content={displayCategory} />
				{post.date &&
					(() => {
						const d = new Date(post.date);
						return !isNaN(d.getTime()) ? (
							<meta property="article:published_time" content={d.toISOString()} />
						) : null;
					})()}
				<meta name="twitter:card" content="summary_large_image" />
				<meta
					name="twitter:title"
					content={`${post.title} | Nutricionista Jelena Matijaš`}
				/>
				<meta
					name="twitter:description"
					content={
						post.excerpt ||
						`${post.title} - savjeti nutricionista za zdravlje i ishranu u BiH`
					}
				/>
				{post.image && <meta name="twitter:image" content={post.image} />}
				<script type="application/ld+json">
					{JSON.stringify({
						"@context": "https://schema.org",
						"@type": "Article",
						headline: post.title,
						description:
							post.excerpt ||
							`${post.title} - savjeti nutricionista za zdravlje i ishranu u BiH`,
						image: post.image || "",
						author: {
							"@type": "Person",
							name: post.author.name,
							jobTitle: "Magistar nutricionizma",
							url: "https://nutricionistajelena.ba/o-meni",
						},
						publisher: {
							"@type": "Organization",
							name: "Nutricionista Jelena Matijaš - Nutricionista Jelena Matijaš",
							url: "https://nutricionistajelena.ba",
							logo: {
								"@type": "ImageObject",
								url: "https://nutricionistajelena.ba/attached_assets/jelena-hero.png",
							},
						},
						datePublished: post.date
							? new Date(post.date).toISOString()
							: undefined,
						mainEntityOfPage: {
							"@type": "WebPage",
							"@id": `https://nutricionistajelena.ba/clanci/${post.slug}`,
						},
						articleSection: displayCategory,
						inLanguage: "bs",
					})}
				</script>
			</Helmet>
			<div className="relative h-96 bg-gray-900 overflow-hidden">
				{post.image && (
					<img
						src={post.image}
						alt={`${post.title} - blog nutricionista Jelena Matijaš`}
						width={1200}
						height={630}
						className="absolute inset-0 w-full h-full object-cover opacity-60"
					/>
				)}
				<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
				<div className="relative container mx-auto px-4 h-full flex items-center">
					<div className="max-w-4xl">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
						>
							<div className="inline-block bg-primary/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
								{displayCategory}
							</div>
							<h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
								{post.title}
							</h1>
							<div className="flex items-center space-x-6 text-white/90">
								<div className="flex items-center space-x-2">
									<User className="w-4 h-4" />
									<span>{post.author.name}</span>
								</div>
								<div className="flex items-center space-x-2">
									<Calendar className="w-4 h-4" />
									<span>
										{new Date(post.date).toLocaleDateString("sr-RS")}
									</span>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 py-12">
				<div className="max-w-4xl mx-auto">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
						className="mb-8"
					>
						<Link href="/blog">
							<a className="inline-flex items-center text-primary hover:text-primary-hover transition-colors">
								<ArrowLeft className="w-4 h-4 mr-2" />
								Nazad na blog
							</a>
						</Link>
					</motion.div>

					<motion.article
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
					>
						{post.excerpt && (
							<div className="text-xl text-gray-700 leading-relaxed mb-8 p-6 bg-gray-50 rounded-lg border-l-4 border-primary">
								{post.excerpt}
							</div>
						)}

						{body ? (
							<div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900">
								<ReactMarkdown
									remarkPlugins={[remarkGfm]}
									components={markdownComponents}
								>
									{body}
								</ReactMarkdown>
							</div>
						) : (
							<div className="text-gray-600 text-center py-8">
								<p>Sadržaj članka će uskoro biti dostupan.</p>
							</div>
						)}

						<div className="mt-12 pt-8 border-t border-gray-200">
							<div className="flex items-center space-x-4">
								<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
									<User className="w-8 h-8 text-primary" />
								</div>
								<div>
									<h3 className="font-semibold text-lg text-gray-800">
										{post.author.name}
									</h3>
									<p className="text-gray-600">Sertifikovani nutricionista</p>
								</div>
							</div>
						</div>
					</motion.article>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}
						className="mt-12 bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-center text-white"
					>
						<h2 className="text-2xl font-bold mb-4">
							Želite personalizovan plan ishrane?
						</h2>
						<p className="text-lg mb-6 opacity-90">
							Zakažite konsultaciju i početkite putovanje ka zdravijem življenju
						</p>
						<Link href="/#contact">
							<a className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
								Zakažite Konsultaciju
							</a>
						</Link>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
