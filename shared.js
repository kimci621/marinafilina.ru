/* Общие куски для главной и страницы кейса: блок контактов и запасной показ без анимаций. */
window.SITE_SHARED = {
  // почта крупно + «Скопировать», вторая строка: Telegram и телефон
  contactActionsHTML(c) {
    return `
      <div class="contact__email-row">
        <a href="mailto:${c.email}" class="contact__link" data-cursor-label="ПИСЬМО">${c.email}</a>
        <button type="button" class="btn-outline contact__copy" aria-live="polite">${c.copyLabel}</button>
      </div>
      <p class="contact__alt">
        <a href="${c.telegram.href}" target="_blank" rel="noopener" data-cursor-label="TELEGRAM">Telegram ${c.telegram.handle}</a>
        <a href="tel:${c.phone.replace(/[^\d+]/g, '')}">${c.phone}</a>
      </p>`;
  },

  bindCopyButton(root, c) {
    const btn = root.querySelector('.contact__copy');
    let timer;
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(c.email).then(() => {
        btn.textContent = c.copiedLabel;
        clearTimeout(timer);
        timer = setTimeout(() => { btn.textContent = c.copyLabel; }, 2000);
      }, () => { location.href = `mailto:${c.email}`; });
    });
  },

  // GSAP/Lenis с CDN не пришли: убираем прелоадер, курсор и показываем все reveal-блоки
  showWithoutMotion() {
    ['preloader', 'cursorV', 'cursorH', 'cursorLabel'].forEach((id) => document.getElementById(id)?.remove());
    document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
  },
};
