import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProjectCard from '@/components/ProjectCard';

vi.mock('@/components/ImageSlider', () => ({
  default: ({ images }: any) => <div data-testid="image-slider">{images.length} images</div>,
}));
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));

const mockProject = {
  title: 'Test Project',
  subtitle: 'Test Subtitle',
  images: [],
  description: 'Test description.',
  slug: 'test-project',
};

describe('ProjectCard', () => {
  it('renders project title', () => {
    render(<ProjectCard {...mockProject} />);
    expect(screen.getByText('Test Project')).toBeDefined();
  });

  it('renders project link', () => {
    render(<ProjectCard {...mockProject} />);
    const link = screen.getByTestId('project-link');
    expect(link).toBeDefined();
    expect(link.getAttribute('href')).toBe('/test-project');
  });

  it('renders label', () => {
    render(<ProjectCard {...mockProject} />);
    expect(screen.getByTestId('project-label')).toBeDefined();
    expect(screen.getByTestId('project-label').textContent).toBe('Project');
  });
});
