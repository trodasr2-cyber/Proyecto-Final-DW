
document.addEventListener('DOMContentLoaded', () => {
  const curr = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__list a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === curr) a.setAttribute('aria-current', 'page');
  });

  // --- Favoritos por usuario (usa favoritos.js) ---
  const fav = window._fav; // expuesto por favoritos.js
  if (!fav) return;        // si favoritos.js no está cargado en esta página, salimos

  // En la página de Pilotos: botón de favorito por tarjeta
  document.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      await fav.toggle(btn.dataset.name); // alterna en Firestore por UID
    });
  });

  // Pinta el estado inicial de los botones según el usuario activo
  fav.paintButtons();

  // En la página "Mi Zona": montar la lista si existe el UL
  const listEl = document.getElementById('favoritos-list');
  if (listEl) fav.mountList('favoritos-list');
});