# Марина Филина — Портфолио (Техническое задание)

> **Figma:** `knl76AvDWi8ErFOFlTCjoY` | **Node (Home):** `675:14738` | **Node (Styles):** `675:14741`

## 1. Обзор

Одностраничный сайт-портфолио арт-директора с 3 страницами:
- **Главная** `/` — лендинг с проектами
- **Обо мне** `/about` — bio, услуги
- **Проект** `/[slug]` — детальная страница проекта

Скрытая админ-панель `/admin` для редактирования контента без кода.

## 2. Дизайн-система

### 2.1. Цвета

| Токен | HEX | Назначение |
|-------|-----|------------|
| `color-text` | `#000000` | Основной текст |
| `color-text-muted` | `#767676` | Мuted-текст, лейблы, дефолтные ссылки |
| `color-text-nav` | `#1e1e1e` | Текст логотипа в навбаре |
| `color-surface` | `#ffffff` | Фон всех секций |
| `color-background` | `#ffffff` | Фон страницы |

### 2.2. Типографика

Шрифт: **Inter** (Google Fonts, latin subset)

| Токен | Размер | Вес | Line-height | Letter-spacing | Использование |
|-------|--------|-----|-------------|----------------|---------------|
| `text-hero` | 64px | 400 | 70.4px | -3.2px | Hero-заголовок (Desktop) |
| `text-hero-tablet` | 64px | 400 | 70.4px | -3.2px | Hero-заголовок (Tablet) |
| `text-hero-mobile` | 44px | 400 | 48.4px | — | Hero-заголовок (Mobile) |
| `text-subtitle` | 37px | 400 | 40.7px | — | Подзаголовок, CTA, лого футера (Desktop) |
| `text-subtitle-tablet` | 30px | 400 | 33px | — | Подзаголовок, CTA (Tablet) |
| `text-subtitle-mobile` | 24px | 400 | 26.4px | — | Подзаголовок, CTA (Mobile) |
| `text-h3` | 30px | 400 | 33px | — | Названия проектов (Desktop) |
| `text-h4` | 24px | 400 | 26.4px | — | Заголовки (Tablet/Mobile) |
| `text-label` | 16px | 600 | 17.6px | — | Лейбл «Project» |
| `text-body-lg` | 20px | 400 | 24.2px | — | Нав-ссылки, тексты |
| `text-body` | 16px | 400 | 17.6px | — | Описания проектов |
| `text-link` | 16px | 500 | 17.6px | — | Ссылки «Посмотреть проект →» |
| `text-link-lg` | 20px | 500 | 22px | — | Крупные ссылки |
| `text-nav` | 20px | 400 | 20px | — | Навигационные ссылки |

### 2.3. Брейкпоинты

| Токен | Диапазон | Макс. ширина контента |
|-------|----------|----------------------|
| Mobile | 375px – 799px | 345px |
| Tablet | 800px – 1279px | 770px |
| Desktop | 1280px+ | 1250px |

### 2.4. Отступы и сетка

- Горизонтальный padding контента: 15px от краёв фрейма
- Вертикальные отступы между секциями: согласно Figma (извлечь при доступе)
- Сетка: 12 колонок на Desktop, гибкая на Tablet/Mobile

## 3. Архитектура проекта

```
marina-landing/
├── app/
│   ├── layout.tsx                    # Inter, метаданные, Lenis-провайдер
│   ├── page.tsx                      # Главная (SSG)
│   ├── about/page.tsx                # Обо мне (SSG)
│   ├── [slug]/page.tsx               # Проект (SSG, generateStaticParams)
│   ├── admin/
│   │   ├── page.tsx                  # Защищённая админка (Client Component)
│   │   └── layout.tsx                # Без основного layout
│   ├── globals.css                   # Tailwind + кастомные утилиты
│   └── api/
│       └── admin/
│           ├── login/route.ts        # POST — аутентификация
│           ├── content/route.ts      # GET/PUT — чтение/запись content.json
│           ├── upload/route.ts       # POST/DELETE — загрузка/удаление фото
│           └── revalidate/route.ts   # POST — сброс ISR-кеша
├── components/
│   ├── Nav.tsx                       # Десктоп/планшет (sticky, show/hide на скролл)
│   ├── NavMobile.tsx                 # Бургер-меню
│   ├── Hero.tsx                      # Fade-up reveal на скролле
│   ├── ProjectCard.tsx               # Слайдер изображений + описание
│   ├── ImageSlider.tsx               # CSS scroll-snap слайдер
│   ├── CTASection.tsx                # Линии + текст с reveal-анимацией
│   ├── Footer.tsx                    # Лого + контакты + соцсети
│   └── admin/
│       ├── LoginForm.tsx             # Форма входа
│       ├── AdminLayout.tsx           # Левая панель табов + правая форма
│       ├── ContentEditor.tsx         # Редактор полей (text/textarea/upload)
│       └── ImageUploader.tsx         # Drag-n-drop загрузка с превью
├── lib/
│   ├── content.ts                    # getContent(), updateContent()
│   ├── auth.ts                       # verifyPassword(), createToken(), verifyToken()
│   └── upload.ts                     # saveFile(), deleteFile(), validateImage()
├── types/
│   └── content.ts                    # TypeScript-типы для content.json
├── data/
│   └── content.json                  # Весь контент сайта
├── public/
│   └── uploads/                      # Загруженные фото (gitignored)
├── design-system/
│   └── tokens.json                   # Дизайн-токены (цвета, типографика, брейкпоинты)
├── .agent/
│   ├── rules.md                      # Правила для всех агентов
│   └── agents/
│       ├── orchestrator.md           # Контроль прогресса
│       ├── judge.md                  # Распределение задач
│       ├── design.md                 # Figma → токены
│       ├── developer.md              # TDD-разработка
│       ├── tester.md                 # Playwright e2e
│       └── reviewer.md              # Spec + code review
├── docs/
│   └── superpowers/
│       ├── specs/
│       │   └── 2026-07-10-marina-landing-design.md  # Этот документ
│       └── plans/
│           └── (implementation plan)
├── .env.local                       # ADMIN_PASSWORD, JWT_SECRET
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
└── package.json
```

## 4. Страницы и компоненты

### 4.1. Главная `/`

**Секции (сверху вниз):**

1. **Nav** — фиксированный, логотип «Марина Филина» слева, ссылки «Обо мне» / «Контакты» справа. При скролле вниз — скрывается, при скролле вверх — показывается. Мобилка: бургер «Меню» → выпадающее меню «Work» / «About» / «Contact». Открытое меню блокирует скролл.

2. **Hero** — fade-up reveal при загрузке:
   - Заголовок: «Внештатный арт-директор бренда»
   - Подзаголовок: «Руководителям и менеджерам пусть останется только управленческая и стратегическая работа. Я займусь визуалом и его качеством.»
   - Чистый текст, без кнопок и картинок

3. **Our Work** — 5 карточек проектов. Каждая карточка:
   - Горизонтальный слайдер из 3 изображений (460×460px каждый, общая ширина 1380px)
   - Слайдер выходит за границы контейнера (1250px → overflow visible)
   - CSS scroll-snap + индикаторы-точки
   - Название проекта
   - Краткое описание (2-3 строки)
   - Ссылка «Посмотреть проект →» (ховер: сдвиг стрелки, цвет меняется с #767676 на #000000)

4. **CTA** — линии-разделители (анимируются от центра при входе в viewport) + текст «Расскажите о своих задачах на консультации» между ними. Текст — ссылка (якорь на футер/контакты).

5. **Footer** — логотип «Марина Филина» + блок контактов (email, телефон) + блок «СОЦСЕТИ» со списком ссылок.

### 4.2. Обо мне `/about`

**Секции (Desktop 1280, Tablet 800, Mobile 375):**

1. **Nav** — стандартный, как на главной
2. **Intro section** — крупное имя + заголовок
   - Имя: «Марина Филина»
   - Заголовок: «Создам образ бренда, продающий вашу идею»
3. **Stats section × 4** — блоки с услугами:
   - «Бренд с нуля» — Делаю собственный визуальный язык бренда: узнаваемый, понятный и вызывающий доверие
   - «Обновление» — Сохраняю узнаваемость бренда. Учу его общаться с новой аудиторией и радовать прежнюю
   - «Поддержка» — Провожу авторский надзор внедрения фирменного стиля, чтобы всё было так, как надо
4. **Образование и опыт:**
   - Окончила ВГУ ПММ в 2021 году
   - 2.5 года опыта работы графическим дизайнером
   - 1 год опыта преподавания дизайна и программирования в частной школе
   - Преподаватель дизайна и программирования в IT-школе KiberOne
   - Репетитор по дизайну для начинающих специалистов
5. **Our team section** — командный блок (если применимо)
6. **Connect with us section** — контакты
7. **Footer** — как на главной

**Контакты:**
- Телефон: +7 903 650 65 99
- Соцсети: Behance, Telegram, TG-канал, Паблик VK, Soundcloud

### 4.3. Проект `/[slug]`

Каждая страница проекта: нав + контент проекта + футер.

**Проекты:**

| Слаг | Название | Клиент | Задача |
|------|----------|--------|--------|
| `faculty-amm` | Фирменный стиль факультета ПММ | Факультет ПММ ВГУ | Обновить старый фирменный стиль, выглядеть современно |
| `flysurf` | Fly Surf Camp | Fly Surf Camp (водный спорт) | Брендинг сообщества водного спорта, альтернатива ночным тусовкам |
| `syntepart` | Айдентика завода SYNTEPART | Механический завод | Сохранить советское наследие, прийти в новый век |
| `fittin` | Ребрендинг FITTIN | IT-компания FITTIN | Айдентика о новой нише — мобильной разработке |
| `manipula` | Айдентика Manipula | Сеть салонов лазерной эпиляции | Отстроиться от конкурентов, создать вайб безопасности и расслабления |

**Структура страницы проекта:**
1. Hero с названием проекта + клиентом
2. Галерея изображений (drag-to-reorder через админку)
3. Блок «Задача»
4. Блок «Концепт» / описание решения
5. Детали: услуги, сроки, этапы работы (если есть)
6. Навигация: предыдущий/следующий проект

## 5. Анимации и скролл

### 5.1. Технологии
- **Lenis** — плавный инерционный скролл (`lerp: 0.1`, `duration: 1.2`)
- **Framer Motion** — reveal-анимации, ховеры, page transitions
- **Intersection Observer** — триггер анимаций при входе в viewport

### 5.2. Эффекты

| Эффект | Где | Реализация |
|--------|-----|------------|
| Fade-up reveal | Hero, карточки проектов, CTA, футер | Framer Motion `whileInView` + blur(8px) → blur(0) |
| Sticky header | Nav | `useScroll` → скрыть при скролле вниз, показать вверх |
| Параллакс изображений | ProjectCard | Смещение фото на 10% от скролла внутри карточки |
| Линии CTA | CTASection | SVG-линии, `scaleX` от 0 до 1 из центра |
| Ховер на проекты | ProjectCard → ссылка | Стрелка → translateX(4px), цвет меняется |
| Слайдер | ProjectCard | CSS `scroll-snap-type: x mandatory` |
| Page transitions | Навигация между страницами | Framer Motion `AnimatePresence` |

### 5.3. Скролл-контроль
- Lenis: `scrollRestoration: 'manual'`
- Блокировка скролла: `lenis.stop()` при открытом мобильном меню
- `lenis.scrollTo()` для якорных ссылок

## 6. Админ-панель `/admin`

### 6.1. Аутентификация

- Мастер-пароль в `.env.local` → `ADMIN_PASSWORD`
- При первом запуске: пароль хешируется bcrypt (12 раундов), сохраняется в Vercel KV (production) или `data/admin.json` (development)
- Логин: JWT-токен в httpOnly cookie (`admin_token`), срок — 24 часа
- 3 неверные попытки → 5-минутная блокировка (in-memory, сбрасывается при рестарте)

### 6.2. Редактирование контента

Админка — Client Component. Левая панель с табами, правая — форма.
Контент читается/пишется через Vercel KV (production) или `data/content.json` (development).

**Табы:**
- **Home** — Hero + проекты + CTA
- **About** — фото, имя, био, услуги
- **Projects** — выбор проекта → редактирование
- **Footer** — контакты, соцсети, нав-ссылки
- **SEO** — meta-теги для всех страниц

**Сохранение:**
- Кнопка «Сохранить изменения»
- Модальное окно подтверждения: «Сохранить изменения?» → Да / Нет
- После сохранения: `PUT /api/admin/content` → запись `data/content.json` → ревалидация ISR
- Никакого автосохранения

### 6.3. Загрузка изображений

- Drag-n-drop или клик для выбора
- Валидация: только `image/*`, макс. 5MB, проверка magic bytes на сервере
- Имена файлов: UUID + оригинальное расширение
- Превью перед загрузкой
- При замене: старый файл удаляется
- Drag-to-reorder для порядка фото в галерее

### 6.4. API-роуты

| Роут | Метод | Назначение |
|------|-------|------------|
| `/api/admin/login` | POST | `{ password }` → `Set-Cookie: admin_token` |
| `/api/admin/logout` | POST | Очистка cookie |
| `/api/admin/content` | GET | Вернуть весь `content.json` |
| `/api/admin/content` | PUT | Сохранить `content.json` + ревалидация |
| `/api/admin/upload` | POST | Multipart-загрузка файла → URL |
| `/api/admin/upload` | DELETE | `{ url }` → удалить файл |
| `/api/admin/revalidate` | POST | Принудительная ревалидация ISR |

### 6.5. Middleware

```typescript
// middleware.ts — защита /api/admin/* и /admin (кроме /admin/login)
// Проверка JWT из cookie admin_token
// Нет токена или невалидный → 401 / редирект на /admin
```

## 7. Контент: data/content.json

```typescript
// types/content.ts
interface SiteContent {
  nav: {
    logo: string;
    links: { label: string; href: string }[];
  };
  home: {
    hero: { title: string; subtitle: string };
    projects: string[]; // slug'и проектов в порядке отображения
    cta: string; // текст CTA
  };
  about: {
    photo: string; // путь к фото
    name: string;
    bio: string;
    services: string[];
  };
  projects: Record<string, {
    title: string;
    description: string;
    images: string[];
    category: string;
    liveUrl: string;
  }>;
  footer: {
    email: string;
    phone?: string;
    socials: { label: string; url: string }[];
  };
  seo: Record<string, { title: string; description: string }>;
}
```

## 8. SEO

- Все страницы: SSG (`generateStaticParams` для проектов)
- `metadata` export из каждого `page.tsx`
- Open Graph: title, description, image
- Динамические meta-теги из `content.json` → `seo`
- `sitemap.ts` — автоматическая генерация

## 9. Деплой

### Vercel (основной вариант)
- Environment variables: `ADMIN_PASSWORD`, `JWT_SECRET`
- ISR: `revalidate = 3600` (1 час) для страниц
- `POST /api/admin/content` → `revalidatePath()` → мгновенное обновление

### Netlify (альтернатива)
- Next.js Runtime плагин
- Те же переменные окружения
- ISR работает через Netlify (Next.js 14+)

### Требования
- Node.js 20+
- Файловая система доступна на запись (serverless — `/tmp` для загрузок, content.json коммитится в репо или хранится в внешнем хранилище)

> **Решение (выбрано):** Вариант B — Content хранится в **Vercel KV** (бесплатный тир: 256MB, дневной лимит 5000 запросов — более чем достаточно). Админка пишет напрямую в KV, страницы читают при сборке (SSG). Фото — Vercel Blob. Без задержек, без коммитов в репо.

## 10. Безопасность

- `JWT_SECRET` — минимум 32 случайных символа, генерируется при инициализации
- `ADMIN_PASSWORD` — bcrypt, 12 раундов
- Content API: только авторизованные запросы
- Загрузка файлов: проверка MIME-type и magic bytes
- CSP-заголовки для админки
- Rate limiting: 3 попытки логина → блокировка 5 минут
- `httpOnly`, `secure`, `sameSite: 'strict'` для JWT cookie

## 11. Тестирование

### Уровни

| Уровень | Инструмент | Что тестируем |
|---------|-----------|---------------|
| Unit | Vitest | lib/content.ts, lib/auth.ts, валидация |
| Component | Vitest + RTL | Nav, Hero, ProjectCard, Footer |
| Integration | Vitest | API-роуты `/api/admin/*` |
| E2E | Playwright | Все страницы, админка, адаптив (3 брейкпоинта) |
| Visual | Playwright screenshots | Pixel-perfect сравнение с Figma |
| A11y | Playwright + axe-core | Accessibility audit |

### TDD-цикл для каждого компонента
1. Написать failing test
2. Запустить → красный
3. Минимальная реализация
4. Запустить → зелёный
5. Рефакторинг (если нужно)
6. Коммит

## 12. Агенты и процесс разработки

### 12.1. Иерархия

```
Оркестратор → Судья → [Дизайн | Разработчик | Тестировщик | Ревьюер]
     │
     └── План (plan.md) — чекбоксы, обновляются оркестратором
```

### 12.2. Обязанности агентов

- **Оркестратор:** читает план, передаёт задачи судье, отслеживает прогресс, обновляет статусы в plan.md. Единственный, кто видит картину целиком.
- **Судья:** получает задачу от оркестратора → дробит на атомарные шаги (2-5 минут каждый) → назначает профильному агенту → проверяет результат → возвращает оркестратору.
- **Дизайн:** извлекает токены из Figma, сверяет pixel-perfect, создаёт `design-system/tokens.json`. Не пишет код компонентов.
- **Разработчик:** TDD, один компонент за раз, тест → код → коммит. Не принимает решений о дизайне.
- **Тестировщик:** Playwright e2e, визуальные регрессии, проверка адаптива. Не пишет продакшн-код.
- **Ревьюер:** два этапа — spec compliance (соответствие этому ТЗ), затем code quality (чистота, типы, производительность).

### 12.3. Правила (rules.md)

```markdown
# Правила проекта marina-landing

## Процесс
- TDD обязательно: сначала failing test → потом код
- Каждый шаг — одна атомарная операция (2-5 минут)
- Коммит после каждого завершённого шага: `feat(scope): описание`
- Не трогать файлы вне задачи

## Код
- TypeScript strict mode
- Именованные экспорты для компонентов (не default)
- Контент ТОЛЬКО из data/content.json
- Изображения ТОЛЬКО из public/uploads/
- Никаких any, никаких ts-ignore

## Стиль
- Tailwind CSS — все стили
- Framer Motion — все анимации (не CSS transitions)
- Inter — единственный шрифт

## Тесты
- Vitest для unit/component/integration
- Playwright для e2e
- Каждый компонент имеет минимум render-тест
- Каждый API-роут имеет тест с моком и без

## Git
- Ветка: main
- Conventional commits: feat:, fix:, test:, refactor:, docs:
- Никаких force-push
```

## 13. Этапы реализации

1. **Фундамент** — Next.js, Tailwind, типы, контент-система, аутентификация
2. **Дизайн-токены** — извлечение из Figma, tokens.json, Tailwind-конфиг
3. **Компоненты** — Nav, Hero, ProjectCard, ImageSlider, CTASection, Footer
4. **Страницы** — Главная, /about, /[slug]
5. **Анимации** — Lenis, Framer Motion, reveal-эффекты
6. **Админка** — логин, редактор контента, загрузка фото, API
7. **Тестирование** — unit, component, e2e, visual regression
8. **Деплой** — Vercel/Netlify настройка, переменные, продакшн-сборка

---

## Статус Figma-данных

| Данные | Статус |
|--------|--------|
| Home — структура и тексты | ✅ Получено |
| Styles — типографика, цвета, компоненты | ✅ Получено |
| /about — структура и контент | ✅ Получено |
| Проекты — названия, клиенты, задачи | ✅ Получено |
| Изображения (exports) | ⏳ Нужен доступ к Figma API image endpoint |
