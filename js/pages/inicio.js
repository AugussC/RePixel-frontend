import {
    subirImagen,
    getImageUrl,
    obtener_tipoImagen,
    procesarImagen,
    getProcesamientoUrl,
    getDescargaUrl
} from "../api/image_api.js";

import { initCanvas } from "../utils/image_canva.js";
import { validarArchivo, mapearFormatosUploader } from "../utils/validaciones.js";
import { mostrarEstado } from "../utils/mostrar_estado.js"; 
import { mutarInterfazModoEdicion } from "../utils/reiniciar_editor.js"; 

document.addEventListener("DOMContentLoaded", () => {

    let currentImageId = null;
    let tiposPermitidos = [];
    let imagenOriginalUrl = null;
    let currentProcesamientoId = null;

    // Elementos del DOM clave
    const fileInput = document.getElementById("fileInput");
    const textoTipos = document.getElementById("tipos-texto");
    const bloqueInicial = document.getElementById("bloque-inicial");
    const editorSection = document.getElementById("editor-section");

    // Inicialización de Canvas
    const { original: canvasOriginal, result: canvasResultado } = initCanvas({
        original: { canvasId: "canvas-original", viewerId: "viewer-original", zoomSliderId: "zoom-original" },
        result: { canvasId: "canvas-resultado", viewerId: "viewer-resultado", zoomSliderId: "zoom-resultado" }
    });

    // ── CONFIGURACIÓN INICIAL ──────────────────────────────────────────
    async function inicializarConfiguracion() {
        try {
            tiposPermitidos = await obtener_tipoImagen();
            const { extensiones, textoInformativo } = mapearFormatosUploader(tiposPermitidos);
            
            fileInput.setAttribute("accept", extensiones);
            textoTipos.innerText = textoInformativo;
        } catch (err) {
            console.error("Error al obtener tipos de imagen:", err);
        }
    }

    // ── PROCESAMIENTO DE ACCIONES ──────────────────────────────────────
    async function ejecutarProceso(algoritmo) {
        if (!currentImageId) {
            mostrarEstado("Primero sube una imagen");
            return;
        }

        mostrarEstado("Procesando imagen...", true);

        try {
            const { status, data } = await procesarImagen(currentImageId, algoritmo);
            const idProcesamiento = data.id_procesamiento;
            currentProcesamientoId = idProcesamiento;
            if (status === 200 && idProcesamiento) {
                mutarInterfazModoEdicion(true); // Oculta barra lateral, expande visor a 100%
                const resultadoUrl = getProcesamientoUrl(idProcesamiento);

                requestAnimationFrame(() => {
                    setTimeout(async () => {
                        try {
                            await canvasResultado.mostrarImagen(resultadoUrl);
                            mostrarEstado("Proceso completado ✓");
                        } catch (canvasErr) {
                            console.error("Error al renderizar en el canvas:", canvasErr);
                            mostrarEstado("Error al mostrar el resultado.");
                        }
                    }, 100);
                });

            } else {
                mostrarEstado(data.error || "Error al procesar");
            }
        } catch (error) {
            console.error("Error en la petición de procesamiento:", error);
            mostrarEstado("Error al procesar");
        }
    }

    // ── ESCUCHADORES DE EVENTOS (LISTENERS) ────────────────────────────
    fileInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        fileInput.value = "";
 
        if (!validarArchivo(file, tiposPermitidos)) {
            mostrarEstado("Tipo de archivo no permitido");
            return;
        }
        
        mutarInterfazModoEdicion(false);

        const { status, data } = await subirImagen(file);
        if (status === 200) {
            currentImageId = data.id;
            imagenOriginalUrl = getImageUrl(currentImageId);
 
            await canvasOriginal.mostrarImagen(imagenOriginalUrl);
            canvasResultado.limpiar();
            
            bloqueInicial.style.display = "none";
            editorSection.style.display = "flex"; 
        } else {
            mostrarEstado(data.error || "Error al subir imagen");
        }
    });

    document.getElementById("btnNuevaImagen").addEventListener("click", () => {
        mutarInterfazModoEdicion(false);
        fileInput.click();
    });

    document.getElementById("btnReiniciar")?.addEventListener("click", () => {
        mutarInterfazModoEdicion(false);
        canvasOriginal.resetVista();
        canvasResultado.limpiar();
    });
    
    document.getElementById("btnDescargar")?.addEventListener("click", async () => {
    if (!currentProcesamientoId ) return;

        const res = await fetch(getDescargaUrl(currentProcesamientoId ), { credentials: "include" });
        if (!res.ok) return alert("Error al descargar la imagen");

        const blob = await res.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "repixel_resultado.png";
        link.click();
        URL.revokeObjectURL(link.href);
    });
    

    // Mapeo dinámico de algoritmos
    const botonesAlgoritmos = {
        "btnMejorar": "enfocar",
        "btnBrillo": "ajustar brillo",
        "btnQuitarRuido": "quitar ruido",
        "btnBlancoyNegro": "blanco y negro",
        "btnRestaurar": "restaurar imagen"
    };

    Object.entries(botonesAlgoritmos).forEach(([id, algoritmo]) => {
        document.getElementById(id)?.addEventListener("click", () => ejecutarProceso(algoritmo));
    });

    // ── DEEP LINKING / URL ROUTING ─────────────────────────────────────
    async function verificarImagenDesdeURL() {
        const params = new URLSearchParams(window.location.search);
        const idDesdeUrl = params.get("id");

        if (idDesdeUrl) {
            try {
                currentImageId = idDesdeUrl;
                imagenOriginalUrl = getImageUrl(currentImageId);

                mutarInterfazModoEdicion(false);
                await canvasOriginal.mostrarImagen(imagenOriginalUrl);
                canvasResultado.limpiar();

                bloqueInicial.style.display = "none";
                editorSection.style.display = "flex";
                
                window.history.replaceState({}, document.title, window.location.pathname);
            } catch (err) {
                console.error("Error al cargar imagen de la URL:", err);
                mostrarEstado("Error al recuperar la imagen seleccionada.");
            }
        }
    }

    // Inicializar flujos
    inicializarConfiguracion();
    verificarImagenDesdeURL();
});