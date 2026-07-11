'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  // Initialize Lenis once
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

    return () => {
      lenis.destroy();
    };
  }, []);

  // On route change: reset scroll position and recalculate
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    // Reset scroll to top
    lenis.scrollTo(0, { immediate: true });

    // Force Lenis to recalculate after AnimatePresence finishes
    // AnimatePresence mode="wait" takes ~550ms (enter 500ms)
    const timer = setTimeout(() => {
      lenis.resize();
    }, 600);

    return () => clearTimeout(timer);
  }, [pathname]);

  return <>{children}</>;
}
