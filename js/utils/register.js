export function validarRegistro({ nombre, apellido, correo, contraseña, confirmarContraseña }) {
    const errores = {};

    if (!/^[a-zA-Z]+$/.test(nombre)) {
        errores.nombre = "Nombre solo debe contener letras.";
    }

    if (!/^[a-zA-Z]+$/.test(apellido)) {
        errores.apellido = "Apellido solo debe contener letras.";
    }

    if (!/^\S+@\S+\.\S+$/.test(correo)) {
        errores.correo = "Correo no válido.";
    }

    if (contraseña.length < 4) {
        errores.contraseña = "La contraseña debe tener al menos 4 caracteres.";
    }

    if (contraseña !== confirmarContraseña) {
        errores.confirmarContraseña = "Las contraseñas no coinciden.";
    }

    return errores; // Devuelve objeto con todos los errores encontrados
}


// Request al backend
export async function registrarUsuario({ nombre, apellido, correo, contraseña, rol }) {
    const res = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, apellido, correo, contraseña, rol })
    });
    return res.json().then(data => ({ status: res.status, data }));
}