import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import BreadcrumbSchema from "./BreadcrumbSchema";

interface LayoutProps {
	children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
	return (
		<div className="min-h-screen flex flex-col">
			<a href="#main-content" className="skip-link">
				Preskoči na sadržaj
			</a>
			<BreadcrumbSchema />
			<Header />
			<main id="main-content" className="flex-grow" tabIndex={-1}>
				{children}
			</main>
			<Footer />
		</div>
	);
}
