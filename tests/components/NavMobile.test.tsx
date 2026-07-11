import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NavMobile from '@/components/NavMobile';

vi.mock('next/link', () => ({ default: ({ children, href, ...p }: any) => <a href={href} {...p}>{children}</a> }));

const ui = { menuOpen: 'Close', menuClosed: 'Меню' };

describe('NavMobile', () => {
  it('renders logo and menu button', () => { render(<NavMobile logo="Марина Филина" links={[{label:'Work',href:'/#work'}]} ui={ui} />); expect(screen.getByText('Марина Филина')).toBeDefined(); expect(screen.getByText('Меню')).toBeDefined(); });
  it('toggles menu', () => { render(<NavMobile logo="MF" links={[{label:'Work',href:'/#work'},{label:'About',href:'/about'}]} ui={ui} />); fireEvent.click(screen.getByText('Меню')); expect(screen.getByText('Work')).toBeDefined(); });
});
