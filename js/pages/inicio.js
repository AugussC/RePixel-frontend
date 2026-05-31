import {
    subirImagen,
    getImageUrl,
    obtener_tipoImagen,
    procesarImagen,
    getProcesamientoUrl
} from "../api/image_api.js";

import { initCanvas } from "../utils/image_canva.js";

document.addEventListener("DOMContentLoaded", () => {

    let currentImageId = null;
    let tiposPermitidos = [];
    let imagenOriginalUrl = null;

    const fileInput =
        document.getElementById("fileInput");

    const statusMessage =
        document.getElementById("status-message");

    const bloqueInicial =
        document.getElementById("bloque-inicial");

    const textoTipos =
        document.getElementById("tipos-texto");

    const btnNuevaImagen =
        document.getElementById("btnNuevaImagen");

    const btnReiniciar =
        document.getElementById("btnReiniciar");

    const btnDescargar =
        document.getElementById("btnDescargar");

    const btnMejorar =
        document.getElementById("btnMejorar");

    const btnBrillo =
        document.getElementById("btnBrillo");

    const btnQuitarRuido =
        document.getElementById("btnQuitarRuido");

    const btnBlancoyNegro =
        document.getElementById("btnBlancoyNegro");

    const btnRestaurar =
        document.getElementById("btnRestaurar");

   const { original: canvasOriginal, result: canvasResultado } = initCanvas({
        original: {
            canvasId:     "canvas-original",
            viewerId:     "viewer-original",
            zoomSliderId: "zoom-original"
        },
        result: {
            canvasId:     "canvas-resultado",
            viewerId:     "viewer-resultado",
            zoomSliderId: "zoom-resultado"
        }
    });

    async function cargarTiposImagen() {
        try {
            const tipos = await obtener_tipoImagen();
            tiposPermitidos = tipos;
 
            const extensiones = tipos.map(
                t => "." + t.nombre_tipoimagen.toLowerCase()
            );
            fileInput.setAttribute("accept", extensiones.join(","));
 
            textoTipos.innerText =
                "Formatos: " +
                tipos.map(t => t.nombre_tipoimagen.toUpperCase()).join(", ");
 
        } catch (err) {
            console.error("Error al obtener tipos de imagen:", err);
        }
    }
 
    cargarTiposImagen();
 
    function validarArchivo(file) {
        const ext = file.name.split(".").pop().toLowerCase();
        return tiposPermitidos.some(
            t => t.nombre_tipoimagen.toLowerCase() === ext
        );
    }

    function restaurarModoEdicion() {

    canvasResultado.limpiar();

    const panelResultado =
        document.getElementById("panel-resultado");

    if (panelResultado) {
        panelResultado.classList.add("d-none");
    }

    const sidebar =
        document.querySelector(".tools-sidebar");

    if (sidebar) {
        sidebar.style.display = "block";
    }

    const editorViewer =
        document.querySelector(".editor-viewer");

    if (editorViewer) {
        editorViewer.style.width = "70%";
    }
}

    async function ejecutarProceso(algoritmo) {
        if (!currentImageId) {
            statusMessage.innerText = "Primero sube una imagen";
            return;
        }

        statusMessage.innerText = "Procesando imagen...";

        try {
            const { status, data } = await procesarImagen(currentImageId, algoritmo);

            console.log("Respuesta del servidor:", data);
            const idProcesamiento = data.id_procesamiento;
            
            if (status === 200) {

                if (!idProcesamiento) {
                    console.error("No se encontró id_procesamiento:", data);
                    statusMessage.innerText = "Error en los datos del servidor.";
                    return;
                }

                const panelResultado = document.getElementById("panel-resultado");
                if (panelResultado) {
                    panelResultado.classList.remove("d-none");
                }

                const sidebar = document.querySelector(".tools-sidebar");
                if (sidebar) {
                    sidebar.style.display = "none";
                }
                const editorViewer = document.querySelector(".editor-viewer");
                if (editorViewer) {
                    editorViewer.style.width = "100%";
                }

                const resultadoUrl = getProcesamientoUrl(idProcesamiento);

                requestAnimationFrame(() => {
                    setTimeout(async () => {
                        try {
                            await canvasResultado.mostrarImagen(resultadoUrl);
                            statusMessage.innerText = "Proceso completado ✓";
                        } catch (canvasErr) {
                            console.error("Error al renderizar en el canvas:", canvasErr);
                            statusMessage.innerText = "Error al mostrar el resultado.";
                        }
                    }, 100);
                });

            } else {
                statusMessage.innerText = data.error || "Error al procesar";
            }
        } catch (error) {
            console.error("Error en la petición de procesamiento:", error);
            statusMessage.innerText = "Error al procesar";
        }
    }

    btnNuevaImagen.addEventListener("click", () => {

            restaurarModoEdicion();

            fileInput.click();
        });

    fileInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;
 
        fileInput.value = "";
 
        if (!validarArchivo(file)) {
            statusMessage.innerText = "Tipo de archivo no permitido";
            return;
        }
        
        restaurarModoEdicion();

        statusMessage.innerText = "Subiendo imagen...";
 
        const { status, data } = await subirImagen(file);
 
        if (status === 200) {
            currentImageId    = data.id;
            imagenOriginalUrl = getImageUrl(currentImageId);
 
            // Mostrar en canvas original
            await canvasOriginal.mostrarImagen(imagenOriginalUrl);
 
            // Limpiar canvas resultado
            canvasResultado.limpiar();
            
 
            statusMessage.innerText         = "Imagen cargada ✓";
            bloqueInicial.style.display     = "none";
            document.getElementById("editor-section").style.display = "flex"; // Muestra los canvas y la barra lateral
                        
 
        } else {
            statusMessage.innerText = data.error || "Error al subir imagen";
        }
    });

    btnReiniciar?.addEventListener("click", () => {
        
        restaurarModoEdicion();
    
        canvasOriginal.resetVista();
        statusMessage.innerText = "Editor reiniciado";
    });
    
    btnDescargar?.addEventListener("click", () => {
        canvasResultado.descargar("repixel_resultado.png");
    });


    btnMejorar?.addEventListener(     "click", () => ejecutarProceso("enfocar"));
    btnBrillo?.addEventListener(      "click", () => ejecutarProceso("ajustar brillo"));
    btnQuitarRuido?.addEventListener( "click", () => ejecutarProceso("quitar ruido"));
    btnBlancoyNegro?.addEventListener("click", () => ejecutarProceso("blanco y negro"));
    btnRestaurar?.addEventListener(   "click", () => ejecutarProceso("restaurar imagen"));
 
});