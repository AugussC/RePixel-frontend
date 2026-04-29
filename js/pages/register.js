import { validarRegistro } from "../utils/validaciones.js";
import { registrarUsuario } from "../api/auth_api.js";

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("registerForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const datos = {
            nombre: form.nombre.value,
            apellido: form.apellido.value,
            correo: form.correo.value,
            contraseña: form.contraseña.value,
            confirmarContraseña: form.confirmarContraseña.value
        };

        const errores = validarRegistro(datos);

        if (Object.keys(errores).length > 0) {
            alert("Hay errores en el formulario");
            return;
        }

        const { status } = await registrarUsuario({
            ...datos,
            rol: 2
        });

        if (status === 201) {
            window.location.href = "/pages/login.html";
        }
    });
});