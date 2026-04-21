import { enviarBoton } from "./api/api.js"
import { validarRegistro, registrarUsuario } from "./utils/register.js";
import { loginUsuario } from "./utils/login.js";
import { initCanvas } from './utils/image_canva.js';


export function initRegisterForm() {
    const form = document.getElementById("registerForm");

    const errorNombre = document.getElementById("errorNombre");
    const errorApellido = document.getElementById("errorApellido");
    const errorCorreo = document.getElementById("errorCorreo");
    const errorContraseña = document.getElementById("errorContraseña");
    const errorConfirmar = document.getElementById("errorConfirmarContraseña");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
    

        // Limpiar errores previos
        errorNombre.innerText = "";
        errorApellido.innerText = "";
        errorCorreo.innerText = "";
        errorContraseña.innerText = "";
        errorConfirmar.innerText = "";

        const nombre = document.getElementById("nombre").value.trim();
        const apellido = document.getElementById("apellido").value.trim();
        const correo = document.getElementById("correo").value.trim();
        const contraseña = document.getElementById("contraseña").value;
        const confirmarContraseña = document.getElementById("confirmarContraseña").value;
        const idRol = 2;

        // Validar y recibir todos los errores
        const errores = validarRegistro({ nombre, apellido, correo, contraseña, confirmarContraseña });

        // Mostrar los errores en los <small>
        if (errores.nombre) errorNombre.innerText = errores.nombre;
        if (errores.apellido) errorApellido.innerText = errores.apellido;
        if (errores.correo) errorCorreo.innerText = errores.correo;
        if (errores.contraseña) errorContraseña.innerText = errores.contraseña;
        if (errores.confirmarContraseña) errorConfirmar.innerText = errores.confirmarContraseña;

        // Si hay errores, no hacemos request
        if (Object.keys(errores).length > 0) return;

        // Enviar request al backend
         const { status, data } = await registrarUsuario({ nombre, apellido, correo, contraseña, rol: idRol });
        if (status === 201) {
            alert("Registro exitoso");
            window.location.href = "/pages/login.html";
        } else {
            alert(data.error || "Error en la conexión");
        }
    });
}

export function initLoginForm() {
    const form = document.querySelector("form");
    const inputCorreo = form.querySelector('input[type="email"]');
    const inputPassword = form.querySelector('input[type="password"]');

    // Crear spans para errores si no existen
    let errorCorreo = document.getElementById("errorCorreo");
    let errorContraseña = document.getElementById("errorContraseña");

    if (!errorCorreo) {
        errorCorreo = document.createElement("small");
        errorCorreo.id = "errorCorreo";
        errorCorreo.classList.add("text-danger");
        inputCorreo.after(errorCorreo);
    }

    if (!errorContraseña) {
        errorContraseña = document.createElement("small");
        errorContraseña.id = "errorContraseña";
        errorContraseña.classList.add("text-danger");
        inputPassword.after(errorContraseña);
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Limpiar errores
        errorCorreo.innerText = "";
        errorContraseña.innerText = "";

        const correo = inputCorreo.value.trim();
        const contraseña = inputPassword.value;

        if (!correo) {
            errorCorreo.innerText = "El correo es obligatorio";
            return;
        }
        if (!contraseña) {
            errorContraseña.innerText = "La contraseña es obligatoria";
            return;
        }

        // Enviar request
        const { status, data } = await loginUsuario({ correo, contraseña });

        if (status === 200) {
            // Login exitoso
            window.location.href = "/pages/inicio.html"; // redirigir a dashboard
        } else {
            // Mostrar error del backend
            const mensaje = data.error || "Error al iniciar sesión";
            errorCorreo.innerText = mensaje;
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar Canvas y obtener sus métodos
    const canvasUtils = initCanvas('canvas', 'zoom');
    
    const fileInput = document.getElementById('fileInput');
    const uploadBox = document.querySelector('.upload-box'); // El cuadro de subida
    const statusMessage = document.getElementById('status-message');
    const zoomSlider = document.getElementById('zoom');
    const viewer = document.getElementById('viewer');

    // --- Evento de Subida ---
    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        statusMessage.innerHTML = `<span class="text-primary">Subiendo...</span>`;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("http://127.0.0.1:5000/images", {
                method: "POST",
                body: formData,
                credentials: "include"
            });

            const data = await res.json();

            if (res.ok) {
                const id = data.id; 
                
                // 1. Mostrar imagen en canvas
                canvasUtils.mostrarImagen(`http://127.0.0.1:5000/images/${id}/view`);
                
                // 2. Ocultar el cuadro de subida y mostrar éxito
                uploadBox.style.display = 'none'; 
                statusMessage.innerHTML = `<span class="text-success">Imagen cargada. <button class="btn btn-sm btn-link" onclick="location.reload()">Subir otra</button></span>`;
            } else {
                statusMessage.innerHTML = `<span class="text-danger">Error: ${data.error}</span>`;
            }
        } catch (_err) {
            statusMessage.innerHTML = `<span class="text-danger">Error de conexión</span>`;
        }
    });

    // --- Eventos de Zoom (UI) ---
    zoomSlider.addEventListener('input', () => {
        canvasUtils.updateScale(parseFloat(zoomSlider.value));
    });

    viewer.addEventListener('wheel', (e) => {
        e.preventDefault();
        let currentScale = parseFloat(zoomSlider.value);
        currentScale += e.deltaY < 0 ? 0.2 : -0.2;
        currentScale = Math.min(Math.max(currentScale, 1), 11);
        
        zoomSlider.value = currentScale;
        canvasUtils.updateScale(currentScale);
    });
});

document.addEventListener("DOMContentLoaded", () => {

    const boton = document.getElementById("miBoton")
    const resultado = document.getElementById("resultado")

    boton.addEventListener("click", async () => {

        resultado.innerText = "Enviando..."

        const respuesta = await enviarBoton()

        if (respuesta.status === "ok") {
            resultado.innerText = "✅ Backend respondió OK"
        } else {
            resultado.innerText = "❌ Error en la conexión"
        }

    })

})  