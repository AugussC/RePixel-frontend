import { obtenerUsuarioLogueado } from "../api/auth_api.js";
import { obtenerImagenesUsuario, deshabilitarImagen } from "../api/image_api.js";
import { crearFilaImagen, mostrarMensajeVacio } from "../utils/galeria_generarFila.js";

document.addEventListener("DOMContentLoaded", async () => {
    const galleryContainer = document.getElementById("gallery-container");
    if (!galleryContainer) return;

    // 1. CARGA INICIAL DE DATOS Y RENDERIZADO
    try {
        const user = await obtenerUsuarioLogueado();
        const images = await obtenerImagenesUsuario(user.id);

        galleryContainer.innerHTML = "";

        if (images.length === 0) {
            mostrarMensajeVacio(galleryContainer);
            return;
        }

        images.forEach(img => {
            const fila = crearFilaImagen(img);
            galleryContainer.appendChild(fila);
        });

    } catch (error) {
        console.error("Error cargando galería:", error);
    }

    // 2. DELEGACIÓN DE EVENTOS PARA ELIMINAR
    galleryContainer.addEventListener("click", async (e) => {
        // Comprobamos si el elemento clickeado (o su padre directo) es el botón de cierre
        const botonCerrar = e.target.closest(".btn-close");
        if (!botonCerrar) return; 

        const imageId = botonCerrar.dataset.id;
        const filaElemento = botonCerrar.closest(".file-row");

        try {
            console.log("Intentando eliminar imagen:", imageId);
            await deshabilitarImagen(imageId);
            
            // Animación o remoción directa del DOM
            filaElemento.remove();

            // Si ya no quedan elementos en la lista, mostrar mensaje de vacío
            if (galleryContainer.children.length === 0) {
                mostrarMensajeVacio(galleryContainer);
            }
        } catch (error) {
            console.error("Error eliminando imagen:", error);
        }
    });
});