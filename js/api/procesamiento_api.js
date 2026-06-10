import { API_URL } from "./config.js";

export async function procesarImagen(idImagen, algoritmo) {
    const res = await fetch(
        `${API_URL}/images/procesar-imagen/${idImagen}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                algoritmo
            })
        }
    );

    const data = await res.json();

    return {
        status: res.status,
        data
    };
}
export function getProcesamientoUrl(idProcesamiento) {
    return `${API_URL}/images/procesamientos/${idProcesamiento}/view`;
}

export function getDescargaUrl(idProcesamiento) {
    return `${API_URL}/images/procesamientos/${idProcesamiento}/descargar`;
}