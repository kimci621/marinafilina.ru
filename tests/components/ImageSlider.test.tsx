import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ImageSlider from '@/components/ImageSlider';

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
