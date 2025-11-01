/********************************************
 * Registro de usuario con Firebase Auth
 * Proyecto: F1FanZone
 ********************************************/

function registrar() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('contrasena').value.trim();
  const mensaje = document.getElementById('mensaje');

  // Limpia mensajes anteriores
  mensaje.textContent = "";

  // Validaciones básicas antes de enviar a Firebase
  if (!email || !password) {
    mensaje.textContent = "Por favor completa ambos campos.";
    return;
  }
  if (password.length < 6) {
    mensaje.textContent = "La contraseña debe tener al menos 6 caracteres.";
    return;
  }

  console.log("[auth] Intentando crear usuario con:", email);

  // Crear usuario en Firebase Auth
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("[auth] Usuario creado correctamente:", user);
      mensaje.style.color = "#00ff6a";
      mensaje.textContent = "✅ Usuario registrado: " + user.email;


    })
    .catch((error) => {
      console.error("[auth] Error al registrar:", error.code, error.message);
      mensaje.style.color = "#ff3b30";
      mensaje.textContent = "❌ Error: " + error.message;
    });
}

// Detectar cuando el formulario se envía 
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-registro');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      registrar();
    });
  }
});
