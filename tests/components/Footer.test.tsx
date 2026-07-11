import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '@/components/Footer';
import type { FooterContent } from '@/types/content';

const mockFooter: FooterContent = { logo: 'Марина Филина', email: 't@t.com', phone: '+7', socials: [{ label: 'TG', url: '' }] };
const ui = { socialsLabel: 'СОЦСЕТИ' };

describe('Footer', () => {
  it('renders logo', () => { render(<Footer content={mockFooter} ui={ui} />); expect(screen.getByText('Марина Филина')).toBeDefined(); });
  it('renders socials', () => { render(<Footer content={mockFooter} ui={ui} />); expect(screen.getByText('TG')).toBeDefined(); expect(screen.getByText('СОЦСЕТИ')).toBeDefined(); });
});
