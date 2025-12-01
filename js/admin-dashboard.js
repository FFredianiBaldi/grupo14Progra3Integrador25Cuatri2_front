// Comprueba si existe token en localStorage; si no redirige al login.
const token = localStorage.getItem("token");

if(!token){
    window.location.href = "login.html";
}

// Elementos del DOM usados por el dashboard
const links = document.querySelectorAll(".aside-superior a");
const productosHTML = document.querySelector(".productos");
const ventasHTML = document.querySelector(".ventas");

// Agrega listener al botón "cerrar sesión" que borra token y redirige.
function cerrarSesion(){
    const cerrarSesion = document.getElementById("cerrar-sesion");
    
    cerrarSesion.addEventListener("click", () => {
        // Elimina token y vuelve al login
        localStorage.removeItem("token");
        window.location.href = "login.html";
    });
}

// Carga el HTML de productos en la sección correspondiente y marca el link activo.
function productos(){
    document.getElementById("btn-productos").addEventListener("click", async (evento) => {
        evento.preventDefault();
    
        const resp = await fetch ("./productos.html");
        const html = await resp.text();
        productosHTML.innerHTML = html;

        // Limpia la sección de ventas al mostrar productos
        ventasHTML.innerHTML = "";
    
        // Maneja clases activas en la barra lateral
        links.forEach(a => a.classList.remove("activo"));
        evento.target.classList.add("activo");
    });
}

// Carga el HTML de ventas en la sección correspondiente y marca el link activo.
function ventas(){
    document.getElementById("btn-ventas").addEventListener("click", async (evento) => {
        evento.preventDefault();

        const resp = await fetch("./ventas.html");
        const html = await resp.text();
        ventasHTML.innerHTML = html;

        // Limpia la sección de productos al mostrar ventas
        productosHTML.innerHTML = "";

        // Maneja clases activas en la barra lateral
        links.forEach(a => a.classList.remove("activo"));
        evento.target.classList.add("activo");
    });
}

// Inicializa comportamientos del dashboard
cerrarSesion();
productos();
ventas();