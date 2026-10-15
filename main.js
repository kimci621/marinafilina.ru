/* Awwwards-portfolio (Aicher/Ulm-system direction) — Марина Филина / WithArt.
   Весь контент рендерится из content.js (window.SITE_CONTENT), в HTML — только каркас.
   Grid-calibration preloader, Lenis+GSAP scroll, drafting-crosshair cursor, scroll reveals. */

document.addEventListener('DOMContentLoaded', () => {
  const C = window.SITE_CONTENT;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const pad = (n) => String(n).padStart(2, '0');
  const { contactActionsHTML, bindCopyButton, showWithoutMotion } = window.SITE_SHARED;

  // ---- render: content.js -> DOM ----
  function attachPhotoFallback(img) {
    img.addEventListener('error', () => { img.style.display = 'none'; }, { once: true });
  }

  function renderMeta() {
    document.title = C.meta.title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', C.meta.description);
  }

  function renderNav() {
    const logo = document.getElementById('navLogo');
    logo.innerHTML = `${window.BRAND_MARK_SVG}<span>${C.brand.name}</span>`;
    const links = document.getElementById('navLinks');
    links.innerHTML = C.nav.links.map((l) =>
      `<a href="${l.href}" class="${l.cta ? 'nav__cta' : ''}" data-cursor-label="${l.cursorLabel}">${l.label}</a>`
    ).join('');
  }

  // ---- навигация: подсвечиваем раздел, который пересекает середину экрана ----
  function setupNavCurrent() {
    const links = document.querySelectorAll('#navLinks a:not(.nav__cta)');
    const linkFor = { work: '#work', about: '#about', terms: '#about' };
    let current = null;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) current = e.target.id;
        else if (current === e.target.id) current = null;
      });
      links.forEach((a) => {
        if (current && a.getAttribute('href') === linkFor[current]) a.setAttribute('aria-current', 'location');
        else a.removeAttribute('aria-current');
      });
    }, { rootMargin: '-50% 0px -50% 0px' });
    Object.keys(linkFor).forEach((id) => observer.observe(document.getElementById(id)));
  }

  function renderHero() {
    const title = document.getElementById('heroTitle');
    title.innerHTML = C.hero.lines.map((line) => {
      const words = line.map((w) => {
        const text = typeof w === 'string' ? w : w.text;
        const cls = typeof w === 'object' && w.accent ? 'word accent-word' : 'word';
        const inner = typeof w === 'object' && w.accent ? `<span class="accent">${text}</span>` : text;
        return `<span class="${cls}">${inner}</span>`;
      }).join(' ');
      return `<span class="line">${words}</span>`;
    }).join('\n');
    document.getElementById('heroSub').textContent = C.hero.sub;
    document.getElementById('heroScrollLabel').textContent = C.hero.scrollLabel;
    renderHeroReel();
  }

  // ---- hero: работы в первом экране, по очереди все проекты тем же пиксельным переходом ----
  function renderHeroReel() {
    const projects = C.work.projects;
    const reel = document.getElementById('heroReel');
    reel.innerHTML = `
      <div class="project-card__image">
        <img class="project-card__photo" data-fallback src="${projects[0].covers[0]}" alt="">
        <span class="project-card__mark"></span>
      </div>
      <div class="project-card__meta"><span class="hero__reel-index"></span><b></b><p></p></div>`;
    const box = reel.querySelector('.project-card__image');
    const img = reel.querySelector('img');
    attachPhotoFallback(img);
    const show = (i) => {
      const p = projects[i];
      reel.href = `project.html?slug=${p.slug}`;
      box.className = `project-card__image project-card__image--${p.color}`;
      img.style.display = '';
      img.src = p.covers[0];
      img.alt = p.title;
      reel.querySelector('.hero__reel-index').textContent = `${p.index} / ${pad(projects.length)}`;
      reel.querySelector('b').textContent = p.title;
      reel.querySelector('p').textContent = p.subtitle;
    };
    show(0);
    setupCoverCycle(reel, projects.length, show);
  }

  function renderStrip() {
    const track = document.getElementById('stripTrack');
    const items = C.strip.map((s) => `<span>${s}</span><span class="tick">/</span>`).join('');
    track.innerHTML = items + items; // дублируем для бесшовной прокрутки
  }

  function renderWork() {
    document.getElementById('workIndex').textContent = C.work.eyebrowIndex;
    document.getElementById('workLabel').textContent = C.work.eyebrowLabel;
    document.getElementById('workIntro').textContent = C.work.intro;
    const grid = document.getElementById('workGrid');
    const projects = C.work.projects;
    grid.innerHTML = projects.map((p) => {
      return `
      <article class="project-card" data-reveal>
        <a href="project.html?slug=${p.slug}" data-cursor-label="ОТКРЫТЬ">
          <div class="project-card__image project-card__image--${p.color}">
            <img class="project-card__photo" data-fallback src="${p.covers[0]}" alt="" loading="lazy">
            <span class="project-card__index">${p.index}</span>
            <span class="project-card__mark"></span>
          </div>
          <div class="project-card__meta">
            <h3>${p.title}</h3>
            <p>${p.subtitle}</p>
          </div>
        </a>
      </article>`;
    }).join('') + `
      <article class="project-card project-card--cta" data-reveal>
        <div class="project-card__image project-card__image--cta">
          <span class="project-card__mark"></span>
        </div>
        <div class="project-card__meta">
          <h3>${C.work.cta.title}</h3>
          <p><a href="#contact" data-cursor-label="НАПИСАТЬ">${C.work.cta.linkText}</a>${C.work.cta.suffix}</p>
        </div>
      </article>` + ((projects.length + 1) % 2 === 1 ? '<div class="project-card__spacer" aria-hidden="true"></div>' : '');
    grid.querySelectorAll('img[data-fallback]').forEach(attachPhotoFallback);
    grid.querySelectorAll('.project-card').forEach((card, i) => {
      const p = projects[i];
      if (!p) return;
      const img = card.querySelector('.project-card__photo');
      setupCoverCycle(card, p.covers.length, (k) => { img.src = p.covers[k]; });
    });
  }

  // ---- project cards: cycle 3 covers every 5s with a right-to-left pixelation wipe, pausing on hover ----
  const PIXEL_COLS = 8;
  const PIXEL_ROWS = 5;

  // лёгкий тон фона проекта поверх белого — вместо нейтрального серого
  function tintWithWhite(rgb, ratio) {
    const [r, g, b] = rgb;
    const mix = (c) => Math.round(255 * (1 - ratio) + c * ratio);
    return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
  }

  // show(i) меняет содержимое кадра под пикселями: обложку на карточке или целый проект в hero
  function setupCoverCycle(card, count, show) {
    if (count < 2 || !window.gsap) return;
    const imageBox = card.querySelector('.project-card__image');

    const pixelate = document.createElement('div');
    pixelate.className = 'project-card__pixelate';
    for (let i = 0; i < PIXEL_ROWS * PIXEL_COLS; i++) pixelate.appendChild(document.createElement('span'));
    imageBox.appendChild(pixelate);
    const cells = pixelate.children;

    // тон берём из текущего фона: в hero он меняется вместе с проектом
    function paintCells() {
      const bg = getComputedStyle(imageBox).backgroundColor.match(/\d+/g).map(Number);
      [...cells].forEach((cell, i) => {
        const t = (i % PIXEL_COLS) / (PIXEL_COLS - 1);
        cell.style.background = tintWithWhite(bg, 0.3 + t * 0.15);
      });
    }

    let index = 0;
    let hovered = false;
    const schedule = () => { setTimeout(tick, 5000); };

    function tick() {
      if (hovered) { schedule(); return; }
      const next = (index + 1) % count;
      paintCells();
      gsap.timeline({ onComplete: schedule })
        .to(cells, {
          opacity: 0.92,
          duration: 0.5,
          ease: 'sine.inOut',
          stagger: { each: 0.035, from: 'end', grid: [PIXEL_ROWS, PIXEL_COLS], axis: 'x' },
        })
        .call(() => { show(next); index = next; })
        .to(cells, {
          opacity: 0,
          duration: 0.5,
          ease: 'sine.inOut',
          stagger: { each: 0.035, from: 'end', grid: [PIXEL_ROWS, PIXEL_COLS], axis: 'x' },
        });
    }

    card.addEventListener('mouseenter', () => { hovered = true; });
    card.addEventListener('mouseleave', () => { hovered = false; });
    schedule();
  }

  function renderAbout() {
    const A = C.about;
    document.getElementById('aboutIndex').textContent = A.eyebrowIndex;
    document.getElementById('aboutLabel').textContent = A.eyebrowLabel;
    document.getElementById('aboutTitle').textContent = A.title;
    document.getElementById('aboutLead').innerHTML = A.lead.map((p) => `<p>${p}</p>`).join('');

    document.getElementById('aboutPhoto').outerHTML =
      `<img class="about__photo" src="${A.photo.src}" alt="${A.photo.alt}" width="640" height="640" loading="lazy">`;
    attachPhotoFallback(document.querySelector('.about__photo'));
    document.getElementById('aboutName').textContent = A.profile.name;
    document.getElementById('aboutRole').textContent = A.profile.role;
    document.getElementById('aboutAgenciesLabel').textContent = A.profile.agenciesLabel;
    document.getElementById('aboutAgencies').innerHTML = A.profile.agencies.map((a) =>
      `<li><strong>${a.name}</strong><span>${a.years}</span></li>`
    ).join('');
    document.getElementById('aboutAgenciesNote').textContent = A.profile.agenciesNote;

    document.getElementById('stepsTitle').textContent = A.stepsTitle;
    document.getElementById('processList').innerHTML = A.steps.map((s, i) => `
      <li data-reveal>
        <span class="process__num">${pad(i + 1)}</span>
        <div><p class="process__action">${s.action}</p><p class="process__result">${s.result}</p></div>
      </li>`).join('');
  }

  function renderTerms() {
    const T = C.terms;
    document.getElementById('termsIndex').textContent = T.eyebrowIndex;
    document.getElementById('termsLabel').textContent = T.eyebrowLabel;
    document.getElementById('termsTitle').textContent = T.title;
    document.getElementById('priceLabel').textContent = T.price.label;
    document.getElementById('priceValue').textContent = T.price.value;
    document.getElementById('priceUnit').textContent = T.price.unit;
    document.getElementById('priceNote').textContent = T.price.note;
    document.getElementById('termsList').innerHTML = T.rows.map((r) =>
      `<div><dt>${r.label}</dt><dd>${r.text}</dd></div>`
    ).join('');
  }

  function renderContact() {
    document.getElementById('contactIndex').textContent = C.contact.eyebrowIndex;
    document.getElementById('contactLabel').textContent = C.contact.eyebrowLabel;
    document.getElementById('contactTitle').textContent = C.contact.title;
    document.getElementById('contactSubtitle').textContent = C.contact.subtitle;
    const actions = document.getElementById('contactActions');
    actions.innerHTML = contactActionsHTML(C.contact);
    bindCopyButton(actions, C.contact);
    document.getElementById('contactSocial').innerHTML =
      `<span class="contact__social-label">${C.contact.socialsLabel}</span>` +
      C.contact.socials.map((s) =>
        `<a href="${s.href}" target="_blank" rel="noopener" data-cursor-label="ОТКРЫТЬ">${s.label}</a>`
      ).join('');
  }

  function renderFooter() {
    document.getElementById('footerCopyright').textContent = C.footer.copyright;
    document.getElementById('footerCredit').innerHTML =
      C.footer.credit.replace(/@\S+/, `<a href="${C.footer.creditHref}" target="_blank" rel="noopener">$&</a>`);
  }

  renderMeta();
  renderNav();
  renderHero();
  renderStrip();
  renderWork();
  renderAbout();
  renderTerms();
  renderContact();
  renderFooter();
  setupNavCurrent();

  // CDN с GSAP/Lenis не загрузился: показываем контент без анимаций, а не пустой прелоадер
  if (!window.gsap || !window.ScrollTrigger) {
    showWithoutMotion();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  if (prefersReducedMotion) gsap.globalTimeline.timeScale(50);

  // ---- Lenis + GSAP ticker sync ----
  if (!prefersReducedMotion && window.Lenis) {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // ---- preloader: mark + thin fill line, no text ----
  const preloader = document.getElementById('preloader');
  document.getElementById('preloaderMark').innerHTML = window.BRAND_MARK_SVG;

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

  gsap.to('#preloaderFill', {
    width: '100%',
    duration: prefersReducedMotion ? 0.1 : 0.9,
    ease: 'power1.inOut',
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
      .fromTo('#heroReel', { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 0.8, ease: 'power3.out' }, '-=0.45')
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
      document.body.classList.add('has-cursor');
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
