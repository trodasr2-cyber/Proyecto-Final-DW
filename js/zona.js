/* global firebase */
document.addEventListener('DOMContentLoaded', () => {
  const { auth, db } = window._f1;
  const $ = (id) => document.getElementById(id);

  const input = $('pred-input');
  const btn   = $('pred-btn');
  const msg   = $('pred-msg');

  const card     = $('pred-actual');
  const predImg  = $('pred-img');
  const predName = $('pred-name');

  const IMG = {
    'Oscar Piastri': 'img/pilotos/piastri.png',
    'Lando Norris': 'img/pilotos/lando.png',
    'George Russell': 'img/pilotos/russell.png',
    'Kimi Antonelli': 'img/pilotos/antonelli.png',
    'Charles Lecrerc': 'img/pilotos/lecrerc.png',
    'Lewis Hamilton': 'img/pilotos/hamilton.png',
    'Max Verstappen': 'img/pilotos/verstappen.png',
    'Yuki Tsunoda': 'img/pilotos/tsunoda.png',
    'Alexander Albon': 'img/pilotos/albon.png',
    'Carlos Sainz': 'img/pilotos/sainz.png',
    'Liam Lawson': 'img/pilotos/lawson.png',
    'Isack Hadjar': 'img/pilotos/hadjr.png',
    'Lance Stroll': 'img/pilotos/stroll.png',
    'Fernando Alonso': 'img/pilotos/alonso.png',
    'Nico Hulkenberg': 'img/pilotos/nico.png',
    'Gabriel Bortoleto': 'img/pilotos/bortoleto.png',
    'Esteban Ocon': 'img/pilotos/ocon.png',
    'Oliver Bearman': 'img/pilotos/bearman.png',
    'Pierre Gasly': 'img/pilotos/gasly.png',
    'Franco Colapinto': 'img/pilotos/colapinto.png'
  };
  const VALID_NAMES = new Set(Object.keys(IMG));

  function renderPrediction(name) {
    if (!card) return;
    if (!name) {
      card.style.display = 'none';
      predName.textContent = '— sin definir —';
      predImg.removeAttribute('src');
      return;
    }
    predName.textContent = name;
    predImg.src  = IMG[name] || 'img/pilotos/placeholder.png';
    predImg.alt  = `Foto de ${name}`;
    card.style.display = 'grid';
  }

  // Limpia UI
  function resetUI() {
    if (input) input.value = '';           // <- YA NO mostramos la predicción en el input
    if (msg) { msg.textContent = ''; msg.removeAttribute('style'); }
    renderPrediction(null);
  }

  let unsub = null;
  function detach() { if (typeof unsub === 'function') { try { unsub(); } catch {} unsub = null; } }

  window.addEventListener('pageshow', (e) => { if (e.persisted) resetUI(); });

  auth.onAuthStateChanged(async (user) => {
    detach();
    resetUI();
    if (!user) return;

    const ref = db.collection('users').doc(user.uid);

    try {
      await ref.set({ createdAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
    } catch {}

    // CARGA INICIAL -> solo tarjeta, NO tocar el input
    try {
      const snap = await ref.get();
      const data = snap.exists ? (snap.data() || {}) : {};
      const pred = typeof data.prediccion === 'string' ? data.prediccion : '';
      renderPrediction(pred || null);
    } catch (e) { console.error('[zona] get:', e); }

    // TIEMPO REAL -> solo tarjeta, NO tocar el input
    unsub = ref.onSnapshot(
      (snap) => {
        const data = snap.exists ? (snap.data() || {}) : {};
        const pred = typeof data.prediccion === 'string' ? data.prediccion : '';
        renderPrediction(pred || null);
      },
      (err) => console.error('[zona] onSnapshot:', err)
    );
  });

  if (btn) {
    btn.addEventListener('click', async () => {
      const user = auth.currentUser;
      if (!user) return;

      const val = (input.value || '').trim();
      if (!val) {
        msg.textContent = 'Escribe un piloto.'; msg.style.color = '#ff3b30';
        return;
      }
      if (!VALID_NAMES.has(val)) {
        msg.textContent = 'Ese nombre no coincide con un piloto válido.'; msg.style.color = '#ff3b30';
        return;
      }

      try {
        await db.collection('users').doc(user.uid).set(
          { prediccion: val, updatedAt: firebase.firestore.FieldValue.serverTimestamp() },
          { merge: true }
        );

        // feedback
        msg.textContent = 'Predicción guardada ✅';
        msg.style.color = '#00ff6a';

        // Limpia y deja que onSnapshot refresque la tarjeta
        input.value = '';
        input.blur();

        // Oculta el mensaje luego de un momento
        setTimeout(() => { if (msg) msg.textContent = ''; }, 1800);
      } catch (e) {
        console.error('[zona] guardar:', e);
        msg.textContent = 'Error al guardar: ' + e.message;
        msg.style.color = '#ff3b30';
      }
    });
  }

  window.addEventListener('beforeunload', detach);
});
