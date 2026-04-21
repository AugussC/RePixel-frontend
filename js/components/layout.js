async function cargarHTML(id, archivo) {
    const res = await fetch(archivo);
    const html = await res.text();
    document.getElementById(id).innerHTML = html;
}

cargarHTML("navbar", "./navbar.html");
cargarHTML("footer", "./footer.html");