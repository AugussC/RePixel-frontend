// image_canva.js
// Crea visores de canvas con zoom, pan con mouse y grilla de píxeles

function crearVisor({ canvasId, viewerId, zoomSliderId, onTransform }) {

    const canvas     = document.getElementById(canvasId);
    const ctx        = canvas.getContext("2d");
    const viewer     = document.getElementById(viewerId);
    const zoomSlider = document.getElementById(zoomSliderId);

    let scale    = 1;
    let img      = new Image();
    let offsetX  = 0;
    let offsetY  = 0;
    let dragging = false;
    let startX   = 0;
    let startY   = 0;

    // ── dibujar ──────────────────────────────────────────────────────────────
    function draw(triggerCallback = true) {
        if (!img.complete || !img.src) return;

        let vw = viewer.clientWidth;
        let vh = viewer.clientHeight;

        // Fallback si el contenedor aún no tiene dimensiones válidas (ej. d-none o auto-sizing circular)
        if (vw === 0 || vh === 0) {
            vw = viewer.parentElement ? viewer.parentElement.clientWidth : 800;
            vh = 600; // Alto por defecto razonable
        }

        const fitScale   = Math.min(vw / img.width, vh / img.height);
        const finalScale = fitScale * scale;

        const drawW = img.width  * finalScale;
        const drawH = img.height * finalScale;

        canvas.width  = vw;
        canvas.height = vh;

        ctx.clearRect(0, 0, vw, vh);
        ctx.imageSmoothingEnabled = false;

        // centrar + offset de arrastre
        const x = (vw - drawW) / 2 + offsetX;
        const y = (vh - drawH) / 2 + offsetY;

        ctx.drawImage(img, x, y, drawW, drawH);

        // grilla de píxeles cuando hay mucho zoom
        if (finalScale > 5) {
            ctx.beginPath();
            ctx.strokeStyle = "rgba(255,255,255,0.25)";
            ctx.lineWidth   = 0.5;
            for (let px = 0; px <= img.width;  px++) {
                ctx.moveTo(x + px * finalScale, y);
                ctx.lineTo(x + px * finalScale, y + drawH);
            }
            for (let py = 0; py <= img.height; py++) {
                ctx.moveTo(x,        y + py * finalScale);
                ctx.lineTo(x + drawW, y + py * finalScale);
            }
            ctx.stroke();
        }

        // Notificar transformación si es necesario
        if (triggerCallback && onTransform) {
            onTransform({ scale, offsetX, offsetY });
        }
    }

    // ── zoom slider ───────────────────────────────────────────────────────────
    zoomSlider?.addEventListener("input", () => {
        scale = parseFloat(zoomSlider.value);
        draw();
    });

    // ── zoom rueda ────────────────────────────────────────────────────────────
    viewer.addEventListener("wheel", (e) => {
        e.preventDefault();
        scale += e.deltaY < 0 ? 0.2 : -0.2;
        scale  = Math.min(Math.max(scale, 0.5), 12);
        if (zoomSlider) zoomSlider.value = scale;
        draw();
    }, { passive: false });

    // ── arrastre mouse ────────────────────────────────────────────────────────
    canvas.addEventListener("mousedown", (e) => {
        dragging = true;
        startX   = e.clientX - offsetX;
        startY   = e.clientY - offsetY;
        canvas.style.cursor = "grabbing";
    });

    window.addEventListener("mousemove", (e) => {
        if (!dragging) return;
        offsetX = e.clientX - startX;
        offsetY = e.clientY - startY;
        draw();
    });

    window.addEventListener("mouseup", () => {
        if (dragging) {
            dragging = false;
            canvas.style.cursor = "grab";
        }
    });

    // ── touch (móvil) ─────────────────────────────────────────────────────────
    let lastTouchDist = null;

    canvas.addEventListener("touchstart", (e) => {
        if (e.touches.length === 1) {
            dragging = true;
            startX   = e.touches[0].clientX - offsetX;
            startY   = e.touches[0].clientY - offsetY;
        }
    }, { passive: true });

    canvas.addEventListener("touchmove", (e) => {
        e.preventDefault();
        if (e.touches.length === 1 && dragging) {
            offsetX = e.touches[0].clientX - startX;
            offsetY = e.touches[0].clientY - startY;
            draw();
        } else if (e.touches.length === 2) {
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            if (lastTouchDist !== null) {
                scale *= dist / lastTouchDist;
                scale  = Math.min(Math.max(scale, 0.5), 12);
                if (zoomSlider) zoomSlider.value = scale;
                draw();
            }
            lastTouchDist = dist;
        }
    }, { passive: false });

    canvas.addEventListener("touchend", () => {
        dragging      = false;
        lastTouchDist = null;
    });

    canvas.style.cursor = "grab";

    // ── API pública ───────────────────────────────────────────────────────────
    return {

        async mostrarImagen(src) {
            const res  = await fetch(src, { credentials: "include" });
            const blob = await res.blob();
            const url  = URL.createObjectURL(blob);

            img     = new Image();
            img.src = url;
            img.onload = () => {
                scale   = 1;
                offsetX = 0;
                offsetY = 0;
                if (zoomSlider) zoomSlider.value = 1;
                draw();
            };
        },

        limpiar() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.width  = 0;
            canvas.height = 0;
            img    = new Image();
            scale  = 1;
            offsetX = offsetY = 0;
        },

        resetVista() {
            scale   = 1;
            offsetX = 0;
            offsetY = 0;
            if (zoomSlider) zoomSlider.value = 1;
            draw();
        },

        descargar(nombre = "imagen.png") {
            if (!canvas.width) return;
            const link    = document.createElement("a");
            link.download = nombre;
            link.href     = canvas.toDataURL("image/png");
            link.click();
        },

        // Permite actualizar externamente la transformación para sincronización sin bucles infinitos
        setTransform(newScale, newOffsetX, newOffsetY) {
            scale   = newScale;
            offsetX = newOffsetX;
            offsetY = newOffsetY;
            if (zoomSlider) zoomSlider.value = scale;
            draw(false); // Falso para no re-disparar el callback recursivamente
        }
    };
}

// ── export: acepta configuración dual (original + resultado) ─────────────────
export function initCanvas(config) {

    // Compatibilidad con la firma legacy: initCanvas(canvasId, viewerId, zoomId)
    if (typeof config === "string") {
        const [canvasId, viewerId, zoomSliderId] = arguments;
        const original = crearVisor({ canvasId, viewerId, zoomSliderId });
        // Exponer la misma API que antes
        return {
            mostrarImagen: (src) => original.mostrarImagen(src),
            limpiar:       ()    => original.limpiar(),
            descargar:     (n)   => original.descargar(n),
            original,
            result: null
        };
    }

    // Nueva firma: initCanvas({ original: {...}, result: {...} })
    let original, result;

    const originalConfig = { ...config.original };
    const resultConfig = config.result ? { ...config.result } : null;

    // Si existen ambos canvas, sincronizamos la transformación (zoom y arrastre) automáticamente
    if (resultConfig) {
        originalConfig.onTransform = (coords) => {
            if (result) {
                result.setTransform(coords.scale, coords.offsetX, coords.offsetY);
            }
        };
        resultConfig.onTransform = (coords) => {
            if (original) {
                original.setTransform(coords.scale, coords.offsetX, coords.offsetY);
            }
        };
    }

    original = crearVisor(originalConfig);
    result   = resultConfig ? crearVisor(resultConfig) : null;

    return { original, result };
}