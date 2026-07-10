import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NavMobile from '@/components/NavMobile';

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));

const defaultProps = {
  logo: 'Марина Филина',
  links: [
    { label: 'Work', href: '/#work' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '#contacts' },
  ],
};

describe('NavMobile', () => {
  it('renders logo and menu button', () => {
    render(<NavMobile {...defaultProps} />);
    expect(screen.getByText('Марина Филина')).toBeDefined();
    expect(screen.getByText('Меню')).toBeDefined();
  });

  it('toggles menu on click', () => {
    render(<NavMobile {...defaultProps} />);
    fireEvent.click(screen.getByText('Меню'));
    expect(screen.getByText('Work')).toBeDefined();
    expect(screen.getByText('About')).toBeDefined();
  });
});
