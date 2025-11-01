(function(){
  const { auth, db } = window._f1;

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

  let cache = [];
  let unsub = null;
  let listMount = null;

  function userDoc(){
    const uid = auth.currentUser?.uid;
    return uid ? db.collection('users').doc(uid) : null;
  }

  async function toggle(name){
    const ref = userDoc();
    if (!ref){
      location.href = 'login.html';
      return;
    }
    const isIn = cache.includes(name);
    const op   = isIn
      ? firebase.firestore.FieldValue.arrayRemove(name)
      : firebase.firestore.FieldValue.arrayUnion(name);

    try {
      await ref.set({ favorites: op }, { merge: true });
  
    } catch (err) {
      console.error('[fav] error al guardar:', err);
    }
  }

  function paintButtons(){
    document.querySelectorAll('.fav-btn').forEach(btn => {
      const name = btn.dataset.name;
      const active = cache.includes(name);
      btn.classList.toggle('is-fav', active);
      btn.innerHTML = active ? '★ En favoritos' : '❤ Agregar a favoritos';
      btn.setAttribute('aria-pressed', String(active));
    });
  }

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
    }, err => {
      console.error('[fav] onSnapshot error:', err);
    });
  }

  auth.onAuthStateChanged(() => {
    if (unsub) { try { unsub(); } catch(_) {} unsub = null; }
    cache = [];
    paintButtons();
    if (listMount) listMount.render();
    if (auth.currentUser) watch();
  });

  window._fav = { toggle, paintButtons, mountList };

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.fav-btn');
    if (!btn) return;
    const name = btn.dataset.name;
    if (name) toggle(name);
  });
})();