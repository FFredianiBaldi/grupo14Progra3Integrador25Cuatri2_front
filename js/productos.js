const categorias = document.querySelectorAll(".selector-categoria");

categorias.forEach(categoria => {
    const btn = categoria.querySelector("button");
    btn.addEventListener("click", () => {
        categorias.forEach(c => c.classList.remove("categoria-activo"));

        categoria.classList.add("categoria-activo");
    });
});










const productos = [];
const productosSection = document.getElementById("productos-section");
let carrito = [];
const productosPorPagina = 6;
let paginaActual = 1;

const carritoObj = document.getElementById('carrito');
const totalObj = document.getElementById('total');
const contadorProductos = document.getElementById('contador');
const ordenButtons = document.getElementById('orden-buttons');

const fetchProducts = () => {
    try {
        fetch("https://alambique22-api.onrender.com/api/products")
            .then(response => response.json())
            .then(data => {
                productos.push(...data);
                cargarLocalStorage();
                console.log("Productos cargados: ", productos);
                const productosWhisky = productos.filter(p => p.categoria === "whisky");
                mostrarProductos(productosWhisky);
            });
    } catch (error) {
        console.error(error);
    }
}

const mostrarProductos = (array) => {

    const inicio = (paginaActual - 1) * productosPorPagina;
    const fin = inicio + productosPorPagina;
    const productosPagina = array.slice(inicio, fin);

    let objetoProductos = '';
    productosPagina.forEach(producto => {
        if(producto.habilitado){
            const cantidad = obtenerCantidadEnCarrito(producto.id);
            const esEnCarrito = cantidad > 0;
            objetoProductos +=
                `
                <div class="card-producto">
                    <div class="img-wrapper">
                        <img src="${producto.imagen}" alt="${producto.nombre}">
                    </div>
                    <h3 class="nombre-producto">${producto.nombre}</h3>
                    <p class="precio-producto">$${producto.precio}</p>
                    <div class="cantidad-producto">
                        <button class="btn-restar" data-id="${producto.id}">-</button>
                        <p class="cantidad-elegida">${obtenerCantidadEnCarrito(producto.id)}</p>
                        <button class="btn-sumar" data-id="${producto.id}">+</button>
                    </div>
                    <button class="btn-producto btn-toggle ${cantidad > 0 ? "btn-eliminar" : ""}" data-id="${producto.id}">${esEnCarrito ? "Eliminar del carrito" : "Agregar al carrito"}</button>
                </div>
            `
        }
    })
    productosSection.innerHTML = objetoProductos;

    actualizarPaginacion(array);
}

function actualizarPaginacion(arrayCompleto){
    const totalPaginas = Math.max(1, Math.ceil(arrayCompleto.length / productosPorPagina));
    const paginacion = document.getElementById("paginacion");

    if (totalPaginas <= 1) {
        paginacion.innerHTML = "";
        return;
    }

    paginacion.innerHTML = `
    <button id="prev" ${paginaActual === 1 ? "disabled" : ""}>Anterior</button>
    <span>Pagina ${paginaActual} de ${totalPaginas}</span>
    <button id="next" ${paginaActual === totalPaginas ? "disabled" : ""}>Siguiente</button>
    `;

    document.getElementById("prev").addEventListener("click", () => {
        if (paginaActual > 1) {
            paginaActual--;

            refrescarCategoriaActual();
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    })

    document.getElementById("next").addEventListener("click", () => {
        if (paginaActual < totalPaginas) {
            paginaActual++;

            refrescarCategoriaActual();
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    })
}

const agregarAlCarrito = (productoId) => {
    let productoEncontrado = productos.find(producto => producto.id === productoId);
    let productoEncontradoEnCarrito = carrito.find(producto => producto.id === productoId);

    const cantidadActual = obtenerCantidadEnCarrito(productoId);
    if (cantidadActual >= productoEncontrado.stock) {
        mostrarNotificacion("No hay mas stock disponible");
        return;
    }


    if (productoEncontradoEnCarrito) {
        productoEncontradoEnCarrito.cantidad++;
    } else {
        carrito.push({ ...productoEncontrado, cantidad: 1 });
    }

    calcularTotalProductos();
    calcularTotal();
    guardarEnLocalStorage(carrito);
    refrescarCategoriaActual();
}

// Puede servir para cuando se haga el carrito, asi que lo dejo comentado

// const mostrarCarrito = () => {
//     let obj = '';
//     carrito.forEach(producto => {
//         obj +=
//             `
//             <p class="nombre-item">${producto.nombre} - $${producto.precio * producto.cantidad}</p>
//             <span>Cantidad: ${producto.cantidad}</span>
//             <button class="btn-eliminar" onclick="eliminarProducto(${producto.id})">Eliminar</button>
//         `
//     });

//     carritoObj.innerHTML = obj;
// }

const eliminarProducto = (productoId) => {
    let productoEncontrado = carrito.find(producto => producto.id === productoId);

    if (productoEncontrado.cantidad === 1) {
        carrito = carrito.filter(producto => producto.id !== productoId);
    } else {
        productoEncontrado.cantidad--;
    }
    calcularTotalProductos();
    calcularTotal();
    guardarEnLocalStorage(carrito);
}

const calcularTotalProductos = () => {
    let cantidadProductos = carrito.reduce((acc, value) => acc + value.cantidad, 0);
    contadorProductos.innerText = `Carrito: ${cantidadProductos} productos`;
}

const calcularTotal = () => {
    let sumaTotal = carrito.reduce((acc, value) => acc + value.precio * value.cantidad, 0);
    totalObj.innerText = `Total: $${sumaTotal.toFixed(2)}`; // Fixed para 2 decimales
}

document.getElementById('whiskies').addEventListener('click', () => {
    paginaActual = 1;
    let productosFiltrados = productos
        .filter(producto => producto.categoria === 'whisky')
    mostrarProductos(productosFiltrados);
});

document.getElementById('vinos').addEventListener('click', () => {
    paginaActual = 1;
    let productosFiltrados = productos
        .filter(producto => producto.categoria === 'vino')
    mostrarProductos(productosFiltrados);
});

document.getElementById('vaciar-carrito').addEventListener('click', function () {
    carrito = [];
    localStorage.removeItem('carrito');
    calcularTotal();
    calcularTotalProductos();

    refrescarCategoriaActual();
});

const guardarEnLocalStorage = (carrito) => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

const cargarLocalStorage = () => {
    let carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);

        carrito = carrito.map(p => ({
            ...p,
            precio: Number(p.precio)
        }));
    } else {
        carrito = [];
    }
    calcularTotalProductos();
    calcularTotal();
}

function obtenerCantidadEnCarrito(id){
    let item = carrito.find(p => p.id === id);
    return item ? item.cantidad : 0;
}

productosSection.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-sumar")) {
        const card = e.target.closest(".card-producto");
        const id = Number(e.target.dataset.id);

        const producto = productos.find(p => p.id === parseInt(id));

        const cantidadActual = obtenerCantidadEnCarrito(id);
        if (cantidadActual >= producto.stock) {
            mostrarNotificacion("No hay mas stock disponible");
            return;
        }

        actualizarCantidad(id, +1, card);
    }

    if (e.target.classList.contains("btn-restar")) {
        const card = e.target.closest(".card-producto");
        const id = Number(e.target.dataset.id);

        actualizarCantidad(id, -1, card);
    }
});

function actualizarCantidad(productoId, cambio, card) {
    let item = carrito.find(p => p.id === productoId);

    if (!item && cambio > 0) {
        const prod = productos.find(p => p.id === productoId);
        carrito.push({ ...prod, cantidad: 1 });
    } else if (item) {
        item.cantidad += cambio;
        if (item.cantidad <= 0) {
            carrito = carrito.filter(p => p.id !== productoId);
        }
    }

    guardarEnLocalStorage(carrito);

    calcularTotal();
    calcularTotalProductos();

    const cantidadElem = card.querySelector(".cantidad-elegida");
    cantidadElem.textContent = obtenerCantidadEnCarrito(productoId);

    refrescarCategoriaActual();
}

function refrescarCategoriaActual() {
    const catActiva = document.querySelector(".categoria-activo button").id;

    if (catActiva === "whiskies") {
        const arr = productos.filter(p => p.categoria === "whisky");
        mostrarProductos(arr);
    } else if (catActiva === "vinos"){
        const arr = productos.filter(p => p.categoria === "vino");
        mostrarProductos(arr);
    }
}

productosSection.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-toggle")) {
        const id = Number(e.target.dataset.id);
        const cantidad = obtenerCantidadEnCarrito(id);

        if (cantidad > 0) {
            eliminarProductoTotal(id);
        } else {
            agregarAlCarrito(id);
        }

        refrescarCategoriaActual();
    }
});

function eliminarProductoTotal(id){
    carrito = carrito.filter(p => p.id !== id);
    guardarEnLocalStorage(carrito);
    calcularTotal();
    calcularTotalProductos();
}

function mostrarNotificacion(texto){
    const notif = document.getElementById("notificacion");
    notif.textContent = texto;

    notif.classList.add("mostrar");

    setTimeout(() => {
        notif.classList.remove("mostrar");
    }, 2000);
}

fetchProducts();