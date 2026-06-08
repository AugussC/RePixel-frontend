export function mutarInterfazModoEdicion(verResultado = false) {
    const panelResultado = document.getElementById("panel-resultado");
    const sidebar = document.querySelector(".tools-sidebar");
    const editorViewer = document.querySelector(".editor-viewer");
    const editorStatusLocal = document.getElementById("editor-status");
    const statusMessageLocal = document.getElementById("status-message");
    const btnDescargar = document.getElementById("btnDescargar");

    if (btnDescargar) {
        btnDescargar.disabled = !verResultado;
    }

    if (verResultado) {
        if (panelResultado) panelResultado.classList.remove("d-none");
        if (sidebar) sidebar.style.display = "none";
        if (editorViewer) editorViewer.style.width = "100%";
    } else {
        if (editorStatusLocal) editorStatusLocal.style.display = "none";
        if (statusMessageLocal) statusMessageLocal.style.display = "none";
        if (panelResultado) panelResultado.classList.add("d-none");
        if (sidebar) sidebar.style.display = "block";
        if (editorViewer) editorViewer.style.width = "70%";
    }
}