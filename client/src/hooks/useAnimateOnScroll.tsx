import { useEffect, useRef, useState } from "react";

export function useAnimateOnScroll(delay: number = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
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
        rootMargin: "0px",
        threshold: 0.1, // Trigger when at least 10% of the element is visible
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
