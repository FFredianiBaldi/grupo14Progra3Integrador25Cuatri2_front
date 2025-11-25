const token = localStorage.getItem("token");

if(!token){
    window.location.href = "login.html";
}

const links = document.querySelectorAll(".aside-superior a");
const productosHTML = document.querySelector(".productos");
const ventasHTML = document.querySelector(".ventas");


function cerrarSesion(){
    const cerrarSesion = document.getElementById("cerrar-sesion");
    
    cerrarSesion.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "login.html";
    });
}


function productos(){
    document.getElementById("btn-productos").addEventListener("click", async (evento) => {
        evento.preventDefault();
    
        const resp = await fetch ("./productos.html");
        const html = await resp.text();
        productosHTML.innerHTML = html;

        ventasHTML.innerHTML = "";
    
        links.forEach(a => a.classList.remove("activo"));
        evento.target.classList.add("activo");
    });
}

function ventas(){
    document.getElementById("btn-ventas").addEventListener("click", async (evento) => {
        evento.preventDefault();

        const resp = await fetch("./ventas.html");
        const html = await resp.text();
        ventasHTML.innerHTML = html;

        productosHTML.innerHTML = "";

        links.forEach(a => a.classList.remove("activo"));
        evento.target.classList.add("activo");
    });
}

cerrarSesion();
productos();
ventas();