function registrar() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('contrasena').value.trim();
  const mensaje = document.getElementById('mensaje');

  mensaje.textContent = "";

  if (!email || !password) {
    mensaje.textContent = "Por favor completa ambos campos.";
    return;
  }
  if (password.length < 6) {
    mensaje.textContent = "La contraseña debe tener al menos 6 caracteres.";
    return;
  }

  console.log("[auth] Intentando crear usuario con:", email);

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

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-registro');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      registrar();
    });
  }
});
