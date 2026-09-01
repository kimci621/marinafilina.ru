/* Awwwards-portfolio (Aicher/Ulm-system direction) — Марина Филина / WithArt.
   Весь контент рендерится из content.js (window.SITE_CONTENT), в HTML — только каркас.
   Grid-calibration preloader, Lenis+GSAP scroll, drafting-crosshair cursor, scroll reveals. */

document.addEventListener('DOMContentLoaded', () => {
  const C = window.SITE_CONTENT;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const pad = (n) => String(n).padStart(2, '0');

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
    }).join('') + (projects.length % 2 === 1 ? '<div class="project-card__spacer" aria-hidden="true"></div>' : '');
    grid.querySelectorAll('img[data-fallback]').forEach(attachPhotoFallback);
    grid.querySelectorAll('.project-card').forEach((card, i) => setupCoverCycle(card, projects[i]));
  }

  // ---- project cards: cycle 3 covers every 5s with a right-to-left pixelation wipe, pausing on hover ----
  const PIXEL_COLS = 8;
  const PIXEL_ROWS = 5;

  function setupCoverCycle(card, project) {
    const covers = project.covers;
    if (!covers || covers.length < 2) return;
    const imageBox = card.querySelector('.project-card__image');
    const img = card.querySelector('.project-card__photo');

    const pixelate = document.createElement('div');
    pixelate.className = 'project-card__pixelate';
    for (let r = 0; r < PIXEL_ROWS; r++) {
      for (let c = 0; c < PIXEL_COLS; c++) {
        const cell = document.createElement('span');
        const t = c / (PIXEL_COLS - 1);
        cell.style.background = `hsl(60 4% ${96 - t * 8}%)`;
        pixelate.appendChild(cell);
      }
    }
    imageBox.appendChild(pixelate);
    const cells = pixelate.children;

    let index = 0;
    let hovered = false;
    let timer = null;
    const schedule = () => { timer = setTimeout(tick, 5000); };

    function tick() {
      if (hovered) { schedule(); return; }
      const next = (index + 1) % covers.length;
      gsap.timeline({ onComplete: schedule })
        .to(cells, {
          opacity: 1,
          duration: 0.35,
          ease: 'power1.inOut',
          stagger: { each: 0.03, from: 'end', grid: [PIXEL_ROWS, PIXEL_COLS], axis: 'x' },
        })
        .call(() => { img.src = covers[next]; index = next; })
        .to(cells, {
          opacity: 0,
          duration: 0.35,
          ease: 'power1.inOut',
          stagger: { each: 0.03, from: 'end', grid: [PIXEL_ROWS, PIXEL_COLS], axis: 'x' },
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

    document.getElementById('aboutIntroTitle').textContent = A.intro.title;
    document.getElementById('aboutIntroList').innerHTML = A.intro.items.map((item, i) =>
      `<li><span>${pad(i + 1)}</span>${item}</li>`
    ).join('');

    document.getElementById('aboutMark').innerHTML = window.BRAND_MARK_SVG;
    document.getElementById('aboutName').textContent = A.profile.name;
    document.getElementById('aboutRole').textContent = A.profile.role;
    document.getElementById('aboutAgenciesLabel').textContent = A.profile.agenciesLabel;
    document.getElementById('aboutAgencies').innerHTML = A.profile.agencies.map((a) =>
      `<li><strong>${a.name}</strong><span>${a.years}</span></li>`
    ).join('');
    document.getElementById('aboutAgenciesNote').textContent = A.profile.agenciesNote;

    document.getElementById('processList').innerHTML = A.steps.map((s, i) => `
      <li data-reveal>
        <span class="process__num">${pad(i + 1)}</span>
        <div><p class="process__action">${s.action}</p><p class="process__result">${s.result}</p></div>
      </li>`).join('');

    document.getElementById('formatLabel').textContent = A.format.label;
    document.getElementById('formatTitle').textContent = A.format.title;
    document.getElementById('formatText').textContent = A.format.text;

    document.getElementById('comboTitle').textContent = A.combo.title;
    document.getElementById('comboParagraphs').innerHTML = A.combo.paragraphs.map((p) => `<p>${p}</p>`).join('');

    document.getElementById('notDoingTitle').textContent = A.notDoing.title;
    document.getElementById('notDoingIntro').textContent = A.notDoing.intro;
    document.getElementById('notDoingItems').innerHTML = A.notDoing.items.map((item) =>
      `<div data-reveal><h4>${item.title}</h4><p>${item.text}</p></div>`
    ).join('');

    document.getElementById('priceLabel').textContent = A.price.label;
    document.getElementById('priceValue').textContent = A.price.value;
    document.getElementById('priceNote').textContent = A.price.note;
  }

  function renderContact() {
    document.getElementById('contactIndex').textContent = C.contact.eyebrowIndex;
    document.getElementById('contactLabel').textContent = C.contact.eyebrowLabel;
    document.getElementById('contactTitle').textContent = C.contact.title;
    document.getElementById('contactSubtitle').textContent = C.contact.subtitle;
    const emailLink = document.getElementById('contactEmail');
    emailLink.href = `mailto:${C.contact.email}`;
    emailLink.textContent = C.contact.email;
    const phoneLink = document.getElementById('contactPhone');
    phoneLink.href = `tel:${C.contact.phone.replace(/[^\d+]/g, '')}`;
    phoneLink.textContent = C.contact.phone;
    const social = document.getElementById('contactSocial');
    social.innerHTML = C.contact.socials.map((s) =>
      `<a href="${s.href}" data-cursor-label="ОТКРЫТЬ">${s.label}<span class="social__handle">${s.handle}</span></a>`
    ).join('');
  }

  function renderFooter() {
    document.getElementById('footerCopyright').textContent = C.footer.copyright;
    document.getElementById('footerCredit').textContent = C.footer.credit;
  }

  renderMeta();
  renderNav();
  renderHero();
  renderStrip();
  renderWork();
  renderAbout();
  renderContact();
  renderFooter();

  gsap.registerPlugin(ScrollTrigger);
  if (prefersReducedMotion) gsap.globalTimeline.timeScale(50);

  // ---- Lenis + GSAP ticker sync ----
  if (!prefersReducedMotion) {
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
