import { API_URL } from "./config.js";

export async function loginUsuario({ correo, contraseña }) {
    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, contraseña }),
            credentials: 'include'
        });

        const data = await res.json();
        return { status: res.status, data };

    } catch (err) {
        console.error("Error conectando con el backend:", err);
        return { status: 500, data: { error: "Error de conexión" } };
    }
}

export async function registrarUsuario({ nombre, apellido, correo, contraseña, rol }) {
    const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, apellido, correo, contraseña, rol })
    });

    const data = await res.json();
    return { status: res.status, data };
}