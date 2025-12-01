const categorias = document.querySelectorAll(".selector-categoria");

categorias.forEach(categoria => {
    const btn = categoria.querySelector("button");
    btn.addEventListener("click", () => {
        // Quita la clase activa de todas y la pone en la seleccionada
        categorias.forEach(c => c.classList.remove("categoria-activo"));

        categoria.classList.add("categoria-activo");
    });
});

// ---------------------------------------------------------------------------------
// Productos: fetch desde API, render de tarjetas y manipulación del carrito
// ---------------------------------------------------------------------------------

const productos = [];
const productosSection = document.getElementById("productos-section");
let carrito = [];

const carritoObj = document.getElementById('carrito');
const totalObj = document.getElementById('total');
const contadorProductos = document.getElementById('contador');
const ordenButtons = document.getElementById('orden-buttons');

// Obtiene los productos desde el backend y carga el carrito guardado
const fetchProducts = () => {
    try {
        fetch("http://localhost:3000/api/products")
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

// Renderiza las tarjetas de productos en la sección correspondiente
const mostrarProductos = (array) => {
    let objetoProductos = '';
    array.forEach(producto => {
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
    })
    productosSection.innerHTML = objetoProductos;
}

// Añade producto al carrito respetando stock
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

// Eliminar o decrementar producto desde el carrito
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

// Calcula y actualiza el contador de productos en el header o UI
const calcularTotalProductos = () => {
    let cantidadProductos = carrito.reduce((acc, value) => acc + value.cantidad, 0);
    contadorProductos.innerText = `Carrito: ${cantidadProductos} productos`;
}

// Actualiza el total mostrado en la UI del carrito (sidebar)
const calcularTotal = () => {
    let sumaTotal = carrito.reduce((acc, value) => acc + value.precio * value.cantidad, 0);
    totalObj.innerText = `Total: $${sumaTotal.toFixed(2)}`; // Fixed para 2 decimales
}

// Filtros por categoría (botones)
document.getElementById('whiskies').addEventListener('click', () => {
    let productosFiltrados = productos
        .filter(producto => producto.categoria === 'whisky')
    mostrarProductos(productosFiltrados);
});

document.getElementById('vinos').addEventListener('click', () => {
    let productosFiltrados = productos
        .filter(producto => producto.categoria === 'vino')
    mostrarProductos(productosFiltrados);
});

// Vaciar carrito desde UI principal
document.getElementById('vaciar-carrito').addEventListener('click', function () {
    carrito = [];
    localStorage.removeItem('carrito');
    calcularTotal();
    calcularTotalProductos();

    refrescarCategoriaActual();
});

// Guardado del carrito en localStorage (nombre de la key: 'carrito')
const guardarEnLocalStorage = (carrito) => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Carga carrito desde localStorage y fija tipos numéricos
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

// Devuelve la cantidad actual de un item en el carrito
function obtenerCantidadEnCarrito(id){
    let item = carrito.find(p => p.id === id);
    return item ? item.cantidad : 0;
}

// Delegación de eventos en productosSection para botones + / -
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

// Actualiza la cantidad de un producto (se usa en la vista de productos)
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

// Refresca la categoría activa para re-renderizar la lista correcta
function refrescarCategoriaActual() {
    const catActiva = document.querySelector(".categoria-activo button").id;

    if (catActiva === "whiskies") {
        mostrarProductos(productos.filter(p => p.categoria === "whisky"));
    } else if (catActiva === "vinos"){
        mostrarProductos(productos.filter(p => p.categoria === "vino"));
    }
}

// Maneja el toggle Agregar/Eliminar por tarjeta de producto
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

// Elimina un producto del carrito completamente (usado por toggle)
function eliminarProductoTotal(id){
    carrito = carrito.filter(p => p.id !== id);
    guardarEnLocalStorage(carrito);
    calcularTotal();
    calcularTotalProductos();
}

// Muestra notificación simple en elemento #notificacion con animación/remoción rápida
function mostrarNotificacion(texto){
    const notif = document.getElementById("notificacion");
    notif.textContent = texto;

    notif.classList.add("mostrar");

    setTimeout(() => {
        notif.classList.remove("mostrar");
    }, 2000);
}

// Inicia la carga de productos
fetchProducts();