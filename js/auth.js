/*************************************************
 * auth.js — Registro, Login, Logout y Protección
 * Requiere: firebase-app-compat.js y firebase-auth-compat.js
 **************************************************/

// --- Config app ---
  const firebaseConfig = {
    apiKey: "AIzaSyBPNqmImIuNBt_u2XsI17RazJnvWXwMjr4",
    authDomain: "f1fanzone-7ef68.firebaseapp.com",
    projectId: "f1fanzone-7ef68",
    storageBucket: "f1fanzone-7ef68.appspot.com",
    messagingSenderId: "936381404575",
    appId: "1:936381404575:web:ed3b08c7c42baf5c8519aa",
    measurementId: "G-CDDYWLR756"
  };

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db   = firebase.firestore();

//  Persistencia local (quedar logueado)
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(console.error);


// ====== Helpers ======
function inPage(name){ 
  const p = location.pathname.toLowerCase();
  return p.endsWith('/'+name) || p.endsWith(name);
}

function updateNav(user){
  const loginLink  = document.getElementById('nav-login');
  const regLink    = document.getElementById('nav-registro');
  const zonaLink   = document.getElementById('nav-zona');
  const logoutBtn  = document.getElementById('logout-btn');

  if (user){
    if (loginLink)  loginLink.style.display  = 'none';
    if (regLink)    regLink.style.display    = 'none';
    if (zonaLink)   zonaLink.style.display   = 'inline-block';
    if (logoutBtn)  logoutBtn.style.display  = 'inline-block';
  } else {
    if (loginLink)  loginLink.style.display  = 'inline-block';
    if (regLink)    regLink.style.display    = 'inline-block';
    if (zonaLink)   zonaLink.style.display   = 'inline-block';
    if (logoutBtn)  logoutBtn.style.display  = 'none';
  }
}

// ====== Observador global ======
auth.onAuthStateChanged((user) => {
  updateNav(user);

  const inLogin  = inPage('login.html');
  const inReg    = inPage('registro.html');
  const inZona   = inPage('zona.html');

  // Proteger zona
  if (inZona && !user){
    location.replace('login.html');
    return;
  }

  // Ya con sesión → manda a zona desde login/registro
  if ((inLogin || inReg) && user){
    location.replace('zona.html');
  }
});

// ====== Listeners de UI ======
document.addEventListener('DOMContentLoaded', () => {
  // Logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn){
    logoutBtn.addEventListener('click', async () => {
      await auth.signOut();
      location.replace('index.html');
    });
  }

  // LOGIN
  const loginForm = document.getElementById('login-form');
  if (loginForm){
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const pass  = document.getElementById('login-pass').value.trim();
      const msg   = document.getElementById('login-msg');
      try{
        await auth.signInWithEmailAndPassword(email, pass);
        // Fallback: redirige inmediato por si el onAuth tarda
        location.replace('zona.html');
      } catch(err){
        if (msg) msg.textContent = traducir(err.code, err.message);
      }
    });
  }

  // REGISTRO
  const regForm = document.getElementById('register-form');
  if (regForm){
    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('reg-email').value.trim();
      const pass  = document.getElementById('reg-pass').value.trim();
      const msg   = document.getElementById('reg-msg');
      try{
        await auth.createUserWithEmailAndPassword(email, pass);
        // Fallback: redirige inmediato
        location.replace('zona.html');
      } catch(err){
        if (msg) msg.textContent = traducir(err.code, err.message);
      }
    });
  }
});

function traducir(code, fallback){
  const map = {
    'auth/invalid-email':'Correo inválido.',
    'auth/missing-password':'Ingresa la contraseña.',
    'auth/weak-password':'La contraseña debe tener al menos 6 caracteres.',
    'auth/email-already-in-use':'Ese correo ya existe.',
    'auth/invalid-credential':'Credenciales incorrectas.',
    'auth/user-not-found':'Usuario no encontrado.',
    'auth/wrong-password':'Contraseña incorrecta.',
    'auth/too-many-requests':'Demasiados intentos, inténtalo luego.'
  };
  return map[code] || fallback || 'Ocurrió un error.';
}

// Export opcional
window._f1 = { auth, db };