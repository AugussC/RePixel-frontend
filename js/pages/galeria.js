const API_URL = "http://127.0.0.1:5000";

document.addEventListener("DOMContentLoaded", async () => {

    try {

        let userId = null;

        // OBTENER USUARIO LOGUEADO

        try {

            const res = await fetch(
                `${API_URL}/me`,
                {
                    credentials: "include"
                }
            );

            if (!res.ok) {
                throw new Error("No se pudo obtener el usuario");
            }

            const user = await res.json();

            userId = user.id;

        } catch (err) {

            console.error("Error obteniendo usuario:", err);
            return;
        }

        // TRAER IMÁGENES DEL USUARIO

        const response = await fetch(
            `${API_URL}/users/${userId}/images`,
            {
                credentials: "include"
            }
        );

        if (!response.ok) {
            throw new Error("Error obteniendo imágenes");
        }

        const images = await response.json();

        console.log(images);

        const galleryContainer = document.getElementById("gallery-container");

        galleryContainer.innerHTML = "";

        // SI NO HAY IMÁGENES

        if (images.length === 0) {

            galleryContainer.innerHTML = `
                <p class="text-center">
                    No hay imágenes disponibles
                </p>
            `;

            return;
        }

        // RENDERIZAR IMÁGENES

        images.forEach(img => {

            const imageUrl = `${API_URL}/images/${img.id}/view`;

            const extension = img.ruta
                ? img.ruta.split(".").pop().toUpperCase()
                : "IMG";

            const row = document.createElement("div");

            row.classList.add("file-row");

            row.innerHTML = `
                <div class="file-name">
                    ${img.nombre_archivo || `Imagen ${img.id}`}
                </div>

                <div class="file-info">
                    ${extension}
                </div>

                <div class="file-actions">

                    <a 
                        href="${imageUrl}" 
                        download
                        class="btn btn-download"
                    >
                        Descargar
                    </a>

                    <button 
                        type="button"
                        class="btn-close"
                        data-id="${img.id}"
                        aria-label="Close"
                    ></button>

                </div>
            `;

            galleryContainer.appendChild(row);
        });

        // BOTONES ELIMINAR

        const deleteButtons = document.querySelectorAll(".btn-close");

        deleteButtons.forEach(button => {

            button.addEventListener("click", async () => {

                try {

                    const imageId = button.dataset.id;

                    const response = await fetch(
                        `${API_URL}/images/${imageId}/disable`,
                        {
                            method: "PATCH",
                            credentials: "include"
                        }
                    );

                    if (!response.ok) {
                        throw new Error("No se pudo eliminar");
                    }

                    button.closest(".file-row").remove();

                } catch (error) {

                    console.error("Error eliminando imagen:", error);
                }
            });
        });

    } catch (error) {

        console.error("Error cargando galería:", error);
    }
});