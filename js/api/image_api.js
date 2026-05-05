import { API_URL } from "./config.js";

export async function subirImagen(file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_URL}/images`, {
        method: "POST",
        body: formData,
        credentials: "include"
    });

    const data = await res.json();
    return { status: res.status, data };
}

export function getImageUrl(id) {
    return `${API_URL}/images/${id}/view`;
}

export async function obtener_tipoImagen() {
    const res = await fetch(`${API_URL}/images/tipos-imagen`);
    if (!res.ok) throw new Error("Error al obtener tipos");
    return await res.json();
}