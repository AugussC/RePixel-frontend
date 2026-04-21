
let scale = 1;
let img = new Image();

export const initCanvas = (canvasId, viewerId, zoomSliderId) => {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const zoomSlider = document.getElementById(zoomSliderId);

    const draw = () => {
        if (!img.complete || !img.src) return;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        if (scale > 5) {
            ctx.beginPath();
            ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
            ctx.lineWidth = 1;
            for (let x = 0; x <= img.width; x++) {
                ctx.moveTo(x * scale, 0);
                ctx.lineTo(x * scale, canvas.height);
            }
            for (let y = 0; y <= img.height; y++) {
                ctx.moveTo(0, y * scale);
                ctx.lineTo(canvas.width, y * scale);
            }
            ctx.stroke();
        }
    };

    // Retornamos funciones que el main podrá usar
    return {
        mostrarImagen: (src) => {
            img.src = src;
            img.onload = () => {
                scale = 1;
                zoomSlider.value = 1;
                draw();
            };
        },
        updateScale: (newScale) => {
            scale = newScale;
            draw();
        }
    };
};