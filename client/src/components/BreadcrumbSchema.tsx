import { useLocation, useRoute } from "wouter";
import { Helmet } from "react-helmet";

const BASE_URL = "https://nutriputovanje.com";

const routeBreadcrumbs: Record<string, { name: string; path: string }[]> = {
	"/": [{ name: "Početna", path: "/" }],
	"/about": [
		{ name: "Početna", path: "/" },
		{ name: "O Meni", path: "/about" },
	],
	"/privacy": [
		{ name: "Početna", path: "/" },
		{ name: "Pravila Privatnosti", path: "/privacy" },
	],
	"/terms": [
		{ name: "Početna", path: "/" },
		{ name: "Uslovi Poslovanja", path: "/terms" },
	],
	"/cookies": [
		{ name: "Početna", path: "/" },
		{ name: "Pravila o Kolačićima", path: "/cookies" },
	],
};

export default function BreadcrumbSchema() {
	const [location] = useLocation();
	const [, params] = useRoute("/blog/:slug");

	let items: { name: string; path: string }[];

	if (params?.slug) {
		items = [
			{ name: "Početna", path: "/" },
			{ name: "Blog", path: "/#blog" },
			{ name: params.slug.replace(/-/g, " "), path: `/blog/${params.slug}` },
		];
	} else {
		items = routeBreadcrumbs[location] || [{ name: "Početna", path: "/" }];
	}

	const schema = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, i) => ({
			"@type": "ListItem",
			position: i + 1,
			name: item.name,
			item: `${BASE_URL}${item.path}`,
		})),
	};

	return (
		<Helmet>
			<script type="application/ld+json">{JSON.stringify(schema)}</script>
		</Helmet>
	);
}
