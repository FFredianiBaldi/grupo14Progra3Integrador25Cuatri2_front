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
                <button class="${producto.habilitado ? "btn-deshabilitar" : "btn-habilitar"}" onclick="toggleHabilitado(${producto.id})">${producto.habilitado ? "Deshabilitar" : "Habilitar"}</button>
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

fetchProducts();