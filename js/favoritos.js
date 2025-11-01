(function(){
  const { auth, db } = window._f1;

  // ===== Mapa Piloto → Imagen (ajusta rutas si difieren) =====
  const PILOTOS_IMG = {
    'Oscar Piastri':     'img/pilotos/piastri.png',
    'Lando Norris':      'img/pilotos/lando.png',
    'George Russell':    'img/pilotos/russell.png',
    'Kimi Antonelli':    'img/pilotos/antonelli.png',
    'Charles Lecrerc':   'img/pilotos/lecrerc.png',
    'Lewis Hamilton':    'img/pilotos/hamilton.png',
    'Max Verstappen':    'img/pilotos/verstappen.png',
    'Yuki Tsunoda':      'img/pilotos/tsunoda.png',
    'Alexander Albon':   'img/pilotos/albon.png',
    'Carlos Sainz':      'img/pilotos/sainz.png',
    'Liam Lawson':       'img/pilotos/lawson.png',
    'Isack Hadjar':      'img/pilotos/hadjr.png',
    'Lance Stroll':      'img/pilotos/stroll.png',
    'Fernando Alonso':   'img/pilotos/alonso.png',
    'Nico Hulkenberg':   'img/pilotos/nico.png',
    'Gabriel Bortoleto': 'img/pilotos/bortoleto.png',
    'Esteban Ocon':      'img/pilotos/ocon.png',
    'Oliver Bearman':    'img/pilotos/bearman.png',
    'Pierre Gasly':      'img/pilotos/gasly.png',
    'Franco Colapinto':  'img/pilotos/colapinto.png'
  };
  const PLACEHOLDER_IMG = 'img/pilotos/placeholder.png';
  const imgFor = (name) => PILOTOS_IMG[name] || PLACEHOLDER_IMG;

  // ===== Estado =====
  let cache = [];          // favoritos actuales (array de nombres)
  let unsub = null;        // listener a Firestore
  let listMount = null;    // {el, render} para Mi Zona

  // ===== Helpers =====
  function userDoc(){
    const uid = auth.currentUser?.uid;
    return uid ? db.collection('users').doc(uid) : null;
  }

  async function ensureDoc(){
    const ref = userDoc();
    if (!ref) return;
    // Crea doc si no existe
    await ref.set({ favorites: [] }, { merge: true });
  }

  // ===== API: alternar un favorito =====
  async function toggle(name){
    const ref = userDoc();
    if (!ref){
      // si no hay sesión, manda a login
      location.href = 'login.html';
      return;
    }
    await ensureDoc();
    const isIn = cache.includes(name);
    const op   = isIn
      ? firebase.firestore.FieldValue.arrayRemove(name)
      : firebase.firestore.FieldValue.arrayUnion(name);
    await ref.set({ favorites: op }, { merge: true });
    // No actualizamos cache aquí: onSnapshot lo hará
  }

  // ===== UI: pintar botones en pilotos.html =====
  function paintButtons(){
    document.querySelectorAll('.fav-btn').forEach(btn => {
      const name = btn.dataset.name;
      const active = cache.includes(name);
      btn.classList.toggle('is-fav', active);
      btn.innerHTML = active ? '★ En favoritos' : '❤ Agregar a favoritos';
      btn.setAttribute('aria-pressed', String(active));
    });
  }

  // ===== UI: montar lista (Mi Zona) =====
  function mountList(ulId){
    const el = document.getElementById(ulId);
    if (!el) return;

    listMount = {
      el,
      render(){
        const favs = cache.slice().sort();
        if (!favs.length){
          el.innerHTML = '<li class="fav-empty">No tienes favoritos aún.</li>';
          return;
        }
        el.innerHTML = favs.map(n => `
          <li class="fav-item">
            <img src="${imgFor(n)}" alt="${n}">
            <span>${n}</span>
          </li>
        `).join('');
      }
    };
    listMount.render();
  }

  // ===== Suscripción a cambios del usuario =====
  function watch(){
    if (unsub) { try { unsub(); } catch(_) {} unsub = null; }
    const ref = userDoc();
    if (!ref) { cache = []; paintButtons(); if (listMount) listMount.render(); return; }

    unsub = ref.onSnapshot(snap => {
      const data = snap.data() || {};
      const arr  = Array.isArray(data.favorites) ? data.favorites : [];
      cache = arr;
      paintButtons();
      if (listMount) listMount.render();
    });
  }

  // Cambios de sesión
  auth.onAuthStateChanged(() => {
    if (unsub) { try { unsub(); } catch(_) {} unsub = null; }
    cache = [];
    paintButtons();
    if (listMount) listMount.render();
    // si hay usuario, observa
    if (auth.currentUser) watch();
  });

  // ===== Exponer API a main.js =====
  window._fav = { toggle, paintButtons, mountList };

  // ===== Delegar clicks de botones (en Pilotos) =====
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.fav-btn');
    if (!btn) return;
    const name = btn.dataset.name;
    if (name) toggle(name);
  });
})();