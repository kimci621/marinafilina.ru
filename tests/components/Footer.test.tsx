import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '@/components/Footer';
import type { FooterContent } from '@/types/content';

const mockFooter: FooterContent = {
  logo: 'Марина Филина',
  email: 'test@test.com',
  phone: '+7 903 650 65 99',
  socials: [
    { label: 'Telegram', url: 'https://t.me/test' },
    { label: 'Behance', url: 'https://behance.net/test' },
  ],
};

describe('Footer', () => {
  it('renders logo', () => {
    render(<Footer content={mockFooter} />);
    expect(screen.getByText('Марина Филина')).toBeDefined();
  });

  it('renders social links', () => {
    render(<Footer content={mockFooter} />);
    expect(screen.getByText('Telegram')).toBeDefined();
    expect(screen.getByText('Behance')).toBeDefined();
  });

  it('renders contacts heading', () => {
    render(<Footer content={mockFooter} />);
    expect(screen.getByText('СОЦСЕТИ')).toBeDefined();
  });
});
