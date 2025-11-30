function formatearMoneda(n) {
    const num = Number(n);
    return isFinite(num) ? `$${num.toFixed(2)}` : '$0.00';
}

function obtenerCarrito() {
    try {
        const carritoString = localStorage.getItem('carrito');
        return carritoString ? JSON.parse(carritoString) : [];
    } catch (error) {
        return [];
    }
}

function guardarCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    if (window.__actualizarContadorHeader) window.__actualizarContadorHeader();
}

function calcularTotal(carrito) {
    return carrito.reduce((acumulador, p) => {
        const precio = Number(p.precio) || 0;
        const cantidad = Number(p.cantidad) || 0;
        return acumulador + precio * cantidad;
    }, 0);
}

function mostrarNotificacion(texto) {
    const notificacionEl = document.getElementById('notificacion');
    if (!notificacionEl) return;
    notificacionEl.textContent = texto;
    notificacionEl.classList.remove('oculto');
    const duracion = 1800;
    setTimeout(() => notificacionEl.classList.add('oculto'), duracion);
}

function manejarAccionCarrito(id, delta) {
    let carrito = obtenerCarrito();
    const idString = String(id);
    const indice = carrito.findIndex(p => String(p.id) === idString);

    if (indice === -1) return;

    let articulo = carrito[indice];

    if (delta !== 0) {
        articulo.cantidad = (Number(articulo.cantidad) || 0) + delta;
    }

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

function eliminarArticulo(id) {
    manejarAccionCarrito(id, 0);
}

function vaciarCarrito() {
    guardarCarrito([]);
    renderizarCarrito();
    mostrarNotificacion('Carrito vaciado');
}


function renderizarCarrito() {
    const carrito = obtenerCarrito();
    const lista = document.getElementById('cart-list');
    const vacio = document.getElementById('cart-empty');
    const elementoTotal = document.getElementById('cart-total');
    const botonVaciar = document.getElementById('vaciar-carrito');
    const botonComprar = document.getElementById('checkout');

    if (!lista || !elementoTotal || !vacio || !botonVaciar || !botonComprar) return;

    if (carrito.length === 0) {
        lista.innerHTML = '';
        vacio.classList.remove('oculto');
        elementoTotal.textContent = formatearMoneda(0);
        botonVaciar.disabled = true;
        botonComprar.disabled = true;
        return;
    }

    vacio.classList.add('oculto');
    botonVaciar.disabled = false;
    botonComprar.disabled = false;

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


document.addEventListener('DOMContentLoaded', () => {
    renderizarCarrito();

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

    document.getElementById('vaciar-carrito')?.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que deseas vaciar todo el carrito?')) {
            vaciarCarrito();
        }
    });

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
            const res = await fetch('http://localhost:3000/api/products/ventas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Error al procesar la compra');
            }
            localStorage.setItem("ultimaCompra", JSON.stringify({ carrito, total }));

            // mostrar resumen inmediatamente si pago.js expone la función
            if (typeof window.mostrarCompra === 'function') {
                try {
                    window.mostrarCompra({ carrito, total, ventaId: data?.ventaId ?? null });
                } catch (e) {
                    console.warn('mostrarCompra falló:', e);
                }
            }

            // éxito: limpiar carrito y actualizar UI
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

    window.addEventListener('storage', renderizarCarrito);
});