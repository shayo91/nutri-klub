import BlogSection from "@/components/BlogSection";
import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "@/lib/types";
import { Helmet } from "react-helmet";

interface BlogResponse {
	posts: BlogPost[];
	categories: string[];
}

export default function Blog() {
	const { data: blogData, isPending } = useQuery<BlogResponse>({
		queryKey: ["/api/blog-posts"],
		staleTime: 60 * 1000,
	});

	return (
		<>
			<Helmet>
				<title>Blog o ishrani | Nutricionista Jelena Matijaš</title>
				<meta
					name="description"
					content="Recepti, savjeti o ishrani i zdravlju od nutricioniste Jelene Matijaš. Članci o makronutrijentima, planiranju obroka i zdravom načinu života u BiH."
				/>
				<meta
					property="og:title"
					content="Blog o ishrani | Nutricionista Jelena Matijaš"
				/>
				<meta
					property="og:description"
					content="Recepti i savjeti o ishrani od nutricioniste Jelene Matijaš."
				/>
				<meta
					property="og:image"
					content="https://nutricionistajelena.ba/attached_assets/jelena-hero.png"
				/>
				<meta property="og:locale" content="bs_BA" />
				<link rel="canonical" href="https://nutricionistajelena.ba/blog" />
			</Helmet>
			<BlogSection
				posts={blogData?.posts}
				categories={blogData?.categories}
				isLoading={isPending}
				sectionId={false}
				showAllPosts
			/>
		</>
	);
}
