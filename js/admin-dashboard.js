const token = localStorage.getItem("token");

if(!token){
    window.location.href = "login.html";
}

const links = document.querySelectorAll(".aside-superior a");
const productosHTML = document.querySelector(".productos");
const ventasHTML = document.querySelector(".ventas");

const productos = [];
let productosAMostrar = [];

const seccionInfo = document.getElementById("info");

const overlay = document.getElementById("overlay");

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
    let valorBusquedaActual = document.getElementById("buscador-productos")?.value || "";

    let categoriaSeleccionada = document.getElementById("filtrar-categoria")?.value || "todos";
    let ordenSeleccionado = document.getElementById("ordenar-por")?.value || "id";

    let objetoInfo = 
    `
    <div class="filtrado-productos">
        <div class="filtros">
            <p>Categoria: </p>
            <select id="filtrar-categoria">
                <option value="todos" ${categoriaSeleccionada === "todos" ? "selected" : ""}>Todos</option>
                <option value="whisky" ${categoriaSeleccionada === "whisky" ? "selected" : ""}>Whisky</option>
                <option value="vino" ${categoriaSeleccionada === "vino" ? "selected" : ""}>Vino</option>
            </select>
            <p>Ordenar por: </p>
            <select id="ordenar-por">
                <option value="id" ${ordenSeleccionado === "id" ? "selected" : ""}>ID</option>
                <option value="alfabeticamente" ${ordenSeleccionado === "alfabeticamente" ? "selected" : ""}>A-Z</option>
                <option value="precio-asc" ${ordenSeleccionado === "precio-asc" ? "selected" : ""}>Precio men. a may.</option>
                <option value="precio-desc" ${ordenSeleccionado === "precio-desc" ? "selected" : ""}>Precio may. a men.</option>
            </select>
        </div>

        <div class="busqueda">
            <input type="text" id="buscador-productos" placeholder="Buscar...">
        </div>
    </div>

        
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

    document.getElementById("buscador-productos").value = valorBusquedaActual;
    document.getElementById("buscador-productos").focus();

    const selectCat = document.getElementById("filtrar-categoria");

    selectCat.onchange = (evento) => {
        if (evento.target.value === "todos"){
            productosAMostrar = [];
            mostrarProductos(productos);
        } 
        else {
            productosAMostrar = productos.filter(p => p.categoria === evento.target.value);
            mostrarProductos(productosAMostrar);
        }
    }

    const selectOrd = document.getElementById("ordenar-por");

    selectOrd.onchange = (evento) => {
        if (evento.target.value === "id"){
            if (productosAMostrar.length > 0) {
                productosAMostrar.sort((a, b) => a.id - b.id);
                mostrarProductos(productosAMostrar);
            } else {
                productos.sort((a, b) => a.id - b.id);
                mostrarProductos(productos);
            }
        } else if (evento.target.value === "alfabeticamente"){
            if (productosAMostrar.length > 0) {
                productosAMostrar.sort((a, b) => a.nombre.localeCompare(b.nombre));
                mostrarProductos(productosAMostrar);
            }
            else {
                productos.sort((a, b) => a.nombre.localeCompare(b.nombre));
                mostrarProductos(productos);
            }
        } else if (evento.target.value === "precio-asc") {
            if (productosAMostrar.length > 0) {
                productosAMostrar.sort((a, b) => a.precio - b.precio);
                mostrarProductos(productosAMostrar);
            } else {
                productos.sort((a, b) => a.precio - b.precio);
                mostrarProductos(productos);
            }
        } else if (evento.target.value === "precio-desc") {
            if (productosAMostrar.length > 0) {
                productosAMostrar.sort((a, b) => b.precio - a.precio);
                mostrarProductos(productosAMostrar);
            } else {
                productos.sort((a, b) => b.precio - a.precio);
                mostrarProductos(productos);
            }
        }
    }

    const buscadorProductos = document.getElementById("buscador-productos");

    buscadorProductos.addEventListener("keyup", () => {
        let valorBusqueda = buscadorProductos.value.toLowerCase();
        let productosFiltrados = [];
        if (productosAMostrar.length > 0) {
            productosFiltrados = productosAMostrar.filter(producto => producto.nombre.toLowerCase().includes(valorBusqueda));
        } else {
            productosFiltrados = productos.filter(producto => producto.nombre.toLowerCase().includes(valorBusqueda));
        }

        mostrarProductos(productosFiltrados);
    });
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

    pantallaNotificacion.style.opacity = 0;
    pantallaNotificacion.style.pointerEvents = "auto";

    overlay.style.opacity = 0;
    overlay.style.pointerEvents = "none";
}

function editar(id) {
    const producto = productos.find(p => p.id === id);
    const pantallaNotificacion = document.getElementById("editar-notificacion");

    pantallaNotificacion.innerHTML = `
    <form id="form-edicion">
        <label for="imagen-form">URL de la imagen:</label><br>
        <input type="text" name="imagen" id="imagen-form" value="${producto.imagen}"><br>
        <label for="nombre-form">Nombre del producto:</label><br>
        <input type="text" name="nombre" id="nombre-form" value="${producto.nombre}"><br>
        <label for="categoria-form">Categoria del producto:<label><br>
        <select id="categoria-form">
            <option value="whisky" ${producto.categoria === "whisky" ? "selected" : ""}>Whisky</option>
            <option value="vino" ${producto.categoria === "vino" ? "selected" : ""}>Vino</option>
        </select><br>
        <label for="precio-form">Precio del producto:<label><br>
        <input type="text" name="precio" id="precio-form" value="${producto.precio}"><br>
        <label for="stock-form">Cantidad en stock:<label><br>
        <input type="text" name="stock" id="stock-form" value="${producto.stock}"><br>
        <label for="habilitado-form">Habilitado:<label><br>
        <select id="habilitado-form">
            <option value="1" ${producto.habilitado ? "selected" : ""}>Si</option>
            <option value="0" ${!producto.habilitado ? "selected" : ""}>No</option>
        </select><br>


        <button type="submit" class="btn-confirmar">Confirmar</button>
        <button type="button" class="btn-cancelar" onclick="cerrarNotificacionEditado()">Cancelar</button>
    </form>
    `

    document.getElementById("form-edicion").addEventListener("submit", async (evento) => {
        evento.preventDefault();

        const imagen = document.getElementById("imagen-form").value.trim();
        const nombre = document.getElementById("nombre-form").value.trim();
        const categoria = document.getElementById("categoria-form").value;
        const precio = document.getElementById("precio-form").value.trim();
        const stock = document.getElementById("stock-form").value.trim();
        const habilitado = document.getElementById("habilitado-form").value;

        const nuevoProducto = {
            imagen: imagen || producto.imagen,
            nombre: nombre || producto.nombre,
            categoria: categoria || producto.categoria,
            precio: precio !== "" ? Number(precio) : producto.precio,
            stock: stock !== "" ? Number(stock) : producto.stock,
            habilitado: habilitado === "1",
        };

        try {
            const res = await fetch(`http://localhost:3000/api/products/${id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(nuevoProducto)
            });

            if (!res.ok) {
                console.error("error al actualizar");
                return;
            }

            const actualizado = await res.json();

            Object.assign(producto, actualizado.product);

            mostrarProductos(productosAMostrar.length > 0 ? productosAMostrar : productos);

            cerrarNotificacionEditado();
        } catch (error) {
            console.error(error);
        }
    });

    pantallaNotificacion.style.opacity = 1;
    overlay.style.opacity = 1;
    overlay.style.pointerEvents = "auto";
}

function cerrarNotificacionEditado() {
    const pantallaNotificacion = document.getElementById("editar-notificacion");

    pantallaNotificacion.style.opacity = 0;
    pantallaNotificacion.style.pointerEvents = "auto";

    overlay.style.opacity = 0;
    overlay.style.pointerEvents = "none";
}

fetchProducts();