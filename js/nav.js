// js/nav.js
(function () {
  const btn  = document.querySelector('.topbar__toggle');
  const menu = document.getElementById('mainmenu');
  if (!btn || !menu) return;

  // Abre/cierra menú
  const closeMenu = () => {
    menu.classList.remove('is-open');
    btn.classList.remove('is-active');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Abrir menú');
    document.body.classList.remove('nav-open');
  };

  const toggleMenu = () => {
    const open = menu.classList.toggle('is-open');
    btn.classList.toggle('is-active', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.classList.toggle('nav-open', open);
  };

  btn.addEventListener('click', toggleMenu);

  // Cerrar al navegar
  menu.addEventListener('click', e => {
    if (e.target.matches('a')) closeMenu();
  });

  // Cerrar al hacer click fuera
  document.addEventListener('click', e => {
    if (!menu.classList.contains('is-open')) return;
    if (!menu.contains(e.target) && !btn.contains(e.target)) closeMenu();
  });

  // Cerrar con ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  // Reset al pasar a desktop
  const mq = window.matchMedia('(min-width:981px)');
  const onChange = () => closeMenu();
  mq.addEventListener ? mq.addEventListener('change', onChange)
                      : mq.addListener(onChange);
})();


