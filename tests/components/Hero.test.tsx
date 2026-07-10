import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Hero from '@/components/Hero';

describe('Hero', () => {
  it('renders title and subtitle', () => {
    render(<Hero title="Test Title" subtitle="Test Subtitle" />);
    expect(screen.getByText('Test Title')).toBeDefined();
    expect(screen.getByText('Test Subtitle')).toBeDefined();
  });

  it('title has heading class', () => {
    render(<Hero title="Title" subtitle="Subtitle" />);
    const title = screen.getByText('Title');
    expect(title.tagName).toBe('H1');
  });
});
