# GSAP + Lenis: техника

Актуальные версии проверяй на jsdelivr/npm перед запуском в продакшн — здесь зафиксированы версии, известные рабочими на момент написания. Рабочий пример подключения — `template/main.js`.

## Подключение (CDN, без сборки)

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/SplitText.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.18/dist/lenis.min.js"></script>
```

`SplitText` в GSAP 3.12 — часть Club GreenSock (платный плагин); при отсутствии доступа замени на ручное разбиение текста на `<span>` через JS (см. `splitTextFallback` в `template/main.js`) или на бесплатный аналог.

## Lenis + GSAP ScrollTrigger: синхронизация

Главная ошибка — завести Lenis и GSAP на разных rAF-циклах: скролл-анимации начинают дёргаться/отставать. Решение — один тикер на двоих:

```js
const lenis = new Lenis({ duration: 1.2, smoothWheel: true });

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);
```

`gsap.ticker.lagSmoothing(0)` обязателен — иначе GSAP пытается "нагонять" после лагов и Lenis теряет плавность.

## Доступность: prefers-reduced-motion

Обязательный гейт, не опция:

```js
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  gsap.globalTimeline.timeScale(50); // мгновенно доигрывает анимации входа
  // Lenis вообще не инициализировать — оставить нативный скролл
} else {
  // обычная инициализация Lenis + анимаций
}
```

Как минимум: анимации входа не блокируют контент дольше ~0.1с, decorative motion (parallax, marquee, cursor-эффекты) отключается полностью.

## Перфоманс

- Анимируй `transform`/`opacity`, не `top/left/width/height` — это layout-thrashing.
- `will-change: transform` только на элементах, которые реально анимируются, и только на время анимации (не вешать статично на весь DOM).
- `ScrollTrigger.batch()` для множества одинаковых reveal-элементов вместо создания триггера на каждый вручную.
- На мобильном отключай тяжёлый parallax/custom cursor (курсора там физически нет) — проверяй через `matchMedia('(hover: hover) and (pointer: fine)')`.
- Чисти `ScrollTrigger`/Lenis при уходе со страницы (SPA) — `ScrollTrigger.killAll()`, `lenis.destroy()`, иначе утечки при переходах.

## Типовые баги

| Симптом | Причина | Фикс |
|---|---|---|
| ScrollTrigger триггерится не в том месте после resize/загрузки шрифтов | Позиции посчитаны до финальной геометрии страницы | `ScrollTrigger.refresh()` после `fonts.ready` / загрузки изображений |
| Скролл дёргается / анимации "плывут" | Lenis и GSAP на разных rAF | см. секцию синхронизации выше |
| Pin-секция схлопывается / контент прыгает | Не задан `pinSpacing`/высота обёртки | явно задать высоту трека под pin или `pinSpacing: true` (по умолчанию) |
| Анимации не запускаются на первом заходе | Скрипт запущен до `DOMContentLoaded`, элементы ещё не в DOM | оборачивать инициализацию в `DOMContentLoaded` или ставить `<script defer>` в конце `<body>` |
