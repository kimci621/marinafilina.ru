/* Awwwards-portfolio template (Aicher/Ulm-system direction): grid-calibration preloader,
   Lenis+GSAP scroll, drafting-crosshair cursor with live grid readout, scroll reveals.
   Vanilla JS, no build step. */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const pad = (n) => String(n).padStart(2, '0');

  gsap.registerPlugin(ScrollTrigger);
  if (prefersReducedMotion) gsap.globalTimeline.timeScale(50);

  // ---- Lenis + GSAP ticker sync ----
  let lenis = null;
  if (!prefersReducedMotion) {
    lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // ---- preloader: fills a 12-segment grid ruler, like calibrating the page's own column system ----
  const preloader = document.getElementById('preloader');
  const ticks = document.querySelectorAll('#preloaderBar span');
  const counter = document.getElementById('preloaderCount');
  const counterState = { value: 0 };

  function revealHero() {
    gsap.to(preloader, {
      autoAlpha: 0,
      duration: 0.4,
      onComplete: () => {
        preloader.remove();
        animateHeroIn();
      },
    });
  }

  gsap.to(counterState, {
    value: 100,
    duration: prefersReducedMotion ? 0.1 : 1.1,
    ease: 'power1.inOut',
    onUpdate: () => {
      const v = counterState.value;
      counter.textContent = pad(Math.round(v));
      const filled = Math.round((v / 100) * ticks.length);
      ticks.forEach((t, i) => t.classList.toggle('is-filled', i < filled));
    },
    onComplete: revealHero,
  });

  // ---- hero: grid draws in column-by-column, then the headline wipes into place ----
  function animateHeroIn() {
    const gridSpans = document.querySelectorAll('#heroGrid span');
    const words = document.querySelectorAll('#heroTitle .word');
    gsap.set(gridSpans, { scaleY: 0 });
    gsap.set(words, { clipPath: 'inset(0 0 100% 0)' });

    gsap.timeline()
      .to(gridSpans, { scaleY: 1, duration: 0.5, ease: 'power2.out', stagger: 0.025 })
      .to(words, { clipPath: 'inset(0 0 0% 0)', duration: 0.6, ease: 'power3.out', stagger: 0.06 }, '-=0.25')
      .fromTo('.hero__sub, .hero__scroll',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
        '-=0.2'
      );
  }

  // ---- custom cursor: drafting crosshair with a live column/row readout ----
  if (hasFinePointer && !prefersReducedMotion) {
    const vLine = document.getElementById('cursorV');
    const hLine = document.getElementById('cursorH');
    const label = document.getElementById('cursorLabel');
    let hoverText = null;

    window.addEventListener('mousemove', (e) => {
      const { clientX: x, clientY: y } = e;
      vLine.style.left = `${x}px`;
      hLine.style.top = `${y}px`;
      label.style.left = `${x + 14}px`;
      label.style.top = `${y + 14}px`;
      if (!hoverText) {
        const col = Math.min(12, Math.floor((x / innerWidth) * 12) + 1);
        const row = Math.floor(y / 48) + 1;
        label.textContent = `C${pad(col)} / R${pad(row)}`;
      }
    });

    document.querySelectorAll('[data-cursor-label]').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        hoverText = el.dataset.cursorLabel;
        label.textContent = hoverText;
      });
      el.addEventListener('mouseleave', () => { hoverText = null; });
    });
  } else {
    document.getElementById('cursorV')?.remove();
    document.getElementById('cursorH')?.remove();
    document.getElementById('cursorLabel')?.remove();
  }

  // ---- scroll reveals (hero sub, eyebrows, work cards, process steps, contact) ----
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 85%',
    onEnter: (batch) => batch.forEach((el) => el.classList.add('is-visible')),
  });

  // ---- refresh after fonts/images settle ----
  window.addEventListener('load', () => ScrollTrigger.refresh());
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
});
