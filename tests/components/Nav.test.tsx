import { describe, it, expect } from 'vitest';
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

  it('renders logo', () => {
    render(<Nav {...defaultProps} />);
    expect(screen.getByText('Марина Филина')).toBeDefined();
  });

  it('renders nav links', () => {
    render(<Nav {...defaultProps} />);
    expect(screen.getByText('Обо мне')).toBeDefined();
    expect(screen.getByText('Контакты')).toBeDefined();
  });

  it('logo links to home', () => {
    render(<Nav {...defaultProps} />);
    const logoLink = screen.getByText('Марина Филина').closest('a');
    expect(logoLink?.getAttribute('href')).toBe('/');
  });
});
