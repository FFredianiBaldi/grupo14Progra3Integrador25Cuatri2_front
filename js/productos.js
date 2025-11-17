const productos = [];
const productosSection = document.getElementById("productos-section");
let carrito = [];

const carritoObj = document.getElementById('carrito');
const totalObj = document.getElementById('total');
const contadorProductos = document.getElementById('contador');
const ordenButtons = document.getElementById('orden-buttons');

const fetchProducts = () => {
    try {
        fetch("http://localhost:3000/api/products")
            .then(response => response.json())
            .then(data => {
                productos.push(...data);
                console.log("Productos cargados: ", productos);
                mostrarProductos(productos);
                cargarLocalStorage();
            });
    } catch (error) {
        console.log(error);
        // En caso de error, cargar productos de ejemplo
        const productosEjemplo = [
            { id: 1, nombre: "Jack Daniels", precio: 49115, categoria: "Whiskeys", imagen: "./img/jack-daniels.jpg" },
            { id: 2, nombre: "Johmie Walker Black", precio: 54500, categoria: "Whiskeys", imagen: "./img/johmie-walker.jpg" },
            { id: 3, nombre: "Jameson Irish Whiskey", precio: 34059, categoria: "Whiskeys", imagen: "./img/jameson.jpg" }
        ];
        productos.push(...productosEjemplo);
        mostrarProductos(productos);
        cargarLocalStorage();
    }
}

const mostrarProductos = (array) => {
    let objetoProductos = '';
    array.forEach(producto => {
        objetoProductos +=
            `
            <div class="card-producto">
                <img class="img" src="${producto.imagen}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p>$${producto.precio}</p>
                <span>${producto.categoria}</span>
                <button class="btn" onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
            </div>
        `
    })
    productosSection.innerHTML = objetoProductos;
}

const agregarAlCarrito = (productoId) => {
    let productoEncontrado = productos.find(producto => producto.id === productoId);
    let productoEncontradoEnCarrito = carrito.find(producto => producto.id === productoId);

    if (productoEncontradoEnCarrito) {
        productoEncontradoEnCarrito.cantidad++;
    } else {
        carrito.push({ ...productoEncontrado, cantidad: 1 });
    }

    calcularTotalProductos();
    calcularTotal();
    guardarEnLocalStorage(carrito);
    mostrarCarrito();
}

const mostrarCarrito = () => {
    let obj = '';
    carrito.forEach(producto => {
        obj +=
            `
            <div class="carrito-item">
                <p class="nombre-item">${producto.nombre} - $${producto.precio * producto.cantidad}</p>
                <span>Cantidad: ${producto.cantidad}</span>
                <button class="btn-eliminar" onclick="eliminarProducto(${producto.id})">Eliminar</button>
            </div>
        `
    });

    carritoObj.innerHTML = obj;
}

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
    mostrarCarrito();
}

const calcularTotalProductos = () => {
    let cantidadProductos = carrito.reduce((acc, value) => acc + value.cantidad, 0);
    contadorProductos.innerText = `Carrito: ${cantidadProductos} productos`;
}

const calcularTotal = () => {
    let sumaTotal = carrito.reduce((acc, value) => acc + value.precio * value.cantidad, 0);
    totalObj.innerText = `Total: $${sumaTotal.toFixed(2)}`; // Fixed para 2 decimales
}

document.getElementById('orden-nombre').addEventListener('click', () => {
    let productosOrdenados = [...productos].sort((a, b) => {
        return a.nombre.localeCompare(b.nombre);
    });
    mostrarProductos(productosOrdenados);
});

document.getElementById('orden-precio').addEventListener('click', () => {
    let productosOrdenados = [...productos].sort((a, b) => a.precio - b.precio);
    mostrarProductos(productosOrdenados);
});

document.getElementById('vaciar-carrito').addEventListener('click', function() {
    carrito = [];
    localStorage.removeItem('carrito');
    mostrarCarrito();
    calcularTotal();
    calcularTotalProductos();
});

const guardarEnLocalStorage = (carrito) => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

const cargarLocalStorage = () => {
    let carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    } else {
        carrito = [];
    }
    mostrarCarrito();
    calcularTotalProductos();
    calcularTotal();
}

fetchProducts();