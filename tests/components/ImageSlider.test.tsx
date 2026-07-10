import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ImageSlider from '@/components/ImageSlider';

vi.mock('next/image', () => ({
  default: ({ src, alt, fill, className, sizes }: any) => (
    <img src={src} alt={alt} className={className} data-fill={fill} data-sizes={sizes} />
  ),
}));

describe('ImageSlider', () => {
  const images = ['/test-1.jpg', '/test-2.jpg', '/test-3.jpg'];

  it('renders all images', () => {
    render(<ImageSlider images={images} />);
    const imgs = screen.getAllByRole('img');
    expect(imgs).toHaveLength(3);
  });

  it('renders placeholder when no images', () => {
    render(<ImageSlider images={[]} />);
    expect(screen.getByTestId('slider-placeholder')).toBeDefined();
  });

  it('has scroll-snap styles', () => {
    const { container } = render(<ImageSlider images={images} />);
    const track = container.querySelector('[data-testid="slider-track"]');
    expect(track).toBeDefined();
  });
});
