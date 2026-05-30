import {
    subirImagen,
    getImageUrl,
    obtener_tipoImagen,
    procesarImagen
} from "../api/image_api.js";

import { initCanvas } from "../utils/image_canva.js";

document.addEventListener("DOMContentLoaded", () => {

    let currentImageId = null;
    let tiposPermitidos = [];

    const fileInput = document.getElementById("fileInput");
    const statusMessage = document.getElementById("status-message");
    const bloqueInicial = document.getElementById("bloque-inicial");
    const textoTipos = document.getElementById("tipos-texto");

    const btnNuevaImagen = document.getElementById("btnNuevaImagen");
    const btnMejorar = document.getElementById("btnMejorar");
    const btnBrillo = document.getElementById("btnBrillo");
    const btnEnfocar = document.getElementById("btnEnfocar");
    const btnRestaurar = document.getElementById("btnRestaurar");

    const canvasManager = initCanvas(
        "canvas",
        "viewer",
        "zoom"
    );

    async function cargarTiposImagen() {
        try {

            const tipos = await obtener_tipoImagen();

            tiposPermitidos = tipos;

            const extensiones = tipos.map(
                t => "." + t.nombre_tipoimagen.toLowerCase()
            );

            fileInput.setAttribute(
                "accept",
                extensiones.join(",")
            );

            if (textoTipos) {
                textoTipos.innerText =
                    "Formatos: " +
                    tipos
                        .map(
                            t => t.nombre_tipoimagen.toUpperCase()
                        )
                        .join(", ");
            }

        } catch (err) {
            console.error(
                "Error cargando tipos:",
                err
            );
        }
    }

    cargarTiposImagen();

    function validarArchivo(file) {

        const extension =
            file.name
                .split(".")
                .pop()
                .toLowerCase();

        return tiposPermitidos.some(
            t =>
                t.nombre_tipoimagen.toLowerCase() ===
                extension
        );
    }

    async function ejecutarProceso(algoritmo) {

        if (!currentImageId) {
            statusMessage.innerText =
                "Primero sube una imagen";
            return;
        }

        statusMessage.innerText =
            "Procesando imagen...";

        try {

            const { status, data } =
                await procesarImagen(
                    currentImageId,
                    algoritmo
                );

            if (status === 200) {

                console.log(data);

                statusMessage.innerText =
                    "Proceso completado";

            } else {

                statusMessage.innerText =
                    data.error ||
                    "Error al procesar";

            }

        } catch (error) {

            console.error(error);

            statusMessage.innerText =
                "Error al procesar la imagen";
        }
    }

    btnNuevaImagen.addEventListener(
        "click",
        () => {
            fileInput.click();
        }
    );

    fileInput.addEventListener(
        "change",
        async (e) => {

            const file =
                e.target.files[0];

            if (!file) return;

            if (!validarArchivo(file)) {

                statusMessage.innerText =
                    "Tipo de archivo no permitido";

                fileInput.value = "";

                return;
            }

            const { status, data } =
                await subirImagen(file);

            if (status === 200) {

                currentImageId = data.id;

                canvasManager.mostrarImagen(
                    getImageUrl(currentImageId)
                );

                statusMessage.innerText =
                    "Imagen subida";

                bloqueInicial.style.display =
                    "none";

                document.getElementById(
                    "editor-section"
                ).style.display = "flex";

            } else {

                statusMessage.innerText =
                    data.error;

            }
        }
    );

    btnMejorar?.addEventListener(
        "click",
        () => ejecutarProceso("mejorar")
    );

    btnBrillo?.addEventListener(
        "click",
        () => ejecutarProceso("brillo")
    );

    btnEnfocar?.addEventListener(
        "click",
        () => ejecutarProceso("enfocar")
    );

    btnRestaurar?.addEventListener(
        "click",
        () => ejecutarProceso("restaurar")
    );

});