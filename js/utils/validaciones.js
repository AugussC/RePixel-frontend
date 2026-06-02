/**
 * Valida si la extensión del archivo está dentro de los tipos permitidos por el backend.
 * @param {File} file 
 * @param {Array} tiposPermitidos 
 * @returns {boolean}
 */
export function validarArchivo(file, tiposPermitidos) {
    if (!file || !tiposPermitidos.length) return false;
    const ext = file.name.split(".").pop().toLowerCase();
    return tiposPermitidos.some(
        t => t.nombre_tipoimagen.toLowerCase() === ext
    );
}

/**
 * Genera el string para el atributo 'accept' del input file y el texto informativo.
 */
export function mapearFormatosUploader(tipos) {
    const extensiones = tipos.map(t => "." + t.nombre_tipoimagen.toLowerCase()).join(",");
    const textoInformativo = "Formatos: " + tipos.map(t => t.nombre_tipoimagen.toUpperCase()).join(", ");
    return { extensiones, textoInformativo };
}