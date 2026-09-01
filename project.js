/* Страница кейса: читает slug из URL, рендерит контент проекта из content.js. */

document.addEventListener('DOMContentLoaded', () => {
  const C = window.SITE_CONTENT;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const pad = (n) => String(n).padStart(2, '0');

  const slug = new URLSearchParams(location.search).get('slug');
  const projects = C.work.projects;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    location.replace('index.html#work');
    return;
  }

  function attachPhotoFallback(img) {
    img.addEventListener('error', () => { img.style.display = 'none'; }, { once: true });
  }

  function renderMeta() {
    const title = `${project.title} — ${C.brand.name}`;
    const url = `https://marinafilina.ru/project.html?slug=${project.slug}`;
    document.title = title;
    const setMeta = (selector, value) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute('content', value);
    };
    setMeta('meta[name="description"]', project.cardDescription);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', project.cardDescription);
    setMeta('meta[property="og:url"]', url);
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', url);
  }

  function renderNav() {
    const logo = document.getElementById('navLogo');
    logo.innerHTML = `${window.BRAND_MARK_SVG}<span>${C.brand.name}</span>`;
    const links = document.getElementById('navLinks');
    links.innerHTML = C.nav.links.map((l) =>
      `<a href="index.html${l.href}" class="${l.cta ? 'nav__cta' : ''}" data-cursor-label="${l.cursorLabel}">${l.label}</a>`
    ).join('');
  }

  function renderHero() {
    document.getElementById('projectIndex').textContent = project.index;
    const title = document.getElementById('projectTitle');
    title.innerHTML = project.title.split(' ').map((w) => `<span>${w}</span>`).join(' ');
    document.getElementById('projectSubtitle').textContent = project.subtitle;
    document.getElementById('projectServices').innerHTML =
      project.services.map((s) => `<span>${s}</span>`).join('');
  }

  function renderGallery() {
    const gallery = document.getElementById('projectGallery');
    gallery.innerHTML = project.photos.map((photo, i) => `
      <figure class="project-card__image project-card__image--${project.color} ${i === 0 ? 'is-wide' : ''}" data-reveal>
        <picture>
          ${photo.mobile ? `<source media="(max-width: 720px)" srcset="${photo.mobile}">` : ''}
          <img class="project-card__photo" data-fallback src="${photo.src}" alt="${project.title} — фото ${i + 1}" loading="lazy">
        </picture>
        <span class="project-card__index">${pad(i + 1)}</span>
      </figure>`).join('');
    gallery.querySelectorAll('img[data-fallback]').forEach(attachPhotoFallback);
  }

  function renderDescription() {
    document.getElementById('projectDescription').textContent = project.description;
  }

  function renderNext() {
    const others = projects.filter((p) => p.slug !== project.slug);
    const next = [others[0], others[1]].filter(Boolean);
    document.getElementById('projectNext').innerHTML = next.map((p) => `
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
      </article>`).join('');
    document.getElementById('projectNext').querySelectorAll('img[data-fallback]').forEach(attachPhotoFallback);
  }

  function renderFooter() {
    document.getElementById('footerCopyright').textContent = C.footer.copyright;
    document.getElementById('footerCredit').textContent = C.footer.credit;
  }

  renderMeta();
  renderNav();
  renderHero();
  renderGallery();
  renderDescription();
  renderNext();
  renderFooter();

  gsap.registerPlugin(ScrollTrigger);
  if (prefersReducedMotion) gsap.globalTimeline.timeScale(50);

  if (!prefersReducedMotion) {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // ---- entrance: grid draws in, title wipes up, meta fades ----
  const gridSpans = document.querySelectorAll('#projectGrid span');
  const titleWords = document.querySelectorAll('.project-hero__title span');
  gsap.set(gridSpans, { scaleY: 0 });
  gsap.set(titleWords, { yPercent: 110 });
  gsap.timeline()
    .to(gridSpans, { scaleY: 1, duration: 0.5, ease: 'power2.out', stagger: 0.025 })
    .to(titleWords, { yPercent: 0, duration: 0.6, ease: 'power3.out', stagger: 0.06 }, '-=0.25')
    .fromTo('.project-hero__back', { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0);

  // ---- custom cursor ----
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

  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 85%',
    onEnter: (batch) => batch.forEach((el) => el.classList.add('is-visible')),
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
});
