const productos = [];
const productosSection = document.getElementById("productos-section");

const fetchProducts = () => {
    try {
        fetch("http://localhost:3000/api/products")
            .then(response => response.json())
            .then(data => {
                productos.push(...data);
                console.log("Productos cargados: ", productos);
                mostrarProductos(productos);
            });
    } catch (error) {
        console.log(error);
    }
}

const mostrarProductos = (array) => {
    let objetoProductos = '';
    array.forEach(producto => {
        objetoProductos +=
            `
            <div class="card-producto">
                <img class="img" src=${producto.imagen} alt=${producto.nombre}>
                <h3>${producto.nombre}</h3>
                <p>${producto.precio}$</p>
                <span>${producto.categoria}</span>
                <button class="btn" onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
            </div>
        `
    })
    productosSection.innerHTML = objetoProductos;
}

fetchProducts();
