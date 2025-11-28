const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const form = document.getElementById("registro-form");

form.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch ("http://localhost:3000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ email, password})
        });

        const data = await res.json();

        if (!res.ok){
            mostrarNotificacion(data.message, "red");
            console.log(data.message);
            return;
        }

        document.getElementById("email").value = "";
        document.getElementById("password").value = "";

        mostrarNotificacion("Usuario registrado con exito", "green");
    } catch(err) {
        console.error("error en la peticion: ", err);
        mostrarNotificacion("Error del servidor", "red")
    }
});

function mostrarNotificacion(texto, color) {
    const notif = document.getElementById("notificacion");
    notif.textContent = texto;

    notif.style.backgroundColor = color;

    notif.classList.add("mostrar");

    setTimeout(() => {
        notif.classList.remove("mostrar");
    }, 2000);
}