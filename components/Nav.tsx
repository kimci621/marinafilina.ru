'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { NavLink } from '@/types/content';

interface NavProps {
  logo: string;
  links: NavLink[];
}

export default function Nav({ logo, links }: NavProps) {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setVisible(currentScrollY < lastScrollY || currentScrollY < 10);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-surface transition-transform duration-300 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="content-container h-[61px] flex items-center justify-between">
        <Link
          href="/"
          className="text-(--color-text-nav) text-nav hover:opacity-70 transition-opacity"
        >
          {logo}
        </Link>

        <div className="hidden tablet:flex items-center gap-[50px]">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-(--color-text) text-nav hover:opacity-70 transition-opacity"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
