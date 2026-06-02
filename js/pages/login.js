import { loginUsuario } from "../api/auth_api.js";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm") || document.querySelector("form");
    const globalError = document.getElementById("globalError");
    const errorCorreo = document.getElementById("errorCorreo");
    const errorContraseña = document.getElementById("errorContraseña");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Limpiar errores previos
        if (globalError) {
            globalError.classList.add("d-none");
            globalError.innerText = "";
        }
        if (errorCorreo) errorCorreo.innerText = "";
        if (errorContraseña) errorContraseña.innerText = "";

        const correo = form.querySelector('input[type="email"]').value.trim();
        const contraseña = form.querySelector('input[type="password"]').value;

        // Validaciones de frontend básicas
        let tieneErrores = false;
        if (!correo) {
            if (errorCorreo) errorCorreo.innerText = "El correo electrónico es requerido.";
            tieneErrores = true;
        }
        if (!contraseña) {
            if (errorContraseña) errorContraseña.innerText = "La contraseña es requerida.";
            tieneErrores = true;
        }

        if (tieneErrores) return;

        const { status, data } = await loginUsuario({ correo, contraseña });

        if (status === 200) {
            window.location.href = "/pages/inicio.html";
        } else {
            // Mostrar error integrado de manera elegante
            if (globalError) {
                globalError.innerText = data.error || "Credenciales incorrectas o error en el servidor.";
                globalError.classList.remove("d-none");
            }
        }
    });
});