// /frontend/js/utils/login.js
export async function loginUsuario({ correo, contraseña }) {
    try {
        const res = await fetch('http://127.0.0.1:5000/login', {
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