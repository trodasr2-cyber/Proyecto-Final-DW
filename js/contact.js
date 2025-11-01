document.addEventListener('DOMContentLoaded', () => {
  const f1 = window._f1 || {};
  const { auth, db } = f1;
  if (!db) {
    console.error('[contact] Firestore no disponible.');
    return;
  }

  const byIds = (ids) => ids.map(id => document.getElementById(id)).find(Boolean) || null;

  const form  = byIds(['contact-form', 'c-form']);
  const nameI = byIds(['contact-name', 'c-name']);
  const mailI = byIds(['contact-email', 'c-email']);
  const msgI  = byIds(['contact-text', 'c-msg']);
  const help  = byIds(['contact-msg', 'c-help']);  
  const sendB = byIds(['contact-send', 'c-send']);

  if (!form || !nameI || !mailI || !msgI || !sendB) {
    console.warn('[contact] Faltan elementos del formulario en el DOM.');
    return;
  }

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
  const NAME_RE  = /^[a-zA-ZÀ-ÿ'´`.\- ]{3,60}$/; 

  function setHelp(ok, text) {
    if (!help) return;
    help.textContent = text || '';
    help.style.color = ok ? '#00ff6a' : '#ff3b30';
  }
  function setValid(el, ok) {
    if (!el) return;
    el.classList.toggle('is-invalid', !ok);
    el.classList.toggle('is-valid', ok);
  }

  function validate() {
    const name = (nameI.value || '').trim();
    const mail = (mailI.value || '').trim();
    const msg  = (msgI.value  || '').trim();

    if (!NAME_RE.test(name)) {
      setValid(nameI, false);
      setHelp(false, 'Ingresa un nombre válido (3–60 caracteres).');
      return null;
    } else setValid(nameI, true);

    if (!EMAIL_RE.test(mail)) {
      setValid(mailI, false);
      setHelp(false, 'Ingresa un correo válido.');
      return null;
    } else setValid(mailI, true);

    if (msg.length < 10 || msg.length > 2000) {
      setValid(msgI, false);
      setHelp(false, 'El mensaje debe tener entre 10 y 2000 caracteres.');
      return null;
    } else setValid(msgI, true);

    return { name, mail, msg };
  }

  const LAST_KEY = 'contact_last_sent';
  function canSendNow() {
    const last = Number(localStorage.getItem(LAST_KEY) || 0);
    return Date.now() - last > 30_000;
  }
  function markSent() {
    localStorage.setItem(LAST_KEY, String(Date.now()));
  }

  if (form.dataset.bound === '1') return;
  form.dataset.bound = '1';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!canSendNow()) {
      setHelp(false, 'Espera unos segundos antes de enviar otro mensaje.');
      return;
    }

    const data = validate();
    if (!data) return;

    sendB.disabled = true;
    const prevText = sendB.textContent;
    sendB.textContent = 'Enviando…';

    try {
      const user = auth?.currentUser || null;

      await db.collection('contacts').add({
        name: data.name,
        email: data.mail,
        message: data.msg,
        uid: user ? user.uid : null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        path: location.pathname,
        userAgent: navigator.userAgent
      });

      setHelp(true, '¡Mensaje enviado!');
      form.reset();
      [nameI, mailI, msgI].forEach(el => {
        el.classList.remove('is-valid');
        el.classList.remove('is-invalid');
      });
      markSent();
    } catch (err) {
      console.error('[contact] error:', err);
      setHelp(false, 'Ocurrió un error al enviar. Intenta de nuevo.');
    } finally {
      sendB.disabled = false;
      sendB.textContent = prevText || 'Enviar';
    }
  });
});
