---
name: awwwards-portfolio
description: Use when building or reshaping a designer/creative personal portfolio ("сайт-визитка") aimed at Awwwards/FWA-level craft - motion-heavy landing for a creative professional, scroll storytelling, signature interaction, GSAP/Lenis animation stack, or case-study presentation for design work.
---

# Awwwards Portfolio

Сайт-визитка дизайнера продаёт не список услуг, а вкус. Решает всё: один сигнатурный момент, темп скролла, то, как текст появляется на экране.

**REQUIRED BACKGROUND:** сначала `frontend-design` — там принципы палитры, типографики, отказа от AI-шаблонности и текста-как-дизайна. Этот скилл не повторяет их, а добавляет то, что специфично именно для motion-heavy портфолио: скролл-сторителлинг, сигнатурная интеракция, техника GSAP/Lenis, структура кейс-стади.

## Процесс

1. **Бриф.** Прежде чем предлагать дизайн — собери вводные по `references/brief-questionnaire.md`. Без ниши, тона и хотя бы 2-3 референсов дизайн скатится в шаблон.
2. **Сигнатурный момент.** Выбери один паттерн из `references/patterns.md`, который станет "тем самым" впечатлением страницы. Не пытайся впихнуть все паттерны сразу — awwwards-жюри штрафует за шум, а не награждает за количество эффектов.
3. **Техника.** Реализация motion — по `references/motion-gsap-lenis.md` (GSAP + ScrollTrigger + Lenis, доступность, перфоманс).
4. **Текст.** Структура копирайта (hero-тезис, about, кейс: задача/подход/результат) — `references/copywriting.md`.
5. **Старт кода** — папка `template/`: рабочий демо-сайт на vanilla HTML/CSS/JS с уже настроенными Lenis+GSAP, прелоадером, custom cursor, magnetic-кнопками и scroll-reveal. Копируй и адаптируй под бриф, а не пиши с нуля.
6. **Проверка перед сдачей** — пройди `references/checklist.md` (responsive, focus-visible, reduced motion, perf, meta).

## Когда какой файл открывать

| Нужно | Файл |
|---|---|
| Задать вопросы дизайнеру / собрать бриф | `references/brief-questionnaire.md` |
| Выбрать сигнатурную анимацию/интеракцию | `references/patterns.md` |
| Подключить и настроить GSAP/ScrollTrigger/Lenis | `references/motion-gsap-lenis.md` |
| Написать текст hero/about/кейса | `references/copywriting.md` |
| Стартовый код сайта | `template/index.html`, `template/styles.css`, `template/main.js` |
| Финальная проверка перед публикацией | `references/checklist.md` |

## Красные флаги (шаблонный AI-дизайн)

- Все паттерны из `patterns.md` включены разом — это шум, а не awwwards-уровень. Один сигнатурный момент важнее пяти средних.
- Анимации ради анимаций: motion, который не рассказывает ничего про контент/бренд, — вырезать.
- Копирайт вида "Innovative Solutions for Modern World" — см. `copywriting.md`, писать от конкретики, не от общих слов.
- Смешение random cursor/scroll-эффектов без уважения `prefers-reduced-motion` — обязательная деградация, см. `motion-gsap-lenis.md`.
