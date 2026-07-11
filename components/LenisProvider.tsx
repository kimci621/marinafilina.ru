'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // Auto-resize when DOM height changes (expand/collapse, dynamic content)
    const observer = new ResizeObserver(() => {
      lenis.resize();
    });
    observer.observe(document.body);

    return () => {
      observer.disconnect();
      lenis.destroy();
    };
  }, []);

  // Reset scroll position on route change
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    lenis.scrollTo(0, { immediate: true });
    setTimeout(() => lenis.resize(), 100);
  }, [pathname]);

  return <>{children}</>;
}
