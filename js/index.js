const form = document.getElementById("form-nombre");

form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();

    if (nombre != "") {
        localStorage.setItem("nombreUsuario", nombre);
        window.location.href = "productos.html";
    } else {
        alert("Ingrese su nombre antes de continuar.");
    }
});