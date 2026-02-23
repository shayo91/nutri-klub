import { useEffect } from "react";
import { useLocation } from "wouter";

const GA_MEASUREMENT_ID = "G-Y3P56YLK9L";

declare global {
	interface Window {
		gtag?: (command: string, ...args: unknown[]) => void;
		dataLayer?: unknown[];
	}
}

/**
 * Sends a virtual page_view to Google Analytics on each client-side route change.
 * Required for SPAs so GA records the correct path for every "page" visit.
 */
export default function GoogleAnalytics() {
	const [pathname] = useLocation();

	useEffect(() => {
		if (typeof window.gtag === "function") {
			window.gtag("config", GA_MEASUREMENT_ID, {
				page_path: pathname,
			});
		}
	}, [pathname]);

	return null;
}
