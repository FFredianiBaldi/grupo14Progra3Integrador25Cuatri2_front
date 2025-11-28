const token = localStorage.getItem("token");

if(token){
    window.location.href = "dashboard.html";
}

const form = document.getElementById("login-form");

form.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            console.log(data.message);
            mostrarNotificacion(data.message, "red");
            return;
        }

        localStorage.setItem("token", data.token);

        localStorage.setItem("email", email);
        localStorage.setItem("password", password);

        window.location.href = "dashboard.html";
    } catch (error) {
        console.error("error en la peticion: ", error);
        mostrarNotificacion("No se pudo conectar con el servidor", "red");
    }
    
});

function autoCompletar(){
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");

    if(!email) {
        console.log("no se tienen datos guardados");
        mostrarNotificacion("no se tienen datos guardados", "red");
        return;
    }

    document.getElementById("email").value = email;
    document.getElementById("password").value = password;
}

function mostrarNotificacion(texto, color) {
    const notif = document.getElementById("notificacion");
    notif.textContent = texto;

    notif.style.backgroundColor = color;

    notif.classList.add("mostrar");

    setTimeout(() => {
        notif.classList.remove("mostrar");
    }, 2000);
}