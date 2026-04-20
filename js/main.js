import { enviarBoton } from "./api/api.js"

document.addEventListener("DOMContentLoaded", () => {

    const boton = document.getElementById("miBoton")
    const resultado = document.getElementById("resultado")

    boton.addEventListener("click", async () => {

        resultado.innerText = "Enviando..."

        const respuesta = await enviarBoton()

        if (respuesta.status === "ok") {
            resultado.innerText = "✅ Backend respondió OK"
        } else {
            resultado.innerText = "❌ Error en la conexión"
        }

    })

})