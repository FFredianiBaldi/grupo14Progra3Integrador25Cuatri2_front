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
            return;
        }

        localStorage.setItem("token", data.token);

        window.location.href = "dashboard.html";
    } catch (error) {
        console.error("error en la peticion: ", error);
    }
    
});