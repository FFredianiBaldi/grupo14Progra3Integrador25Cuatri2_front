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
            console.log(data.message);
            return;
        }

        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
    } catch(err) {
        console.error("error en la peticion: ", err);
    }
});