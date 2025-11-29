const token = localStorage.getItem("token");

if(!token){
    window.location.href = "login.html";
}

const links = document.querySelectorAll(".aside-superior a");
const productosHTML = document.querySelector(".productos");
const ventasHTML = document.querySelector(".ventas");

const productos = [];
const productosAMostrar = [];

const seccionInfo = document.getElementById("info");


const cerrarSesion = document.getElementById("cerrar-sesion");
    
cerrarSesion.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
});

document.getElementById("btn-productos").addEventListener("click", async (evento) => {
    evento.preventDefault();

    const resp = await fetch ("./productos.html");
    const html = await resp.text();
    productosHTML.innerHTML = html;

    ventasHTML.innerHTML = "";

    links.forEach(a => a.classList.remove("activo"));
    evento.target.classList.add("activo");

    seccionInfo.innerHTML = "";

    activarSubmenuProductos();
});

document.getElementById("btn-ventas").addEventListener("click", async (evento) => {
    evento.preventDefault();

    const resp = await fetch("./ventas.html");
    const html = await resp.text();
    ventasHTML.innerHTML = html;

    productosHTML.innerHTML = "";

    links.forEach(a => a.classList.remove("activo"));
    evento.target.classList.add("activo");

    seccionInfo.innerHTML = "";
});

function activarSubmenuProductos(){
    const submenuLinks = document.querySelectorAll(".productos ul li a");
    submenuLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            submenuLinks.forEach(a => a.classList.remove("activo"));
            e.target.classList.add("activo");
        });
    });
}

function fetchProducts(){
    try {
        fetch("http://localhost:3000/api/products")
            .then(response => response.json())
            .then(data => {
                productos.push(...data);
                console.log("productos cargados: ", productos);
            });
    } catch (error) {
        console.error(error);
    }
}

function mostrarProductos(array){
    let objetoInfo = 
    `
    <table class="tabla-productos">
        <thead>
            <tr>
                <th class="id-producto">ID</th>
                <th class="imagen-producto">Imagen</th>
                <th class="nombre-producto">Nombre</th>
                <th class="categoria-producto">Categoria</th>
                <th class="precio-producto">Precio</th>
                <th class="stock-producto">Stock</th>
                <th class="habilitado-producto">Habilitado</th>
                <th class="btns-modificar-producto"></th>
            </tr>
        </thead>

        <tbody>
    `;
    array.forEach(producto => {
        objetoInfo +=
        `
        <tr>
            <td class="id-producto">${producto.id}</td>
            <td class="imagen-producto">
                <div class="img-wrapper">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                </div>
            </td>
            <td class="nombre-producto">${producto.nombre}</td>
            <td class="categoria-producto">${producto.categoria}</td>
            <td class="precio-producto">$${producto.precio}</td>
            <td class="stock-producto">${producto.stock}</td>
            <td class="habilitado-producto">${producto.habilitado ? "Si" : "No"}</td>
            <td class="btns-modificar-producto">
                <button class="btn-editar" onclick="editar(${producto.id})">Editar</button>
                <button class="${producto.habilitado ? "btn-deshabilitar" : "btn-habilitar"}" onclick="toggleHabilitadoNotificacion(${producto.id})">${producto.habilitado ? "Deshabilitar" : "Habilitar"}</button>
            </td>
        </tr>
        `
    });

    objetoInfo +=`
        </tbody>
    </table>
    `

    seccionInfo.innerHTML = objetoInfo;
}

function mostrarBuscador(){
    seccionInfo.innerHTML = "";
}

function agregarProducto(){
    seccionInfo.innerHTML = "";
}

function toggleHabilitadoNotificacion(id){
    const producto = productos.find(p => p.id === id);
    const pantallaNotificacion = document.getElementById("toggle-habilitado-notificacion");
    const overlay = document.getElementById("overlay");

    pantallaNotificacion.innerHTML = `
    <h3>Esta seguro que desea ${producto.habilitado ? "deshabilitar" : "habilitar"} este producto?</h3>
    <div class="btns-confirmacion">
        <button class="btn-confirmar" onclick="efectuarToggle(${id})">Confirmar</button>
        <button class="btn-cancelar" onclick="cerrarNotificacionHabilitado()">Cancelar</button>
    </div>
    `

    pantallaNotificacion.style.opacity = 1;
    overlay.style.opacity = 1;
    overlay.style.pointerEvents = "auto";
}

async function efectuarToggle(id){
    const producto = productos.find(p => p.id === id);

    try {
        const res = await fetch(`http://localhost:3000/api/products/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                habilitado: !producto.habilitado
            })
        });

        if(!res.ok){
            console.error("error al actualizar en la base de datos");
            return
        }

        const actualizado = await res.json();

        producto.habilitado = actualizado.product.habilitado;

        mostrarProductos(productosAMostrar.length > 0 ? productosAMostrar : productos);

        cerrarNotificacionHabilitado();
    } catch(error) {
        console.error(error);
    }
}

function cerrarNotificacionHabilitado(){
    const pantallaNotificacion = document.getElementById("toggle-habilitado-notificacion");
    const overlay = document.getElementById("overlay");

    pantallaNotificacion.style.opacity = 0;
    pantallaNotificacion.style.pointerEvents = "auto";

    overlay.style.opacity = 0;
    overlay.style.pointerEvents = "none";
}

fetchProducts();