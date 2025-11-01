document.addEventListener('DOMContentLoaded', () => {
  const curr = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__list a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === curr) a.setAttribute('aria-current', 'page');
  });

  const fav = window._fav; 
  if (!fav) return;       

  document.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      await fav.toggle(btn.dataset.name); 
    });
  });

  fav.paintButtons();

  const listEl = document.getElementById('favoritos-list');
  if (listEl) fav.mountList('favoritos-list');
});