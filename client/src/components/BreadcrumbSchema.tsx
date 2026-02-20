import { useLocation, useRoute } from "wouter";
import { Helmet } from "react-helmet";

const BASE_URL = "https://nutricionistajelena.ba";

const routeBreadcrumbs: Record<string, { name: string; path: string }[]> = {
	"/": [{ name: "Početna", path: "/" }],
	"/o-meni": [
		{ name: "Početna", path: "/" },
		{ name: "O Meni", path: "/o-meni" },
	],
	"/pravila-privatnosti": [
		{ name: "Početna", path: "/" },
		{ name: "Pravila Privatnosti", path: "/pravila-privatnosti" },
	],
	"/uslovi-poslovanja": [
		{ name: "Početna", path: "/" },
		{ name: "Uslovi Poslovanja", path: "/uslovi-poslovanja" },
	],
	"/kolacici": [
		{ name: "Početna", path: "/" },
		{ name: "Pravila o Kolačićima", path: "/kolacici" },
	],
};

export default function BreadcrumbSchema() {
	const [location] = useLocation();
	const [, params] = useRoute("/clanci/:slug");

	let items: { name: string; path: string }[];

	if (params?.slug) {
		items = [
			{ name: "Početna", path: "/" },
			{ name: "Članci", path: "/#blog" },
			{ name: params.slug.replace(/-/g, " "), path: `/clanci/${params.slug}` },
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
