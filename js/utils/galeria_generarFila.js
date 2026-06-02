/**
 * Genera el componente HTML para una fila de archivo de imagen
 */
export function crearFilaImagen(img) {
    const imageId = img.id_image;
    const editorPageUrl = `inicio.html?id=${imageId}`; 
    const extension = img.ruta ? img.ruta.split(".").pop().toUpperCase() : "IMG";

    const row = document.createElement("div");
    row.classList.add("file-row");
    // Le dejamos un atributo de datos en la fila contenedora para facilitar la eliminación por delegación
    row.dataset.id = imageId; 

    row.innerHTML = `
        <div class="file-name">
            ${img.nombre_archivo || `Imagen ${imageId}`}
        </div>
        <div class="file-info">
            ${extension}
        </div>
        <div class="file-actions">
            <a href="${editorPageUrl}" class="btn btn-process">Procesar</a>
            <button type="button" class="btn-close" data-id="${imageId}" aria-label="Close"></button>
        </div>
    `;
    return row;
}

export function mostrarMensajeVacio(container) {
    container.innerHTML = `<p class="text-center">No hay imágenes disponibles</p>`;
}