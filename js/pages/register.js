import { validarRegistro } from "../utils/register.js";
import { registrarUsuario } from "../api/auth_api.js";

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("registerForm");
    const globalError = document.getElementById("globalError");

    const errorFields = {
        nombre: document.getElementById("errorNombre"),
        apellido: document.getElementById("errorApellido"),
        correo: document.getElementById("errorCorreo"),
        contraseña: document.getElementById("errorContraseña"),
        confirmarContraseña: document.getElementById("errorConfirmarContraseña")
    };

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // 1. Limpiar todos los mensajes de error anteriores
        if (globalError) {
            globalError.classList.add("d-none");
            globalError.innerText = "";
        }
        Object.values(errorFields).forEach(el => {
            if (el) el.innerText = "";
        });

        const datos = {
            nombre: form.nombre.value.trim(),
            apellido: form.apellido.value.trim(),
            correo: form.correo.value.trim(),
            contraseña: form.contraseña.value,
            confirmarContraseña: form.confirmarContraseña.value
        };

        // 2. Ejecutar validación del frontend
        const errores = validarRegistro(datos);

        if (Object.keys(errores).length > 0) {
            // Mostrar los errores en cada campo correspondiente
            Object.entries(errores).forEach(([campo, mensaje]) => {
                if (errorFields[campo]) {
                    errorFields[campo].innerText = mensaje;
                }
            });
            return;
        }

        // 3. Petición de registro al servidor
        const { status, data } = await registrarUsuario({
            ...datos,
            rol: 2
        });

        if (status === 201) {
            window.location.href = "/pages/login.html";
        } else {
            // Mostrar error del servidor (por ejemplo, correo duplicado) de forma integrada
            if (globalError) {
                globalError.innerText = data.error || "No se pudo crear la cuenta. Inténtalo de nuevo.";
                globalError.classList.remove("d-none");
            }
        }
    });
});