let scale = 1;
let img = new Image();

export const initCanvas = (canvasId, viewerId, zoomSliderId) => {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const viewer = document.getElementById(viewerId);
    const zoomSlider = document.getElementById(zoomSliderId);

    const draw = () => {
        if (!img.complete || !img.src) return;

        const viewerWidth = viewer.clientWidth;
        const viewerHeight = viewer.clientHeight;

        // escala para adaptar imagen al viewer
        const fitScale = Math.min(
            viewerWidth / img.width,
            viewerHeight / img.height
        );

        // escala final con zoom
        const finalScale = fitScale * scale;

        const drawWidth = img.width * finalScale;
        const drawHeight = img.height * finalScale;

        canvas.width = drawWidth;
        canvas.height = drawHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.imageSmoothingEnabled = false;

        ctx.drawImage(
            img,
            0,
            0,
            drawWidth,
            drawHeight
        );

        // grilla pixel art
        if (finalScale > 5) {
            ctx.beginPath();
            ctx.strokeStyle = "rgba(255,255,255,0.3)";
            ctx.lineWidth = 1;

            for (let x = 0; x <= img.width; x++) {
                ctx.moveTo(x * finalScale, 0);
                ctx.lineTo(x * finalScale, canvas.height);
            }

            for (let y = 0; y <= img.height; y++) {
                ctx.moveTo(0, y * finalScale);
                ctx.lineTo(canvas.width, y * finalScale);
            }

            ctx.stroke();
        }
    };

    zoomSlider.addEventListener('input', () => {
        scale = parseFloat(zoomSlider.value);
        draw();
    });

    viewer.addEventListener('wheel', (e) => {
        e.preventDefault();
        scale += e.deltaY < 0 ? 0.2 : -0.2;
        scale = Math.min(Math.max(scale, 1), 11);
        zoomSlider.value = scale;
        draw();
    });

    return {
        mostrarImagen: async (src) => {
            const res = await fetch(src, {
                credentials: "include"
            });

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);

            img.src = url;

            img.onload = () => {
                scale = 1;
                zoomSlider.value = 1;
                draw();
            };
        }
    };
};