// Devuelve un string formateado en moneda con 2 decimales
function formatearMoneda(n) {
    const num = Number(n);
    return isFinite(num) ? `$${num.toFixed(2)}` : '$0.00';
}

// Lee el carrito desde localStorage. Si no existe devuelve array vacío.
function obtenerCarrito() {
    try {
        const carritoString = localStorage.getItem('carrito');
        return carritoString ? JSON.parse(carritoString) : [];
    } catch (error) {
        return [];
    }
}

// Guarda el carrito en localStorage y actualiza contador en header si existe la función
function guardarCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    if (window.__actualizarContadorHeader) window.__actualizarContadorHeader();
}

// Calcula el total numérico del carrito (precio * cantidad)
function calcularTotal(carrito) {
    return carrito.reduce((acumulador, p) => {
        const precio = Number(p.precio) || 0;
        const cantidad = Number(p.cantidad) || 0;
        return acumulador + precio * cantidad;
    }, 0);
}

// Muestra un mensaje temporal en el elemento #notificacion
function mostrarNotificacion(texto) {
    const notificacionEl = document.getElementById('notificacion');
    if (!notificacionEl) return;
    notificacionEl.textContent = texto;
    notificacionEl.classList.remove('oculto');
    const duracion = 1800;
    setTimeout(() => notificacionEl.classList.add('oculto'), duracion);
}

// Cambia la cantidad de un artículo en el carrito (delta puede ser +1, -1 o 0 para eliminar)
function manejarAccionCarrito(id, delta) {
    let carrito = obtenerCarrito();
    const idString = String(id);
    const indice = carrito.findIndex(p => String(p.id) === idString);

    if (indice === -1) return; // no existe el item

    let articulo = carrito[indice];

    if (delta !== 0) {
        articulo.cantidad = (Number(articulo.cantidad) || 0) + delta;
    }

    // Si delta es 0 o la cantidad llega a 0, se elimina el producto
    if (delta === 0 || articulo.cantidad <= 0) {
        carrito.splice(indice, 1);
        mostrarNotificacion('Producto eliminado');
    } else {
        articulo.cantidad = Math.max(1, articulo.cantidad);
        mostrarNotificacion('Carrito actualizado');
    }

    guardarCarrito(carrito);
    renderizarCarrito();
}

// Wrapper para eliminar un artículo completamente
function eliminarArticulo(id) {
    manejarAccionCarrito(id, 0);
}

// Vacía el carrito por completo y actualiza la UI
function vaciarCarrito() {
    guardarCarrito([]);
    renderizarCarrito();
    mostrarNotificacion('Carrito vaciado');
}


// Renderiza el carrito en la página: items, total y estado de botones
function renderizarCarrito() {
    const carrito = obtenerCarrito();
    const lista = document.getElementById('cart-list');
    const vacio = document.getElementById('cart-empty');
    const elementoTotal = document.getElementById('cart-total');
    const botonVaciar = document.getElementById('vaciar-carrito');
    const botonComprar = document.getElementById('checkout');

    // si faltan elementos DOM, salimos (evita errores si la página no tiene carrito)
    if (!lista || !elementoTotal || !vacio || !botonVaciar || !botonComprar) return;

    if (carrito.length === 0) {
        lista.innerHTML = '';
        vacio.classList.remove('oculto'); // muestra mensaje de carrito vacío
        elementoTotal.textContent = formatearMoneda(0);
        botonVaciar.disabled = true;
        botonComprar.disabled = true;
        return;
    }

    // Si hay items, muestra lista y habilita botones
    vacio.classList.add('oculto');
    botonVaciar.disabled = false;
    botonComprar.disabled = false;

    // Genera HTML de cada artículo
    lista.innerHTML = carrito.map(articulo => {
        const cantidad = Number(articulo.cantidad) || 0;
        const precio = Number(articulo.precio) || 0;
        const subtotal = precio * cantidad;

        return `
            <article class="cart-item" data-id="${articulo.id}">
                <img class="cart-item-img" src="${articulo.imagen}" alt="${articulo.nombre}">
                <div class="cart-item-info">
                    <h3>${articulo.nombre}</h3>
                    <p class="small">Precio unitario: ${formatearMoneda(precio)}</p>
                    <div class="qty-row">
                        <button class="btn-qty btn-restar" data-id="${articulo.id}">-</button>
                        <span class="qty">${cantidad}</span>
                        <button class="btn-qty btn-sumar" data-id="${articulo.id}">+</button>
                    </div>
                </div>
                <div class="cart-item-right">
                    <p class="item-sub">${formatearMoneda(subtotal)}</p>
                    <button class="btn btn-eliminar small" data-id="${articulo.id}">Eliminar</button>
                </div>
            </article>
        `;
    }).join('\n');

    elementoTotal.textContent = formatearMoneda(calcularTotal(carrito));
}


// Inicialización: listeners y render inicial
document.addEventListener('DOMContentLoaded', () => {
    renderizarCarrito();

    // Delegación de eventos en la lista: botones + / - / eliminar
    document.getElementById('cart-list')?.addEventListener('click', (e) => {
        const objetivo = e.target;
        const id = objetivo.dataset.id || objetivo.closest('.cart-item')?.dataset.id;

        if (!id) return;

        if (objetivo.classList.contains('btn-sumar')) {
            manejarAccionCarrito(id, +1);
        } else if (objetivo.classList.contains('btn-restar')) {
            manejarAccionCarrito(id, -1);
        } else if (objetivo.classList.contains('btn-eliminar')) {
            eliminarArticulo(id);
        }
    });

    // Botón vaciar carrito con confirmación
    document.getElementById('vaciar-carrito')?.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que deseas vaciar todo el carrito?')) {
            vaciarCarrito();
        }
    });

    // Checkout: envía la venta al backend, guarda 'ultimaCompra' y muestra resumen si existe mostrarCompra
    document.getElementById('checkout')?.addEventListener('click', async () => {
        const carrito = obtenerCarrito();
        if (!carrito || carrito.length === 0) {
            mostrarNotificacion('El carrito está vacío');
            return;
        }

        const total = calcularTotal(carrito);
        const nombre = localStorage.getItem("nombreUsuario");

        const payload = {
            carrito,
            total,
            cliente: nombre
        };

        const btn = document.getElementById('checkout');
        btn.disabled = true;
        btn.textContent = 'Procesando...';

        try {
            // Llama al endpoint de ventas
            const res = await fetch('http://localhost:3000/api/products/ventas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Error al procesar la compra');
            }

            // Guarda un registro simple de la última compra para que pago.js pueda leerlo
            localStorage.setItem("ultimaCompra", JSON.stringify({ carrito, total }));

            // Si pago.js expone la función mostrarCompra, la llama de inmediato para abrir modal sin refresh
            if (typeof window.mostrarCompra === 'function') {
                try {
                    window.mostrarCompra({ carrito, total, ventaId: data?.ventaId ?? null });
                } catch (e) {
                    console.warn('mostrarCompra falló:', e);
                }
            }

            // limpiar carrito y actualizar UI
            guardarCarrito([]);
            renderizarCarrito();
            mostrarNotificacion('Compra realizada con éxito');

            // opcional: redirigir a página de gracias:
            // window.location.href = '/gracias.html';
        } catch (err) {
            console.error(err);
            mostrarNotificacion(err.message || 'Error en la compra');
        } finally {
            btn.disabled = false;
            btn.textContent = 'Finalizar compra';
        }
    });

    // Si otro tab cambió el storage, re-renderiza el carrito
    window.addEventListener('storage', renderizarCarrito);
});