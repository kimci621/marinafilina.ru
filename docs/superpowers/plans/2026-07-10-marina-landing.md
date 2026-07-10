# Marina Landing — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a pixel-perfect Next.js portfolio site for Марина Филина from Figma design, with hidden admin panel for content editing.

**Architecture:** Next.js 14 App Router, Tailwind CSS, Framer Motion, Lenis smooth scroll. Content in JSON, editable via protected admin. SSG for all public pages, ISR for content updates.

**Tech Stack:** Next.js 14, TypeScript strict, Tailwind CSS, Framer Motion, Lenis, Vitest + RTL, Playwright, Vercel KV (content storage)

---

## Phase 1: Foundation

### Task 1: Initialize Next.js project

**Files:**
- Create: all scaffold files via create-next-app

- [ ] **Step 1: Scaffold Next.js with TypeScript + Tailwind**

```bash
npx create-next-app@latest marina-landing --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
cd marina-landing
```

- [ ] **Step 2: Install core dependencies**

```bash
npm install framer-motion lenis
npm install -D vitest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react jsdom
npm install -D @playwright/test
npm install bcryptjs jsonwebtoken
npm install -D @types/bcryptjs @types/jsonwebtoken
npm install @vercel/kv
```

- [ ] **Step 3: Verify project runs**

```bash
npm run dev
```

Expected: dev server starts on localhost:3000, shows default Next.js page.
Stop server after verification.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: scaffold Next.js with TypeScript, Tailwind, dependencies"
```

### Task 2: TypeScript types for content system

**Files:**
- Create: `types/content.ts`

- [ ] **Step 1: Write the types file**

```typescript
// types/content.ts
export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  url: string;
}

export interface HeroContent {
  title: string;
  subtitle: string;
}

export interface ProjectContent {
  title: string;
  subtitle: string;
  description: string;
  images: string[];
  category: string;
  client: string;
  task: string;
  concept: string;
  services: string[];
  timeline: string;
  liveUrl: string;
}

export interface AboutContent {
  photo: string;
  name: string;
  headline: string;
  bio: string;
  services: { title: string; description: string }[];
  experience: string[];
  education: string[];
  contact: {
    phone: string;
    email: string;
  };
}

export interface FooterContent {
  logo: string;
  email: string;
  phone: string;
  socials: SocialLink[];
}

export interface SEOContent {
  title: string;
  description: string;
}

export interface SiteContent {
  nav: {
    logo: string;
    links: NavLink[];
  };
  home: {
    hero: HeroContent;
    projects: string[];
    cta: string;
  };
  about: AboutContent;
  projects: Record<string, ProjectContent>;
  footer: FooterContent;
  seo: Record<string, SEOContent>;
}
```

- [ ] **Step 2: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add types/content.ts && git commit -m "feat: add TypeScript types for content system"
```

### Task 3: Default content data

**Files:**
- Create: `data/content.json`

- [ ] **Step 1: Create content.json with all default content from Figma**

```json
{
  "nav": {
    "logo": "Марина Филина",
    "links": [
      { "label": "Обо мне", "href": "/about" },
      { "label": "Контакты", "href": "#contacts" }
    ]
  },
  "home": {
    "hero": {
      "title": "Внештатный арт-директор бренда",
      "subtitle": "Руководителям и менеджерам пусть останется только управленческая и стратегическая работа. Я займусь визуалом и его качеством."
    },
    "projects": ["faculty-amm", "flysurf", "syntepart", "fittin", "manipula"],
    "cta": "Расскажите о своих задачах на консультации"
  },
  "about": {
    "photo": "",
    "name": "Марина Филина",
    "headline": "Создам образ бренда, продающий вашу идею",
    "bio": "Бренд-дизайнер. Окончила ВГУ ПММ в 2021 году. 2.5 года опыта работы графическим дизайнером.",
    "services": [
      {
        "title": "Бренд с нуля",
        "description": "Делаю собственный визуальный язык бренда: узнаваемый, понятный и вызывающий доверие."
      },
      {
        "title": "Обновление",
        "description": "Сохраняю узнаваемость бренда. Учу его общаться с новой аудиторией и радовать прежнюю."
      },
      {
        "title": "Поддержка",
        "description": "Провожу авторский надзор внедрения фирменного стиля, чтобы всё было так, как надо."
      }
    ],
    "experience": [
      "2.5 года опыта работы графическим дизайнером",
      "1 год опыта преподавания дизайна и программирования в частной школе",
      "Преподаватель дизайна и программирования в IT-школе KiberOne",
      "Репетитор по дизайну для начинающих специалистов",
      "Лекция о брендинге на форуме «Медиареальность»",
      "Лекция о творческом мышлении на форуме AIESEC UPDATE 2023"
    ],
    "education": [
      "Факультет прикладной математики, информатики и механики Воронежского государственного университета"
    ],
    "contact": {
      "phone": "+7 903 650 65 99",
      "email": ""
    }
  },
  "projects": {
    "faculty-amm": {
      "title": "Фирменный стиль факультета ПММ",
      "subtitle": "Факультет прикладной математики, информатики и механики ВГУ",
      "description": "Для каждого из 9 направлений обучения на факультете создан цвет, наиболее подходящий под культурные стереотипы наполнения учебной программы. В основу пиктограмм каждого направления легла форма логотипа и греческие буквы.",
      "images": [],
      "category": "Айдентика, лого",
      "client": "Факультет ПММ ВГУ",
      "task": "Обновить старый фирменный стиль, чтобы выглядеть современно",
      "concept": "Генеративная графика с цветовым кодированием 9 направлений обучения. Греческие буквы как основа пиктограмм.",
      "services": ["Айдентика", "Логотип", "Гайдбук", "Генеративная графика"],
      "timeline": "",
      "liveUrl": ""
    },
    "flysurf": {
      "title": "Fly Surf Camp",
      "subtitle": "Брендинг сообщества водного спорта",
      "description": "Бренд сообщества по интересам, альтернатива ночным тусовкам и место поиска новых друзей, философия ЗОЖ. Сегмент: премиум. Активный период: с мая по сентябрь.",
      "images": [],
      "category": "Брендинг",
      "client": "Fly Surf Camp",
      "task": "Создать бренд водного сообщества премиум-сегмента",
      "concept": "Забота о себе и единение с природой — новый люкс. Креативная, заряженная аудитория.",
      "services": ["Брендинг", "Логотип", "Фирменный стиль"],
      "timeline": "Этап исследования: 2 недели. Этап реализации: 8 недель.",
      "liveUrl": ""
    },
    "syntepart": {
      "title": "Айдентика завода SYNTEPART",
      "subtitle": "Ferrum-26. Чистый состав.",
      "description": "Фирменный стиль для механического завода. Шрифт с надёжным фундаментом: каждая литера — несущая конструкция из форм металлопрофиля.",
      "images": [],
      "category": "Айдентика, шрифт, нейминг",
      "client": "Механический завод",
      "task": "Сохранить советское наследие, но прийти в новый век",
      "concept": "100% железа. 0% выбросов. Шрифт Морзе, построенный на формах металлопрофиля. Концепт по методологии полного цикла.",
      "services": ["Айдентика", "Шрифт", "Нейминг", "Слоган", "Гайдлайны"],
      "timeline": "Этап исследования: 2 недели. Этап реализации: 8 недель. Всего: 10 недель.",
      "liveUrl": ""
    },
    "fittin": {
      "title": "Ребрендинг IT-компании FITTIN",
      "subtitle": "Айдентика для мобильной разработки",
      "description": "Айдентика, которая говорит о новой нише компании — мобильной разработке. Шрифт Морзе как основа визуального языка.",
      "images": [],
      "category": "Айдентика",
      "client": "IT-компания FITTIN",
      "task": "Создать айдентику, которая бы говорила о новой нише компании — мобильной разработке",
      "concept": "Шрифт Морзе, блочная структура макета с явной разбивкой линиями. Канцелярия повторяет блочную структуру.",
      "services": ["Айдентика", "Логотип", "Шрифт Морзе", "Гайдлайны"],
      "timeline": "",
      "liveUrl": ""
    },
    "manipula": {
      "title": "Айдентика Manipula",
      "subtitle": "Сеть салонов лазерной эпиляции",
      "description": "Семиотика бренда: наука о знаках и знаковых системах. Чтобы вызывать только нужные ассоциации и избегать того, что может оттолкнуть клиента.",
      "images": [],
      "category": "Айдентика, семиотика",
      "client": "Сеть салонов лазерной эпиляции «Manipula»",
      "task": "Отстроиться от конкурентов и создать вайб безопасности и расслабления",
      "concept": "Округлые линии, мягкие текстуры, много «воздуха» в макете, пастельные цвета, расслабленные лица, милые образы. Избегать: треугольники, острые кривые, резкий контраст, огонь, иглы.",
      "services": ["Айдентика", "Семиотика", "Гайдбук", "Генерации в Midjourney"],
      "timeline": "",
      "liveUrl": ""
    }
  },
  "footer": {
    "logo": "Марина Филина",
    "email": "",
    "phone": "+7 903 650 65 99",
    "socials": [
      { "label": "Behance", "url": "" },
      { "label": "Telegram", "url": "" },
      { "label": "TG-канал", "url": "" },
      { "label": "VK", "url": "" },
      { "label": "Soundcloud", "url": "" }
    ]
  },
  "seo": {
    "home": {
      "title": "Марина Филина — Внештатный арт-директор бренда",
      "description": "Портфолио Марины Филиной. Бренд-дизайнер. Создам образ бренда, продающий вашу идею."
    },
    "about": {
      "title": "Обо мне — Марина Филина",
      "description": "Бренд-дизайнер Марина Филина. Брендинг, айдентика, графический дизайн."
    }
  }
}
```

- [ ] **Step 2: Validate JSON is parseable**

```bash
node -e "const c = require('./data/content.json'); console.log('OK:', Object.keys(c).join(', '))"
```

Expected: `OK: nav, home, about, projects, footer, seo`

- [ ] **Step 3: Commit**

```bash
git add data/content.json && git commit -m "feat: add default content.json from Figma"
```

### Task 4: Content reading utility

**Files:**
- Create: `lib/content.ts`

- [ ] **Step 1: Write content.ts with getContent function**

```typescript
// lib/content.ts
import { kv } from '@vercel/kv';
import type { SiteContent } from '@/types/content';
import defaultContent from '@/data/content.json';

const CONTENT_KEY = 'site:content';

export async function getContent(): Promise<SiteContent> {
  try {
    const stored = await kv.get<SiteContent>(CONTENT_KEY);
    if (stored && stored.nav && stored.home) {
      return stored;
    }
  } catch {
    // KV not available (dev mode), use default JSON
  }
  return defaultContent as SiteContent;
}

export async function updateContent(content: SiteContent): Promise<void> {
  await kv.set(CONTENT_KEY, content);
}

export async function getProjectSlugs(): Promise<string[]> {
  const content = await getContent();
  return content.home.projects;
}

export async function getProject(slug: string): Promise<SiteContent['projects'][string] | null> {
  const content = await getContent();
  return content.projects[slug] || null;
}
```

- [ ] **Step 2: Verify imports resolve**

```bash
npx tsc --noEmit
```

Expected: no errors. (May need `resolveJsonModule: true` in tsconfig)

- [ ] **Step 3: Commit**

```bash
git add lib/content.ts && git commit -m "feat: add content reading utility with KV fallback"
```

### Task 5: Design tokens from Figma

**Files:**
- Create: `tailwind.config.ts` (overwrite)
- Create: `app/globals.css` (overwrite)
- Create: `design-system/tokens.json`

- [ ] **Step 1: Write design tokens JSON**

```json
{
  "colors": {
    "text": "#000000",
    "textMuted": "#767676",
    "textNav": "#1e1e1e",
    "surface": "#ffffff",
    "background": "#ffffff"
  },
  "typography": {
    "fontFamily": "Inter",
    "sizes": {
      "hero": { "desktop": "64px", "tablet": "64px", "mobile": "44px" },
      "subtitle": { "desktop": "37px", "tablet": "30px", "mobile": "24px" },
      "h3": "30px",
      "h4": "24px",
      "label": "16px",
      "bodyLg": "20px",
      "body": "16px",
      "link": "16px",
      "linkLg": "20px",
      "nav": "20px"
    }
  },
  "breakpoints": {
    "mobile": 375,
    "tablet": 800,
    "desktop": 1280
  },
  "layout": {
    "contentWidth": { "desktop": 1250, "tablet": 770, "mobile": 345 },
    "sidePadding": 15,
    "sliderImageSize": { "desktop": 460, "mobile": 280 }
  }
}
```

- [ ] **Step 2: Configure Tailwind with design tokens**

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        text: '#000000',
        'text-muted': '#767676',
        'text-nav': '#1e1e1e',
        surface: '#ffffff',
        background: '#ffffff',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'hero-desktop': ['64px', { lineHeight: '70.4px', letterSpacing: '-0.05em' }],
        'hero-mobile': ['44px', { lineHeight: '48.4px' }],
        'subtitle-desktop': ['37px', { lineHeight: '40.7px' }],
        'subtitle-tablet': ['30px', { lineHeight: '33px' }],
        'subtitle-mobile': ['24px', { lineHeight: '26.4px' }],
        'h3': ['30px', { lineHeight: '33px' }],
        'h4': ['24px', { lineHeight: '26.4px' }],
        'label': ['16px', { lineHeight: '17.6px', fontWeight: '600' }],
        'body-lg': ['20px', { lineHeight: '24.2px' }],
        'body': ['16px', { lineHeight: '17.6px' }],
        'link': ['16px', { lineHeight: '17.6px', fontWeight: '500' }],
        'link-lg': ['20px', { lineHeight: '22px', fontWeight: '500' }],
        'nav': ['20px', { lineHeight: '20px' }],
      },
      maxWidth: {
        'content-desktop': '1250px',
        'content-tablet': '770px',
        'content-mobile': '345px',
      },
      screens: {
        'tablet': '800px',
        'desktop': '1280px',
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 3: Write globals.css with Inter import**

```css
/* app/globals.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    @apply bg-background text-text font-sans;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Responsive heading system */
  h1 {
    @apply text-hero-mobile tablet:text-hero-desktop desktop:text-hero-desktop;
  }
}

@layer components {
  .content-container {
    @apply mx-auto px-[15px];
    @apply max-w-content-mobile tablet:max-w-content-tablet desktop:max-w-content-desktop;
  }

  .divider {
    @apply w-full h-px bg-text-muted;
  }
}

@layer utilities {
  /* Lenis smooth scroll styles */
  .lenis {
    height: auto;
  }
  .lenis.lenis-smooth {
    scroll-behavior: auto;
  }
  .lenis.lenis-smooth [data-lenis-prevent] {
    overscroll-behavior: contain;
  }
  .lenis.lenis-stopped {
    overflow: hidden;
  }
}
```

- [ ] **Step 4: Verify build succeeds**

```bash
npm run build
```

Expected: successful build, no Tailwind errors.

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.ts app/globals.css design-system/tokens.json && git commit -m "feat: configure Tailwind with Figma design tokens"
```

---

## Phase 2: Utilities & Auth

### Task 6: Auth utility (password + JWT)

**Files:**
- Create: `lib/auth.ts`

- [ ] **Step 1: Write the test**

```bash
mkdir -p tests/lib
```

```typescript
// tests/lib/auth.test.ts
import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, createToken, verifyToken } from '@/lib/auth';

describe('auth', () => {
  it('hashes and verifies a password', async () => {
    const hash = await hashPassword('test-password');
    expect(hash).not.toBe('test-password');
    const valid = await verifyPassword('test-password', hash);
    expect(valid).toBe(true);
    const invalid = await verifyPassword('wrong', hash);
    expect(invalid).toBe(false);
  });

  it('creates and verifies a JWT token', async () => {
    const token = await createToken();
    expect(typeof token).toBe('string');
    const payload = await verifyToken(token);
    expect(payload).toHaveProperty('role', 'admin');
    expect(payload).toHaveProperty('iat');
  });

  it('rejects invalid token', async () => {
    await expect(verifyToken('bad-token')).rejects.toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/lib/auth.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement auth.ts**

```typescript
// lib/auth.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const SALT_ROUNDS = 12;
const TOKEN_EXPIRY = '24h';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createToken(): Promise<string> {
  return jwt.sign(
    { role: 'admin' },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

export async function verifyToken(token: string): Promise<jwt.JwtPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err || !decoded || typeof decoded === 'string') {
        reject(new Error('Invalid token'));
      } else {
        resolve(decoded as jwt.JwtPayload);
      }
    });
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/lib/auth.test.ts
```

Expected: all 3 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/auth.ts tests/lib/auth.test.ts && git commit -m "feat: add auth utility with bcrypt and JWT"
```

### Task 7: Vitest config for path aliases

**Files:**
- Create: `vitest.config.ts`

- [ ] **Step 1: Write Vitest config**

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
  },
});
```

- [ ] **Step 2: Run auth tests again to verify config works**

```bash
npx vitest run
```

Expected: 3 tests PASS.

- [ ] **Step 3: Commit**

```bash
git add vitest.config.ts && git commit -m "chore: add vitest config with path aliases"
```

---

## Phase 3: Components

### Task 8: Nav component

**Files:**
- Create: `components/Nav.tsx`
- Create: `tests/components/Nav.test.tsx`

- [ ] **Step 1: Write Nav test**

```typescript
// tests/components/Nav.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Nav from '@/components/Nav';

const mockContent = {
  nav: {
    logo: 'Марина Филина',
    links: [
      { label: 'Обо мне', href: '/about' },
      { label: 'Контакты', href: '#contacts' },
    ],
  },
};

vi.mock('@/lib/content', () => ({
  getContent: vi.fn().mockResolvedValue(mockContent),
}));

describe('Nav', () => {
  it('renders logo', async () => {
    render(await Nav());
    expect(screen.getByText('Марина Филина')).toBeDefined();
  });

  it('renders nav links on desktop', async () => {
    render(await Nav());
    expect(screen.getByText('Обо мне')).toBeDefined();
    expect(screen.getByText('Контакты')).toBeDefined();
  });

  it('logo links to home', async () => {
    render(await Nav());
    const logoLink = screen.getByText('Марина Филина').closest('a');
    expect(logoLink?.getAttribute('href')).toBe('/');
  });
});
```

Note: Since Nav is a Server Component fetching content, we need to adjust. Let's make Nav a Client Component that accepts content as props.

- [ ] **Step 2: Write Nav component**

```typescript
// components/Nav.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { NavLink } from '@/types/content';

interface NavProps {
  logo: string;
  links: NavLink[];
}

export default function Nav({ logo, links }: NavProps) {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setVisible(currentScrollY < lastScrollY || currentScrollY < 10);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50 bg-surface
        transition-transform duration-300
        ${visible ? 'translate-y-0' : '-translate-y-full'}
      `}
    >
      <div className="content-container h-[61px] flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-nav text-nav hover:opacity-70 transition-opacity"
        >
          {logo}
        </Link>

        {/* Desktop links */}
        <div className="hidden tablet:flex items-center gap-[50px]">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-text text-nav hover:opacity-70 transition-opacity"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 3: Run test to verify it passes**

```bash
npx vitest run tests/components/Nav.test.tsx
```

Expected: 3 tests PASS.

- [ ] **Step 4: Commit**

```bash
git add components/Nav.tsx tests/components/Nav.test.tsx && git commit -m "feat: add Nav component with scroll-aware visibility"
```

### Task 9: NavMobile component

**Files:**
- Create: `components/NavMobile.tsx`
- Create: `tests/components/NavMobile.test.tsx`

- [ ] **Step 1: Write NavMobile test**

```typescript
// tests/components/NavMobile.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NavMobile from '@/components/NavMobile';

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
    const menuBtn = screen.getByText('Меню');
    fireEvent.click(menuBtn);
    expect(screen.getByText('Work')).toBeDefined();
    expect(screen.getByText('About')).toBeDefined();
  });

  it('hides desktop nav', () => {
    const { container } = render(<NavMobile {...defaultProps} />);
    expect(container.querySelector('.tablet\\:flex')).toBeNull();
  });
});
```

- [ ] **Step 2: Write NavMobile component**

```typescript
// components/NavMobile.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { NavLink } from '@/types/content';

interface NavMobileProps {
  logo: string;
  links: NavLink[];
}

export default function NavMobile({ logo, links }: NavMobileProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Lock body scroll when menu open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <nav className="tablet:hidden fixed top-0 left-0 right-0 z-50 bg-surface">
      {/* Top bar */}
      <div className="content-container h-[53px] flex items-center justify-between">
        <Link
          href="/"
          className="text-nav text-nav hover:opacity-70 transition-opacity"
          onClick={() => setMenuOpen(false)}
        >
          {logo}
        </Link>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-nav text-nav hover:opacity-70 transition-opacity"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? 'Close' : 'Меню'}
        </button>
      </div>

      {/* Dropdown menu */}
      {menuOpen && (
        <div className="content-container pt-[15px] pb-[30px]">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-text text-nav py-[13px] hover:opacity-70 transition-opacity"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
```

- [ ] **Step 3: Run tests**

```bash
npx vitest run tests/components/NavMobile.test.tsx
```

Expected: 3 tests PASS.

- [ ] **Step 4: Commit**

```bash
git add components/NavMobile.tsx tests/components/NavMobile.test.tsx && git commit -m "feat: add NavMobile with burger menu"
```

### Task 10: Hero component

**Files:**
- Create: `components/Hero.tsx`
- Create: `tests/components/Hero.test.tsx`

- [ ] **Step 1: Write Hero test**

```typescript
// tests/components/Hero.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Hero from '@/components/Hero';

describe('Hero', () => {
  it('renders title and subtitle', () => {
    render(<Hero title="Test Title" subtitle="Test Subtitle" />);
    expect(screen.getByText('Test Title')).toBeDefined();
    expect(screen.getByText('Test Subtitle')).toBeDefined();
  });

  it('title has hero font size', () => {
    render(<Hero title="Title" subtitle="Subtitle" />);
    const title = screen.getByText('Title');
    expect(title.className).toContain('text-hero');
  });
});
```

- [ ] **Step 2: Write Hero component**

```typescript
// components/Hero.tsx
'use client';

import { motion } from 'framer-motion';

interface HeroProps {
  title: string;
  subtitle: string;
}

export default function Hero({ title, subtitle }: HeroProps) {
  return (
    <section className="content-container flex items-center min-h-[280px] tablet:min-h-[326px] pt-[80px]">
      <motion.div
        initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full desktop:max-w-[1250px] tablet:max-w-[770px] max-w-[345px]"
      >
        <h1 className="text-hero-mobile tablet:text-hero-desktop mb-[24px]">
          {title}
        </h1>
        <p className="text-subtitle-mobile tablet:text-subtitle-tablet desktop:text-subtitle-desktop desktop:max-w-[1080px]">
          {subtitle}
        </p>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 3: Run tests**

```bash
npx vitest run tests/components/Hero.test.tsx
```

Expected: 2 tests PASS.

- [ ] **Step 4: Commit**

```bash
git add components/Hero.tsx tests/components/Hero.test.tsx && git commit -m "feat: add Hero component with fade-up reveal animation"
```

### Task 11: ImageSlider component (CSS scroll-snap)

**Files:**
- Create: `components/ImageSlider.tsx`
- Create: `tests/components/ImageSlider.test.tsx`

- [ ] **Step 1: Write ImageSlider test**

```typescript
// tests/components/ImageSlider.test.tsx
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

  it('has scroll-snap CSS class', () => {
    const { container } = render(<ImageSlider images={images} />);
    const slider = container.querySelector('[data-testid="slider-track"]');
    expect(slider?.className).toContain('scroll-snap');
  });
});
```

- [ ] **Step 2: Write ImageSlider component**

```typescript
// components/ImageSlider.tsx
'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageSliderProps {
  images: string[];
}

export default function ImageSlider({ images }: ImageSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleScroll = () => {
      const scrollLeft = track.scrollLeft;
      const itemWidth = track.children[0]?.clientWidth || 460;
      const index = Math.round(scrollLeft / itemWidth);
      setActiveIndex(index);
    };

    track.addEventListener('scroll', handleScroll, { passive: true });
    return () => track.removeEventListener('scroll', handleScroll);
  }, []);

  if (images.length === 0) {
    return (
      <div
        data-testid="slider-placeholder"
        className="w-full aspect-square bg-text-muted/10"
      />
    );
  }

  return (
    <div className="relative">
      {/* Track: wider than container for overflow scroll */}
      <div
        ref={trackRef}
        data-testid="slider-track"
        className="flex gap-0 overflow-x-auto scroll-snap-x-mandatory scrollbar-hide"
        style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
      >
        {images.map((src, i) => (
          <div
            key={i}
            className="flex-shrink-0 scroll-snap-align-start"
            style={{ scrollSnapAlign: 'start' }}
          >
            <div className="relative w-[460px] h-[460px] tablet:w-[460px] tablet:h-[460px] max-sm:w-[280px] max-sm:h-[280px]">
              <Image
                src={src}
                alt={`Project image ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 799px) 280px, 460px"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Dots indicator */}
      {images.length > 1 && (
        <div className="flex justify-center gap-[8px] mt-[16px]">
          {images.map((_, i) => (
            <button
              key={i}
              className={`w-[8px] h-[8px] rounded-full transition-colors ${
                i === activeIndex ? 'bg-text' : 'bg-text-muted/30'
              }`}
              onClick={() => {
                const track = trackRef.current;
                if (!track) return;
                const itemWidth = track.children[0]?.clientWidth || 460;
                track.scrollTo({ left: i * itemWidth, behavior: 'smooth' });
              }}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Add scrollbar-hide utility to globals.css**

```css
/* Add to @layer utilities in app/globals.css */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run tests/components/ImageSlider.test.tsx
```

Expected: 3 tests PASS (may fail on Next.js Image — need to mock or wrap in test config).

- [ ] **Step 5: Commit**

```bash
git add components/ImageSlider.tsx tests/components/ImageSlider.test.tsx app/globals.css && git commit -m "feat: add ImageSlider with CSS scroll-snap and dot indicators"
```

### Task 12: ProjectCard component

**Files:**
- Create: `components/ProjectCard.tsx`
- Create: `tests/components/ProjectCard.test.tsx`

- [ ] **Step 1: Write ProjectCard test**

```typescript
// tests/components/ProjectCard.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProjectCard from '@/components/ProjectCard';

const mockProject = {
  title: 'Test Project',
  subtitle: 'Test Subtitle',
  images: [],
  description: 'Test description of the project.',
  slug: 'test-project',
};

describe('ProjectCard', () => {
  it('renders project title and description', () => {
    render(<ProjectCard {...mockProject} />);
    expect(screen.getByText('Test Project')).toBeDefined();
    expect(screen.getByText('Test description of the project.')).toBeDefined();
  });

  it('renders "Посмотреть проект" link', () => {
    render(<ProjectCard {...mockProject} />);
    const link = screen.getByTestId('project-link');
    expect(link).toBeDefined();
    expect(link.textContent).toContain('Посмотреть проект');
    expect(link.getAttribute('href')).toBe('/test-project');
  });

  it('renders category label', () => {
    render(<ProjectCard {...mockProject} />);
    expect(screen.getByTestId('project-label')).toBeDefined();
    expect(screen.getByTestId('project-label').textContent).toBe('Project');
  });
});
```

- [ ] **Step 2: Write ProjectCard component**

```typescript
// components/ProjectCard.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import ImageSlider from './ImageSlider';

interface ProjectCardProps {
  title: string;
  subtitle: string;
  images: string[];
  description: string;
  slug: string;
}

export default function ProjectCard({ title, subtitle, images, description, slug }: ProjectCardProps) {
  return (
    <motion.article
      className="content-container py-[20px]"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      {/* Image slider */}
      <div className="overflow-hidden">
        <ImageSlider images={images} />
      </div>

      {/* Project info — two columns on desktop, stacked on mobile */}
      <div className="flex flex-col tablet:flex-row tablet:justify-between mt-[20px]">
        {/* Left: Project label + title */}
        <div className="tablet:w-[341px]">
          <span data-testid="project-label" className="text-label text-text-muted block mb-[4px]">
            Project
          </span>
          <h3 className="text-h3 text-text">
            <Link href={`/${slug}`} className="hover:opacity-70 transition-opacity">
              {title}
            </Link>
          </h3>
        </div>

        {/* Right: Description + link */}
        <div className="tablet:w-[360px] mt-[16px] tablet:mt-0">
          <p className="text-body text-text mb-[12px]">
            {description}
          </p>
          <Link
            href={`/${slug}`}
            data-testid="project-link"
            className="group inline-flex items-center gap-[4px] text-link text-text-muted hover:text-text transition-colors"
          >
            Посмотреть проект
            <motion.span
              className="inline-block"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              →
            </motion.span>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
```

- [ ] **Step 3: Run tests**

```bash
npx vitest run tests/components/ProjectCard.test.tsx
```

Expected: 3 tests PASS.

- [ ] **Step 4: Commit**

```bash
git add components/ProjectCard.tsx tests/components/ProjectCard.test.tsx && git commit -m "feat: add ProjectCard with slider, reveal animation, and hover effects"
```

### Task 13: CTASection component

**Files:**
- Create: `components/CTASection.tsx`
- Create: `tests/components/CTASection.test.tsx`

- [ ] **Step 1: Write CTASection test**

```typescript
// tests/components/CTASection.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CTASection from '@/components/CTASection';

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

  it('text is a link to contacts', () => {
    render(<CTASection text="Test" />);
    const link = screen.getByText('Test').closest('a');
    expect(link?.getAttribute('href')).toBe('#contacts');
  });
});
```

- [ ] **Step 2: Write CTASection component**

```typescript
// components/CTASection.tsx
'use client';

import { motion } from 'framer-motion';

interface CTASectionProps {
  text: string;
}

export default function CTASection({ text }: CTASectionProps) {
  return (
    <motion.section
      className="content-container py-[30px]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      {/* Top divider */}
      <motion.div
        data-testid="divider-line"
        className="divider origin-center"
        variants={{
          hidden: { scaleX: 0 },
          visible: { scaleX: 1, transition: { duration: 0.6, ease: 'easeOut' } },
        }}
      />

      {/* CTA text */}
      <div className="py-[30px]">
        <a
          href="#contacts"
          className="text-subtitle-mobile tablet:text-subtitle-tablet desktop:text-subtitle-desktop text-text hover:opacity-70 transition-opacity"
        >
          {text}
        </a>
      </div>

      {/* Bottom divider */}
      <motion.div
        data-testid="divider-line"
        className="divider origin-center"
        variants={{
          hidden: { scaleX: 0 },
          visible: { scaleX: 1, transition: { duration: 0.6, ease: 'easeOut', delay: 0.2 } },
        }}
      />
    </motion.section>
  );
}
```

- [ ] **Step 3: Run tests**

```bash
npx vitest run tests/components/CTASection.test.tsx
```

Expected: 3 tests PASS.

- [ ] **Step 4: Commit**

```bash
git add components/CTASection.tsx tests/components/CTASection.test.tsx && git commit -m "feat: add CTASection with animated divider lines"
```

### Task 14: Footer component

**Files:**
- Create: `components/Footer.tsx`
- Create: `tests/components/Footer.test.tsx`

- [ ] **Step 1: Write Footer test**

```typescript
// tests/components/Footer.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '@/components/Footer';
import type { FooterContent } from '@/types/content';

const mockFooter: FooterContent = {
  logo: 'Марина Филина',
  email: 'test@test.com',
  phone: '+7 903 650 65 99',
  socials: [
    { label: 'Telegram', url: 'https://t.me/test' },
    { label: 'Behance', url: 'https://behance.net/test' },
  ],
};

describe('Footer', () => {
  it('renders logo', () => {
    render(<Footer content={mockFooter} />);
    expect(screen.getByText('Марина Филина')).toBeDefined();
  });

  it('renders social links', () => {
    render(<Footer content={mockFooter} />);
    expect(screen.getByText('Telegram')).toBeDefined();
    expect(screen.getByText('Behance')).toBeDefined();
  });

  it('renders contacts section', () => {
    render(<Footer content={mockFooter} />);
    expect(screen.getByText('СОЦСЕТИ')).toBeDefined();
    expect(screen.getByText('+7 903 650 65 99')).toBeDefined();
  });
});
```

- [ ] **Step 2: Write Footer component**

```typescript
// components/Footer.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { FooterContent } from '@/types/content';

interface FooterProps {
  content: FooterContent;
}

export default function Footer({ content }: FooterProps) {
  return (
    <motion.footer
      id="contacts"
      className="content-container py-[35px]"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col tablet:flex-row tablet:justify-between">
        {/* Logo */}
        <div className="tablet:w-[625px] mb-[30px] tablet:mb-0">
          <span className="text-subtitle-mobile tablet:text-subtitle-tablet desktop:text-subtitle-desktop text-text">
            {content.logo}
          </span>
        </div>

        {/* Contacts + Socials */}
        <div className="flex gap-[60px] tablet:w-[616px]">
          {/* Contacts */}
          <div className="flex flex-col gap-[8px]">
            {content.email && (
              <a
                href={`mailto:${content.email}`}
                className="text-body text-text hover:opacity-70 transition-opacity"
              >
                {content.email}
              </a>
            )}
            {content.phone && (
              <a
                href={`tel:${content.phone.replace(/\s/g, '')}`}
                className="text-body text-text hover:opacity-70 transition-opacity"
              >
                {content.phone}
              </a>
            )}
          </div>

          {/* Socials */}
          <div>
            <span className="text-nav text-text block mb-[20px]">
              СОЦСЕТИ
            </span>
            <div className="flex flex-col gap-[10px]">
              {content.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body text-text hover:opacity-70 transition-opacity"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
```

- [ ] **Step 3: Run tests**

```bash
npx vitest run tests/components/Footer.test.tsx
```

Expected: 3 tests PASS.

- [ ] **Step 4: Commit**

```bash
git add components/Footer.tsx tests/components/Footer.test.tsx && git commit -m "feat: add Footer component with contacts and social links"
```

---

## Phase 4: Pages

### Task 15: Root layout

**Files:**
- Create: `app/layout.tsx` (overwrite)
- Create: `components/LenisProvider.tsx`

- [ ] **Step 1: Write LenisProvider**

```typescript
// components/LenisProvider.tsx
'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
```

- [ ] **Step 2: Write root layout**

```typescript
// app/layout.tsx
import type { Metadata } from 'next';
import LenisProvider from '@/components/LenisProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Марина Филина — Внештатный арт-директор бренда',
  description: 'Портфолио Марины Филиной. Бренд-дизайнер. Создам образ бренда, продающий вашу идею.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="bg-background text-text font-sans antialiased">
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: successful build.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx components/LenisProvider.tsx && git commit -m "feat: add root layout with Inter font, Lenis smooth scroll"
```

### Task 16: Home page

**Files:**
- Create: `app/page.tsx` (overwrite)

- [ ] **Step 1: Write Home page**

```typescript
// app/page.tsx
import { getContent } from '@/lib/content';
import Nav from '@/components/Nav';
import NavMobile from '@/components/NavMobile';
import Hero from '@/components/Hero';
import ProjectCard from '@/components/ProjectCard';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

export default async function HomePage() {
  const content = await getContent();
  const { nav, home, footer } = content;

  return (
    <>
      <Nav logo={nav.logo} links={nav.links} />
      <NavMobile logo={nav.logo} links={nav.links} />

      <main>
        <Hero title={home.hero.title} subtitle={home.hero.subtitle} />

        <section id="work">
          {home.projects.map((slug) => {
            const project = content.projects[slug];
            if (!project) return null;
            return (
              <ProjectCard
                key={slug}
                title={project.title}
                subtitle={project.subtitle}
                images={project.images}
                description={project.description}
                slug={slug}
              />
            );
          })}
        </section>

        <CTASection text={home.cta} />

        <Footer content={footer} />
      </main>
    </>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: successful build.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx && git commit -m "feat: add home page with all sections"
```

### Task 17: About page

**Files:**
- Create: `app/about/page.tsx`

- [ ] **Step 1: Write About page**

```typescript
// app/about/page.tsx
import { getContent } from '@/lib/content';
import { Metadata } from 'next';
import Nav from '@/components/Nav';
import NavMobile from '@/components/NavMobile';
import Footer from '@/components/Footer';

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent();
  return {
    title: content.seo.about?.title || 'Обо мне — Марина Филина',
    description: content.seo.about?.description || 'Бренд-дизайнер Марина Филина',
  };
}

export default async function AboutPage() {
  const content = await getContent();
  const { nav, about, footer } = content;

  return (
    <>
      <Nav logo={nav.logo} links={nav.links} />
      <NavMobile logo={nav.logo} links={nav.links} />

      <main className="pt-[80px]">
        {/* Intro */}
        <section className="content-container py-[60px]">
          <h1 className="text-hero-mobile tablet:text-hero-desktop mb-[16px]">
            {about.name}
          </h1>
          <p className="text-subtitle-mobile tablet:text-subtitle-tablet desktop:text-subtitle-desktop text-text">
            {about.headline}
          </p>
        </section>

        {/* Services */}
        <section className="content-container py-[60px]">
          <div className="grid grid-cols-1 tablet:grid-cols-3 gap-[30px]">
            {about.services.map((service, i) => (
              <div key={i}>
                <h3 className="text-subtitle-tablet desktop:text-subtitle-desktop text-text mb-[12px]">
                  {service.title}
                </h3>
                <p className="text-body text-text">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Experience & Education */}
        <section className="content-container py-[60px]">
          <div className="flex flex-col tablet:flex-row gap-[60px]">
            <div className="tablet:w-1/2">
              <h2 className="text-subtitle-tablet desktop:text-subtitle-desktop text-text mb-[24px]">
                Опыт работы
              </h2>
              <ul className="flex flex-col gap-[12px]">
                {about.experience.map((item, i) => (
                  <li key={i} className="text-body text-text">{item}</li>
                ))}
              </ul>
            </div>
            <div className="tablet:w-1/2">
              <h2 className="text-subtitle-tablet desktop:text-subtitle-desktop text-text mb-[24px]">
                Образование
              </h2>
              <ul className="flex flex-col gap-[12px]">
                {about.education.map((item, i) => (
                  <li key={i} className="text-body text-text">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="content-container py-[60px]">
          <div className="divider mb-[30px]" />
          <div className="text-body text-text">
            {about.contact.phone && (
              <a href={`tel:${about.contact.phone.replace(/\s/g, '')}`} className="block hover:opacity-70">
                {about.contact.phone}
              </a>
            )}
            {about.contact.email && (
              <a href={`mailto:${about.contact.email}`} className="block hover:opacity-70">
                {about.contact.email}
              </a>
            )}
          </div>
          <div className="divider mt-[30px]" />
        </section>
      </main>

      <Footer content={footer} />
    </>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: successful build, renders /about.

- [ ] **Step 3: Commit**

```bash
git add app/about/page.tsx && git commit -m "feat: add about page with services, experience, education"
```

### Task 18: Project detail page & generateStaticParams

**Files:**
- Create: `app/[slug]/page.tsx`

- [ ] **Step 1: Write project page**

```typescript
// app/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getContent, getProject, getProjectSlugs } from '@/lib/content';
import Nav from '@/components/Nav';
import NavMobile from '@/components/NavMobile';
import Footer from '@/components/Footer';
import Image from 'next/image';

interface ProjectPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = await getProject(params.slug);
  if (!project) return { title: 'Проект не найден' };
  return {
    title: `${project.title} — Марина Филина`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const content = await getContent();
  const project = await getProject(params.slug);

  if (!project) notFound();

  const projectIndex = content.home.projects.indexOf(params.slug);
  const prevSlug = projectIndex > 0 ? content.home.projects[projectIndex - 1] : null;
  const nextSlug = projectIndex < content.home.projects.length - 1
    ? content.home.projects[projectIndex + 1]
    : null;

  return (
    <>
      <Nav logo={content.nav.logo} links={content.nav.links} />
      <NavMobile logo={content.nav.logo} links={content.nav.links} />

      <main className="pt-[80px]">
        {/* Hero */}
        <section className="content-container py-[80px]">
          <h1 className="text-hero-mobile tablet:text-hero-desktop mb-[16px]">
            {project.title}
          </h1>
          <p className="text-subtitle-mobile tablet:text-subtitle-tablet desktop:text-subtitle-desktop text-text-muted mb-[24px]">
            {project.client}
          </p>
          <span className="text-label text-text-muted">{project.category}</span>
        </section>

        {/* Image gallery */}
        {project.images.length > 0 && (
          <section className="content-container py-[40px]">
            <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-[16px]">
              {project.images.map((src, i) => (
                <div key={i} className="relative aspect-square">
                  <Image
                    src={src}
                    alt={`${project.title} image ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 799px) 345px, (max-width: 1279px) 375px, 410px"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Task */}
        <section className="content-container py-[40px]">
          <div className="flex flex-col tablet:flex-row tablet:justify-between">
            <div className="tablet:w-[341px]">
              <span className="text-label text-text-muted">Задача</span>
            </div>
            <div className="tablet:w-[360px]">
              <p className="text-body text-text">{project.task}</p>
            </div>
          </div>
        </section>

        {/* Concept */}
        <section className="content-container py-[40px]">
          <div className="flex flex-col tablet:flex-row tablet:justify-between">
            <div className="tablet:w-[341px]">
              <span className="text-label text-text-muted">Концепт</span>
            </div>
            <div className="tablet:w-[360px]">
              <p className="text-body text-text">{project.concept}</p>
            </div>
          </div>
        </section>

        {/* Services + Timeline */}
        {(project.services.length > 0 || project.timeline) && (
          <section className="content-container py-[40px]">
            <div className="flex flex-col tablet:flex-row tablet:justify-between">
              <div className="tablet:w-[341px]">
                <span className="text-label text-text-muted">Услуги</span>
                {project.timeline && (
                  <p className="text-body text-text-muted mt-[12px]">{project.timeline}</p>
                )}
              </div>
              <div className="tablet:w-[360px]">
                <ul className="flex flex-col gap-[8px]">
                  {project.services.map((s, i) => (
                    <li key={i} className="text-body text-text">{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* Navigation */}
        <section className="content-container py-[60px]">
          <div className="divider mb-[30px]" />
          <div className="flex justify-between text-link text-text-muted">
            {prevSlug ? (
              <a href={`/${prevSlug}`} className="hover:text-text transition-colors">
                ← предыдущий проект
              </a>
            ) : <span />}
            {nextSlug ? (
              <a href={`/${nextSlug}`} className="hover:text-text transition-colors">
                следующий проект →
              </a>
            ) : <span />}
          </div>
          <div className="divider mt-[30px]" />
        </section>
      </main>

      <Footer content={content.footer} />
    </>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: successful build, generates 5 project pages.

- [ ] **Step 3: Commit**

```bash
git add app/[slug]/page.tsx && git commit -m "feat: add dynamic project page with gallery, task, concept, navigation"
```

### Task 19: 404 page

**Files:**
- Create: `app/not-found.tsx`

- [ ] **Step 1: Write not-found page**

```typescript
// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="content-container min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-hero-mobile tablet:text-hero-desktop mb-[16px]">404</h1>
      <p className="text-subtitle-mobile tablet:text-subtitle-tablet text-text-muted mb-[40px]">
        Страница не найдена
      </p>
      <Link
        href="/"
        className="text-link text-text border-b border-text hover:opacity-70 transition-opacity"
      >
        На главную →
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/not-found.tsx && git commit -m "feat: add 404 page"
```

---

## Phase 5: Admin Panel

### Task 20: Admin login API route

**Files:**
- Create: `app/api/admin/login/route.ts`

- [ ] **Step 1: Write login route**

```typescript
// app/api/admin/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createToken } from '@/lib/auth';

// In-memory rate limiting (resets on restart)
const attempts: Map<string, { count: number; blockedUntil: number }> = new Map();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';
const MAX_ATTEMPTS = 3;
const BLOCK_DURATION = 5 * 60 * 1000; // 5 minutes

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();

  // Check rate limit
  const record = attempts.get(ip);
  if (record && record.blockedUntil > now) {
    const remaining = Math.ceil((record.blockedUntil - now) / 1000);
    return NextResponse.json(
      { error: `Слишком много попыток. Попробуйте через ${remaining} сек.` },
      { status: 429 }
    );
  }

  const { password } = await request.json();

  if (password !== ADMIN_PASSWORD) {
    // Increment attempts
    const current = attempts.get(ip) || { count: 0, blockedUntil: 0 };
    current.count++;
    if (current.count >= MAX_ATTEMPTS) {
      current.blockedUntil = now + BLOCK_DURATION;
    }
    attempts.set(ip, current);
    return NextResponse.json({ error: 'Неверный пароль' }, { status: 401 });
  }

  // Reset attempts on success
  attempts.delete(ip);

  const token = await createToken();

  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  });

  return response;
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/admin/login/route.ts && git commit -m "feat: add admin login API with rate limiting"
```

### Task 21: Admin content API route

**Files:**
- Create: `app/api/admin/content/route.ts`
- Create: `middleware.ts`

- [ ] **Step 1: Write middleware for admin protection**

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /api/admin/* and /admin (except login)
  if (pathname.startsWith('/api/admin') || pathname === '/admin') {
    if (pathname === '/api/admin/login') {
      return NextResponse.next();
    }

    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    try {
      await verifyToken(token);
      return NextResponse.next();
    } catch {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
```

- [ ] **Step 2: Write content API routes**

```typescript
// app/api/admin/content/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getContent, updateContent } from '@/lib/content';

export async function GET() {
  try {
    const content = await getContent();
    return NextResponse.json(content);
  } catch {
    return NextResponse.json({ error: 'Failed to read content' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.nav || !body.home || !body.about || !body.projects || !body.footer) {
      return NextResponse.json({ error: 'Invalid content structure' }, { status: 400 });
    }

    await updateContent(body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}
```

- [ ] **Step 3: Verify admin API works**

Start dev server and test:

```bash
curl -X POST http://localhost:3000/api/admin/login -H 'Content-Type: application/json' -d '{"password":"wrong"}'
# Expected: 401 "Неверный пароль"

curl -X POST http://localhost:3000/api/admin/login -H 'Content-Type: application/json' -d '{"password":"admin"}'
# Expected: 200 with Set-Cookie
```

- [ ] **Step 4: Commit**

```bash
git add app/api/admin/content/route.ts middleware.ts && git commit -m "feat: add admin content API and middleware protection"
```

### Task 22: Admin page (login form)

**Files:**
- Create: `app/admin/page.tsx`

- [ ] **Step 1: Write admin page with login**

```typescript
// app/admin/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        window.location.reload();
      } else {
        const data = await res.json();
        setError(data.error || 'Ошибка входа');
      }
    } catch {
      setError('Сетевая ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[400px] p-[40px]"
      >
        <h1 className="text-subtitle-desktop mb-[32px] text-center">
          Вход
        </h1>

        <div className="flex flex-col gap-[16px]">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Мастер-пароль"
            className="w-full px-[16px] py-[12px] border border-text-muted/30 text-body focus:outline-none focus:border-text"
            autoFocus
          />

          {error && (
            <p className="text-body text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-[12px] bg-text text-surface text-link hover:opacity-90 transition-opacity disabled:opacity-30"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </div>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Verify login flow**

Start dev server, visit http://localhost:3000/admin, enter admin password.

- [ ] **Step 3: Commit**

```bash
git add app/admin/page.tsx && git commit -m "feat: add admin login page"
```

### Task 23: Admin content editor

**Files:**
- Create: `app/admin/layout.tsx`
- Create: `components/admin/AdminLayout.tsx`
- Create: `components/admin/ContentEditor.tsx`
- Create: `components/admin/ImageUploader.tsx`

- [ ] **Step 1: Write admin layout (checks auth client-side)**

```typescript
// app/admin/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import AdminPage from './page';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/admin/content')
      .then((res) => {
        setAuthorized(res.ok);
      })
      .catch(() => setAuthorized(false));
  }, []);

  if (authorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-body text-text-muted">Загрузка...</div>
      </div>
    );
  }

  if (!authorized) {
    return <AdminPage />;
  }

  return <>{children}</>;
}
```

- [ ] **Step 2: Write AdminLayout with tab navigation**

```typescript
// components/admin/AdminLayout.tsx
'use client';

import { useState } from 'react';

type Tab = 'home' | 'about' | 'projects' | 'footer' | 'seo';

interface AdminLayoutProps {
  children: (tab: Tab) => React.ReactNode;
}

const TABS: { key: Tab; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'about', label: 'About' },
  { key: 'projects', label: 'Projects' },
  { key: 'footer', label: 'Footer' },
  { key: 'seo', label: 'SEO' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-[220px] bg-text-muted/5 border-r border-text-muted/10 p-[20px] flex flex-col">
        <h2 className="text-nav text-text mb-[30px]">Админ-панель</h2>
        <nav className="flex flex-col gap-[4px]">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`text-nav text-left px-[12px] py-[8px] transition-colors ${
                activeTab === tab.key
                  ? 'text-text bg-text/5'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Content area */}
      <main className="flex-1 p-[40px] overflow-y-auto">
        {children(activeTab)}
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Write ContentEditor with save confirmation**

```typescript
// components/admin/ContentEditor.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import AdminLayout from './AdminLayout';
import type { SiteContent } from '@/types/content';

export default function ContentEditor() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/content')
      .then((res) => res.json())
      .then((data) => {
        setContent(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });

      if (res.ok) {
        setMessage('✅ Сохранено');
      } else {
        setMessage('❌ Ошибка сохранения');
      }
    } catch {
      setMessage('❌ Сетевая ошибка');
    } finally {
      setSaving(false);
      setShowConfirm(false);
    }
  };

  const updateField = (path: string[], value: string) => {
    if (!content) return;
    const newContent = structuredClone(content);
    let obj: any = newContent;
    for (let i = 0; i < path.length - 1; i++) {
      obj = obj[path[i]];
    }
    obj[path[path.length - 1]] = value;
    setContent(newContent);
  };

  if (loading) {
    return <div className="text-body text-text-muted p-[40px]">Загрузка...</div>;
  }

  if (!content) {
    return <div className="text-body text-text-muted p-[40px]">Ошибка загрузки контента</div>;
  }

  return (
    <AdminLayout>
      {(tab) => (
        <div>
          <div className="flex items-center justify-between mb-[30px]">
            <h1 className="text-subtitle-tablet text-text">
              {tab === 'home' && 'Главная страница'}
              {tab === 'about' && 'Обо мне'}
              {tab === 'projects' && 'Проекты'}
              {tab === 'footer' && 'Футер'}
              {tab === 'seo' && 'SEO'}
            </h1>

            <button
              onClick={() => setShowConfirm(true)}
              disabled={saving}
              className="px-[24px] py-[10px] bg-text text-surface text-link hover:opacity-90 transition-opacity disabled:opacity-30"
            >
              {saving ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
          </div>

          {message && (
            <div className="mb-[20px] text-body">{message}</div>
          )}

          {/* Tab content */}
          <div className="flex flex-col gap-[20px] max-w-[600px]">
            {tab === 'home' && (
              <>
                <Field
                  label="Hero — Заголовок"
                  value={content.home.hero.title}
                  onChange={(v) => updateField(['home', 'hero', 'title'], v)}
                  textarea
                />
                <Field
                  label="Hero — Подзаголовок"
                  value={content.home.hero.subtitle}
                  onChange={(v) => updateField(['home', 'hero', 'subtitle'], v)}
                  textarea
                />
                <Field
                  label="CTA — Текст"
                  value={content.home.cta}
                  onChange={(v) => updateField(['home', 'cta'], v)}
                />
              </>
            )}

            {tab === 'about' && (
              <>
                <Field
                  label="Имя"
                  value={content.about.name}
                  onChange={(v) => updateField(['about', 'name'], v)}
                />
                <Field
                  label="Заголовок"
                  value={content.about.headline}
                  onChange={(v) => updateField(['about', 'headline'], v)}
                  textarea
                />
                <Field
                  label="Телефон"
                  value={content.about.contact.phone}
                  onChange={(v) => updateField(['about', 'contact', 'phone'], v)}
                />
              </>
            )}

            {tab === 'projects' && (
              <div className="flex flex-col gap-[30px]">
                {Object.entries(content.projects).map(([slug, project]) => (
                  <details key={slug} className="border border-text-muted/20 p-[16px]">
                    <summary className="text-body text-text cursor-pointer">
                      {project.title}
                    </summary>
                    <div className="mt-[16px] flex flex-col gap-[12px]">
                      <Field
                        label="Название"
                        value={project.title}
                        onChange={(v) => updateField(['projects', slug, 'title'], v)}
                      />
                      <Field
                        label="Клиент"
                        value={project.client}
                        onChange={(v) => updateField(['projects', slug, 'client'], v)}
                      />
                      <Field
                        label="Описание"
                        value={project.description}
                        onChange={(v) => updateField(['projects', slug, 'description'], v)}
                        textarea
                      />
                    </div>
                  </details>
                ))}
              </div>
            )}

            {tab === 'footer' && (
              <>
                <Field
                  label="Email"
                  value={content.footer.email}
                  onChange={(v) => updateField(['footer', 'email'], v)}
                />
                <Field
                  label="Телефон"
                  value={content.footer.phone}
                  onChange={(v) => updateField(['footer', 'phone'], v)}
                />
              </>
            )}

            {tab === 'seo' && (
              <>
                <Field
                  label="Home — Title"
                  value={content.seo.home?.title || ''}
                  onChange={(v) => updateField(['seo', 'home', 'title'], v)}
                />
                <Field
                  label="Home — Description"
                  value={content.seo.home?.description || ''}
                  onChange={(v) => updateField(['seo', 'home', 'description'], v)}
                  textarea
                />
              </>
            )}
          </div>

          {/* Save confirmation modal */}
          {showConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-surface p-[40px] max-w-[400px] w-full">
                <p className="text-body text-text mb-[24px]">
                  Сохранить изменения?
                </p>
                <div className="flex gap-[16px]">
                  <button
                    onClick={handleSave}
                    className="flex-1 py-[10px] bg-text text-surface text-link hover:opacity-90"
                  >
                    Да
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 py-[10px] border border-text-muted/30 text-link text-text-muted hover:text-text"
                  >
                    Нет
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  const Component = textarea ? 'textarea' : 'input';
  return (
    <label className="flex flex-col gap-[8px]">
      <span className="text-label text-text-muted">{label}</span>
      <Component
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-[12px] py-[10px] border border-text-muted/30 text-body bg-surface focus:outline-none focus:border-text"
        rows={textarea ? 4 : 1}
      />
    </label>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add app/admin/layout.tsx components/admin/AdminLayout.tsx components/admin/ContentEditor.tsx && git commit -m "feat: add admin content editor with tabs and save confirmation"
```

---

## Phase 6: Testing & Polish

### Task 24: Playwright E2E tests

**Files:**
- Create: `playwright.config.ts`
- Create: `e2e/home.spec.ts`
- Create: `e2e/about.spec.ts`
- Create: `e2e/admin.spec.ts`

- [ ] **Step 1: Write Playwright config**

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: 1,
  use: {
    baseURL: 'http://localhost:3000',
    viewport: { width: 1280, height: 800 },
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1280, height: 800 } } },
    { name: 'tablet', use: { viewport: { width: 800, height: 1024 } } },
    { name: 'mobile', use: { viewport: { width: 375, height: 812 } } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
  },
});
```

- [ ] **Step 2: Write home page E2E test**

```typescript
// e2e/home.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('renders hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Внештатный арт-директор');
  });

  test('renders nav with logo and links', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav')).toContainText('Марина Филина');
    if (page.viewportSize()?.width! >= 800) {
      await expect(page.locator('nav')).toContainText('Обо мне');
    }
  });

  test('renders project cards', async ({ page }) => {
    await page.goto('/');
    const cards = page.locator('[data-testid="project-label"]');
    await expect(cards).toHaveCount(5);
  });
});
```

- [ ] **Step 3: Write About page E2E test**

```typescript
// e2e/about.spec.ts
import { test, expect } from '@playwright/test';

test.describe('About page', () => {
  test('renders about content', async ({ page }) => {
    await page.goto('/about');
    await expect(page.locator('h1')).toContainText('Марина Филина');
    await expect(page.locator('main')).toContainText('Бренд с нуля');
    await expect(page.locator('main')).toContainText('Обновление');
    await expect(page.locator('main')).toContainText('Поддержка');
  });
});
```

- [ ] **Step 4: Install Playwright and run tests**

```bash
npx playwright install chromium
npx playwright test
```

Expected: all e2e tests pass across 3 viewports.

- [ ] **Step 5: Commit**

```bash
git add playwright.config.ts e2e/ && git commit -m "test: add Playwright e2e tests for home, about, admin"
```

### Task 25: Accessibility audit

**Files:**
- Create: `e2e/a11y.spec.ts`

- [ ] **Step 1: Write a11y test**

```typescript
// e2e/a11y.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('home page passes a11y checks', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('about page passes a11y checks', async ({ page }) => {
    await page.goto('/about');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
```

- [ ] **Step 2: Install and run**

```bash
npm install -D @axe-core/playwright
npx playwright test e2e/a11y.spec.ts
```

Expected: zero violations.

- [ ] **Step 3: Commit**

```bash
git add e2e/a11y.spec.ts package.json package-lock.json && git commit -m "test: add accessibility audit tests"
```

---

## Phase 7: Deployment

### Task 26: Vercel configuration

**Files:**
- Create: `.env.example`

- [ ] **Step 1: Create .env.example**

```bash
ADMIN_PASSWORD=your-master-password-here
JWT_SECRET=generate-a-random-string-at-least-32-chars
KV_URL=redis://...
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
KV_REST_API_READ_ONLY_TOKEN=...
```

- [ ] **Step 2: Add .env.local to .gitignore**

```bash
echo ".env.local" >> .gitignore
```

- [ ] **Step 3: Verify production build**

```bash
npm run build
```

Expected: successful build, all pages pre-rendered.

- [ ] **Step 4: Commit**

```bash
git add .env.example .gitignore && git commit -m "chore: add deployment configuration"
```

---

## Phase 8: Agent Rules

### Task 27: Project rules for agents

**Files:**
- Create: `.agent/rules.md`
- Create: `.agent/agents/orchestrator.md`
- Create: `.agent/agents/judge.md`
- Create: `.agent/agents/design.md`
- Create: `.agent/agents/developer.md`
- Create: `.agent/agents/tester.md`
- Create: `.agent/agents/reviewer.md`

- [ ] **Step 1: Write rules.md**

```markdown
# Правила проекта marina-landing

## Процесс
- TDD обязательно: сначала failing test → потом код
- Каждый шаг — одна атомарная операция (2-5 минут)
- Коммит после каждого завершённого шага: `feat(scope): описание`
- Не трогать файлы вне задачи

## Код
- TypeScript strict mode
- Именованные экспорты для компонентов (не default, кроме page.tsx)
- Контент ТОЛЬКО из data/content.json или Vercel KV
- Изображения ТОЛЬКО из public/uploads/
- Никаких any, никаких ts-ignore

## Стиль
- Tailwind CSS — все стили
- Framer Motion — все анимации
- Inter — единственный шрифт
- Pixel-perfect по замерам из Figma

## Тесты
- Vitest для unit/component
- Playwright для e2e
- Каждый компонент имеет render-тест
- Каждый API-роут имеет тест

## Git
- Ветка: main
- Conventional commits: feat:, fix:, test:, refactor:, chore:, docs:
```

- [ ] **Step 2: Write agent definitions (one per file)**

```markdown
# Orchestrator agent

Ты — главный координатор проекта marina-landing. Твоя задача:
1. Читаешь план реализации из docs/superpowers/plans/
2. Передаёшь задачи судье
3. Отслеживаешь прогресс по плану
4. Обновляешь статусы в плане (✅/❌/🔄)
5. Не пишешь код, не принимаешь дизайн-решений
```

```markdown
# Judge agent

Ты распределяешь задачи между агентами. Твоя задача:
1. Получаешь задание от оркестратора
2. Дробишь на атомарные шаги (2-5 минут каждый)
3. Назначаешь профильному агенту (design/developer/tester/reviewer)
4. Проверяешь результат
5. Возвращаешь статус оркестратору
```

```markdown
# Design agent

Ты отвечаешь за визуальное соответствие Figma. Твоя задача:
1. Извлекаешь дизайн-токены из Figma
2. Сверяешь pixel-perfect (размеры, отступы, цвета, шрифты)
3. Создаёшь и обновляешь design-system/tokens.json
4. Не пишешь код компонентов
```

```markdown
# Developer agent

Ты пишешь код строго по TDD. Твоя задача:
1. Пишешь failing test
2. Запускаешь — убеждаешься что красный
3. Пишешь минимальную реализацию
4. Запускаешь — зелёный
5. Коммитишь
6. Не принимаешь дизайн-решений. Не трогаешь не свой код.
```

```markdown
# Tester agent

Ты обеспечиваешь качество. Твоя задача:
1. Пишешь и запускаешь Playwright e2e тесты
2. Проверяешь адаптив (3 брейкпоинта: 375, 800, 1280)
3. Делаешь скриншоты для визуальной регрессии
4. Запускаешь accessibility audit
5. Не пишешь продакшн-код
```

```markdown
# Reviewer agent

Ты проверяешь код в два этапа. Твоя задача:
1. Этап 1 (spec compliance): соответствует ли код ТЗ из specs/?
   - Все ли секции реализованы?
   - Правильные ли размеры/отступы/цвета?
   - Нет ли лишнего?
2. Этап 2 (code quality):
   - Чистота кода
   - Типы TypeScript
   - Производительность (Lighthouse)
   - Нет ли any/ts-ignore
```

- [ ] **Step 3: Commit**

```bash
git add .agent/ && git commit -m "docs: add agent rules and definitions"
```

---

### Task 28: Image upload API

**Files:**
- Create: `app/api/admin/upload/route.ts`

- [ ] **Step 1: Write upload route**

```typescript
// app/api/admin/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large. Max 5MB' }, { status: 400 });
  }

  // Check magic bytes
  const bytes = new Uint8Array(await file.arrayBuffer());
  const isValid = validateMagicBytes(bytes, file.type);
  if (!isValid) {
    return NextResponse.json({ error: 'File content does not match claimed type' }, { status: 400 });
  }

  const ext = file.type.split('/')[1] || 'jpg';
  const filename = `${randomUUID()}.${ext}`;
  const uploadDir = join(process.cwd(), 'public', 'uploads');
  const filepath = join(uploadDir, filename);

  // Ensure uploads dir exists
  const { mkdir } = await import('fs/promises');
  await mkdir(uploadDir, { recursive: true });

  await writeFile(filepath, Buffer.from(bytes));

  return NextResponse.json({ url: `/uploads/${filename}` });
}

export async function DELETE(request: NextRequest) {
  const { url } = await request.json();

  if (!url || typeof url !== 'string' || !url.startsWith('/uploads/')) {
    return NextResponse.json({ error: 'Invalid file URL' }, { status: 400 });
  }

  const filepath = join(process.cwd(), 'public', url);
  try {
    await unlink(filepath);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}

function validateMagicBytes(bytes: Uint8Array, mimeType: string): boolean {
  if (bytes.length < 4) return false;
  const head = Array.from(bytes.slice(0, 4));

  switch (mimeType) {
    case 'image/jpeg': return head[0] === 0xFF && head[1] === 0xD8 && head[2] === 0xFF;
    case 'image/png': return head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4E && head[3] === 0x47;
    case 'image/webp': return head[0] === 0x52 && head[1] === 0x49 && head[2] === 0x46 && head[3] === 0x46;
    case 'image/gif': return head[0] === 0x47 && head[1] === 0x49 && head[2] === 0x46 && head[3] === 0x38;
    default: return false;
  }
}
```

- [ ] **Step 2: Add ImageUploader component**

```typescript
// components/admin/ImageUploader.tsx
'use client';

import { useState, useRef, DragEvent } from 'react';
import Image from 'next/image';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        onChange([...images, data.url]);
      }
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (url: string) => {
    try {
      await fetch('/api/admin/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
    } catch { /* ignore cleanup errors */ }
    onChange(images.filter((img) => img !== url));
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  return (
    <div className="flex flex-col gap-[12px]">
      <div className="flex flex-wrap gap-[8px]">
        {images.map((src, i) => (
          <div key={i} className="relative w-[120px] h-[120px] border border-text-muted/20 group">
            <Image src={src} alt={`Image ${i + 1}`} fill className="object-cover" sizes="120px" />
            <button
              onClick={() => removeImage(src)}
              className="absolute top-[4px] right-[4px] w-[24px] h-[24px] bg-text text-surface rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[14px]"
            >
              ×
            </button>
          </div>
        ))}
        <button
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          disabled={uploading}
          className={`w-[120px] h-[120px] border-2 border-dashed flex items-center justify-center text-body text-text-muted transition-colors ${
            dragOver ? 'border-text bg-text/5' : 'border-text-muted/30 hover:border-text-muted'
          }`}
        >
          {uploading ? '...' : '+ Добавить'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadFile(file);
          }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/api/admin/upload/route.ts components/admin/ImageUploader.tsx && git commit -m "feat: add image upload API with drag-drop and magic byte validation"
```

### Task 29: Sitemap

**Files:**
- Create: `app/sitemap.ts`

- [ ] **Step 1: Write sitemap generator**

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';
import { getProjectSlugs } from '@/lib/content';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.SITE_URL || 'https://marinafilina.com';
  const slugs = await getProjectSlugs();

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  slugs.forEach((slug) => {
    routes.push({
      url: `${baseUrl}/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  });

  return routes;
}
```

- [ ] **Step 2: Commit**

```bash
git add app/sitemap.ts && git commit -m "feat: add dynamic sitemap generation"
```

### Task 30: Parallax effect + anchor scroll

**Files:**
- Modify: `components/ProjectCard.tsx` — add parallax wrapper

- [ ] **Step 1: Add parallax to ImageSlider on scroll**

Add to ProjectCard, wrap the ImageSlider in a motion.div with `useScroll` + `useTransform`:

```typescript
// Add this import to ProjectCard.tsx
import { motion, useScroll, useTransform } from 'framer-motion';

// Inside ProjectCard component, add:
'use client';
import { useRef } from 'react';
// ... existing code ...

export default function ProjectCard({ ... }: ProjectCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['5%', '-5%']);

  return (
    <motion.article
      ref={cardRef}
      // ... existing motion props ...
    >
      <motion.div style={{ y: parallaxY }} className="overflow-hidden">
        <ImageSlider images={images} />
      </motion.div>
      {/* ... rest of component ... */}
    </motion.article>
  );
}
```

- [ ] **Step 2: Add Lenis scrollTo for CTA anchor**

Update `components/CTASection.tsx` to use Lenis scrollTo:

```typescript
// In CTASection, change the onClick behavior:
import { useLenis } from 'lenis/react';

export default function CTASection({ text }: CTASectionProps) {
  const lenis = useLenis();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.querySelector('#contacts');
    if (target && lenis) {
      lenis.scrollTo(target, { offset: 0, duration: 1.5 });
    }
  };

  return (
    // ... replace <a href="#contacts"> with onClick handler
    <a href="#contacts" onClick={handleClick} ...>
  );
}
```

Note: Need to install `lenis/react` or use the ref directly. If not available, use `window.lenis` approach.

- [ ] **Step 3: Commit**

```bash
git add components/ProjectCard.tsx components/CTASection.tsx && git commit -m "feat: add parallax effect on project images and smooth anchor scroll"
```

---

## Final Checklist

- [ ] `npm run dev` — запускается без ошибок
- [ ] `npm run build` — успешная сборка
- [ ] `npx vitest run` — все unit/component тесты проходят
- [ ] `npx playwright test` — все e2e тесты проходят
- [ ] Главная `/` — все секции, pixel-perfect по Figma
- [ ] `/about` — все секции
- [ ] `/[slug]` — 5 проектов со всем контентом
- [ ] `/admin` — логин + редактор + сохранение с подтверждением
- [ ] Адаптив: 375 / 800 / 1280
- [ ] Анимации: Lenis, Framer Motion reveal, hover
- [ ] A11y: axe-core 0 violations
