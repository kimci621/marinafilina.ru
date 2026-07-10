import { vi } from 'vitest';

// Mock framer-motion for jsdom
vi.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    section: 'section',
    article: 'article',
    footer: 'footer',
    span: 'span',
    p: 'p',
    a: 'a',
  },
  AnimatePresence: ({ children }: any) => children,
  useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
  useTransform: () => ({ get: () => '0px' }),
  useMotionValue: (v: any) => ({ get: () => v, set: () => {} }),
}));
