const token = localStorage.getItem("token");

if(!token){
    window.location.href = "login.html";
}

const cerrarSesion = document.getElementById("cerrar-sesion");

cerrarSesion.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
});