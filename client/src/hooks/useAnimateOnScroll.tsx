import { useEffect, useRef, useState } from "react";

export function useAnimateOnScroll(delay: number = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const isClient = typeof window !== "undefined";
    if (!isClient) return;

    const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // On small screens, keep UI stable and avoid jumpy entrance motion.
    if (isSmallScreen || prefersReducedMotion) {
      setInView(true);
      return;
    }

    const threshold = Math.min(Math.max(delay || 0.08, 0.02), 0.3);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            // Once it's in view, we don't need to observe anymore
            if (ref.current) {
              observer.unobserve(ref.current);
            }
          }
        });
      },
      {
        root: null,
        // Trigger slightly before full visibility for smoother scroll reveal.
        rootMargin: "0px 0px -6% 0px",
        threshold,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return { ref, inView };
}
