import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CTASection from '@/components/CTASection';

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));

describe('CTASection', () => {
  it('renders CTA text', () => {
    render(<CTASection text="Расскажите о своих задачах" />);
    expect(screen.getByText('Расскажите о своих задачах')).toBeDefined();
  });

  it('renders two divider lines', () => {
    const { container } = render(<CTASection text="Test CTA" />);
    const dividers = container.querySelectorAll('[data-testid="divider-line"]');
    expect(dividers).toHaveLength(2);
  });
});
