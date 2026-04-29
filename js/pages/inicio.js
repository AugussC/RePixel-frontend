import { subirImagen, getImageUrl } from "../api/image_api.js";
import { initCanvas } from "../utils/image_canva.js";

document.addEventListener("DOMContentLoaded", () => {

    let currentImageId = null;

    const fileInput = document.getElementById("fileInput");
    const statusMessage = document.getElementById("status-message");

    const canvasManager = initCanvas("canvas", "viewer", "zoom");

    fileInput.addEventListener("change", async (e) => {

        const file = e.target.files[0];
        if (!file) return;

        const { status, data } = await subirImagen(file);

        if (status === 200) {
            currentImageId = data.id;

            canvasManager.mostrarImagen(
                getImageUrl(currentImageId)
            );

            statusMessage.innerText = "Imagen subida!";
        } else {
            statusMessage.innerText = data.error;
        }
    });
});