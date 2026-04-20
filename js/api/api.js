const API_URL = "http://127.0.0.1:5000"

export async function enviarBoton() {
    try {
        const respuesta = await fetch(`${API_URL}/boton`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                accion: "boton presionado desde frontend"
            })
        })

        const data = await respuesta.json()

        return data

    } catch (error) {
        console.error("Error conectando con el backend:", error)
        return { status: "error" }
    }
}