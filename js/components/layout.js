
async function cargarHTML(id, archivo) {
    const res = await fetch(archivo);
    const html = await res.text();
    document.getElementById(id).innerHTML = html;
}


document.addEventListener('DOMContentLoaded', async () => {
    // --- Navbar dinámico ---
    let user = null;
    try {
        const res = await fetch('http://127.0.0.1:5000/me', { credentials: 'include' });
        if(res.ok) user = await res.json();
    } catch(err) { console.error(err); }

    const noUserElems = document.querySelectorAll('.no-user');
    const withUserElems = document.querySelectorAll('.with-user');
    const userBadge = document.getElementById('userBadge');

    if(user){
        noUserElems.forEach(el => el.style.display = 'none');
        withUserElems.forEach(el => el.style.display = 'flex');
        userBadge.innerText = `${user.nombre}  ${user.apellido} \n (${user.correo})`;

        document.getElementById('btnLogout').addEventListener('click', async () => {
            await fetch('http://127.0.0.1:5000/logout', { method: 'POST', credentials:'include' });
            window.location.href = "../pages/index.html";
        });

    } else {
        noUserElems.forEach(el => el.style.display = 'flex');
        withUserElems.forEach(el => el.style.display = 'none');
    }

});


cargarHTML("navbar", "../js/components/navbar.html");
cargarHTML("footer", "../js/components/footer.html");


