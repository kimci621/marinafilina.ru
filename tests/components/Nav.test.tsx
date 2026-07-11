import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Nav from '@/components/Nav';

describe('Nav', () => {
  const defaultProps = {
    logo: 'Марина Филина',
    links: [
      { label: 'Обо мне', href: '/about' },
      { label: 'Контакты', href: '#contacts' },
    ],
  };

  it('renders logo', () => { render(<Nav {...defaultProps} />); expect(screen.getByText('Марина Филина')).toBeDefined(); });
  it('renders nav links', () => { render(<Nav {...defaultProps} />); expect(screen.getByText('Обо мне')).toBeDefined(); });
  it('logo links to home', () => { render(<Nav {...defaultProps} />); expect(screen.getByText('Марина Филина').closest('a')?.getAttribute('href')).toBe('/'); });
});
