
export function crearCanvasTemporal(img) {

    const canvas = document.createElement("canvas");

    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(img, 0, 0);

    return canvas;
}

export function descargarCanvas(canvas, nombre) {

    const link = document.createElement("a");

    link.download = nombre;
    link.href = canvas.toDataURL("image/png");

    link.click();
}