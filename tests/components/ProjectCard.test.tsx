import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProjectCard from '@/components/ProjectCard';

vi.mock('@/components/ImageSlider', () => ({ default: ({ images }: any) => <div data-testid="image-slider">{images.length} images</div> }));
vi.mock('next/link', () => ({ default: ({ children, href, ...p }: any) => <a href={href} {...p}>{children}</a> }));

const ui = { label: 'Project', linkText: 'Посмотреть проект', linkArrow: '→' };

describe('ProjectCard', () => {
  it('renders title and label', () => { render(<ProjectCard title="Test" subtitle="" images={[]} description="" slug="test" ui={ui} />); expect(screen.getByText('Test')).toBeDefined(); expect(screen.getByText('Project')).toBeDefined(); });
  it('renders link', () => { render(<ProjectCard title="T" subtitle="" images={[]} description="" slug="test" ui={ui} />); expect(screen.getByTestId('project-link').getAttribute('href')).toBe('/test'); });
});
