document.addEventListener('DOMContentLoaded', () => {
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  document.body.classList.add('is-loaded');

  const transition = document.createElement('div');
  transition.className = 'wormhole-transition';
  transition.setAttribute('aria-hidden', 'true');
  document.body.appendChild(transition);

  document.addEventListener('click', (event) => {
    const flash = document.createElement('span');
    flash.className = 'click-flash';
    flash.style.setProperty('--x', `${event.clientX}px`);
    flash.style.setProperty('--y', `${event.clientY}px`);
    document.body.appendChild(flash);
    window.setTimeout(() => flash.remove(), 700);
  });

  const isModifiedClick = (event) => event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;

  document.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (isModifiedClick(event)) return;
      if (link.target && link.target !== '_self') return;
      const rawHref = link.getAttribute('href');
      if (!rawHref || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:') || rawHref.startsWith('javascript:')) return;

      const url = new URL(link.href, window.location.href);
      const current = new URL(window.location.href);

      const samePageHash = url.origin === current.origin && url.pathname === current.pathname && url.search === current.search && url.hash;
      if (samePageHash) return;

      const sameOrigin = url.origin === current.origin;
      if (!sameOrigin) return;

      event.preventDefault();
      document.body.classList.add('transition-out');
      window.setTimeout(() => {
        window.location.href = url.href;
      }, 820);
    });
  });
});
