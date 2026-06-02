// Podés ubicarlo en js/pages/inicio_ui.js para que asista exclusivamente a esta página
const statusMessage = document.getElementById("status-message");
const editorStatus = document.getElementById("editor-status");

export function mostrarEstado(mensaje, conSpinner = false) {
    const editorSection = document.getElementById("editor-section");
    const editorActivo = editorSection && editorSection.style.display === "flex";
    const target = editorActivo ? editorStatus : statusMessage;

    if (!target) return;
    target.style.display = "block";

    if (conSpinner) {
        target.innerHTML = `
            <div class="d-flex align-items-center justify-content-center gap-2 p-2 rounded text-info" style="background-color: rgba(39, 172, 172, 0.1); border: 1px solid rgba(39, 172, 172, 0.3);">
                <div class="spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">Procesando...</span>
                </div>
                <span class="fw-bold">${mensaje}</span>
            </div>
        `;
    } else {
        const esExito = mensaje.includes("✓") || mensaje.toLowerCase().includes("exitoso") || mensaje.toLowerCase().includes("completado") || mensaje.toLowerCase().includes("cargada");
        const claseTexto = esExito ? "text-success" : "text-warning";
        const claseFondo = esExito ? "rgba(40, 167, 69, 0.1)" : "rgba(255, 193, 7, 0.1)";
        const claseBorde = esExito ? "rgba(40, 167, 69, 0.3)" : "rgba(255, 193, 7, 0.3)";

        target.innerHTML = `
            <div class="d-flex align-items-center justify-content-center p-2 rounded ${claseTexto}" style="background-color: ${claseFondo}; border: 1px solid ${claseBorde};">
                <span class="fw-bold">${mensaje}</span>
            </div>
        `;
    }
}

