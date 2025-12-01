document.addEventListener("DOMContentLoaded",
    () => {
        fetch("./components/header.html")
        .then(res => res.text())
        .then(html => { 
            document.getElementById("header").innerHTML = html;
            const botonModoOscuro = document.getElementById("modo-oscuro");
            const modoGuardado = localStorage.getItem("modo");
            // Si el modo guardado es "claro", aplica la clase al body
            if (modoGuardado === "claro")
                { 
                    document.body.classList.add("tema-claro");
                } 
                botonModoOscuro.addEventListener("click", () => 
                    { 
                        // Alterna tema claro/oscuro
                        document.body.classList.toggle("tema-claro");
                        const modoActual = document.body.classList.contains("tema-claro") ? "claro" : "oscuro"; });
                    })
                    .catch(err => console.error("error cargando el header:", err));
    });
