import { loginUsuario } from "../api/auth_api.js";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const correo = form.querySelector('input[type="email"]').value;
        const contraseña = form.querySelector('input[type="password"]').value;

        const { status, data } = await loginUsuario({ correo, contraseña });

        if (status === 200) {
            window.location.href = "/pages/inicio.html";
        } else {
            alert(data.error || "Error");
        }
    });
});