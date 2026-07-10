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
- Tailwind CSS v4 — все стили (CSS-based config, @theme)
- Framer Motion — все анимации
- Inter — единственный шрифт
- Pixel-perfect по замерам из Figma:
  - Desktop: content 1250px, padding 15px
  - Tablet: content 770px, padding 15px
  - Mobile: content 345px, padding 15px

## Тесты
- Vitest для unit/component
- Playwright для e2e
- Каждый компонент имеет render-тест
- Каждый API-роут имеет тест

## Git
- Ветка: main
- Conventional commits: feat:, fix:, test:, refactor:, chore:, docs:
