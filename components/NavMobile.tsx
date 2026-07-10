'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { NavLink } from '@/types/content';

interface NavMobileProps {
  logo: string;
  links: NavLink[];
}

export default function NavMobile({ logo, links }: NavMobileProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <nav className="tablet:hidden fixed top-0 left-0 right-0 z-50 bg-surface">
      <div className="content-container h-[53px] flex items-center justify-between">
        <Link
          href="/"
          className="text-(--color-text-nav) text-nav hover:opacity-70 transition-opacity"
          onClick={() => setMenuOpen(false)}
        >
          {logo}
        </Link>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-(--color-text-nav) text-nav hover:opacity-70 transition-opacity"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? 'Close' : 'Меню'}
        </button>
      </div>

      {menuOpen && (
        <div className="content-container pt-[15px] pb-[30px]">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-(--color-text) text-nav py-[13px] hover:opacity-70 transition-opacity"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
