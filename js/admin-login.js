const tokenLogin = localStorage.getItem("token");

if(tokenLogin){
    // Si ya hay token, ir al dashboard
    window.location.href = "dashboard.html";
}

const form = document.getElementById("login-form");

// Envía email y password al endpoint de autenticación y guarda el token si OK
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
            // Si hay error del backend, lo loguea y no hace redirect
            console.log(data.message);
            return;
        }

        // Guarda token y redirige al dashboard
        localStorage.setItem("token", data.token);
        window.location.href = "dashboard.html";
    } catch (error) {
        console.error("error en la peticion: ", error);
    }
    
});