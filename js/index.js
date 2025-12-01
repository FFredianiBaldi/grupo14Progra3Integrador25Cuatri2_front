const formNombre = document.getElementById("form-nombre");

formNombre.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();

    if (nombre != "") {
        // Guarda nombre y redirige a productos
        localStorage.setItem("nombreUsuario", nombre);
        window.location.href = "productos.html";
    } else {
        alert("Ingrese su nombre antes de continuar.");
    }
});