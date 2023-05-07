var idiomas = {
    es: {
      app: {
        Menu:"Menu",
        h2I:"Idioma",
        h2II:"Diagramas",
        Secuencial:"Secuencial",
        historialboton:"Historial",
        titulo: "Máquina de Turing",
        barraDelLenguaje: "Ingresa aquí:",
        validador: "Validar",
        Mvelocidad: "Velocidad"
      },
      
    },
    en: {
      app: {
        Menu:"Menu",
        h2I:"Languaje",
        h2II:"Diagrams",
        Secuencial:"Sequential",
        historialboton:"history",
        titulo: "Turing Machine",
        barraDelLenguaje: "Enter here:",
        validador: "Validate",
        Mvelocidad: "Speed",
        
      },
      
    },
    pt: {
      app: {
        Menu:"Menu",
        h2I:"língua",
        h2II:"Diagramas",
        Secuencial:"Sequencial",
        historialboton:"história",
        titulo: "Máquina de Turing",
        barraDelLenguaje: "Entrar aqui:",
        validador: "Validar",
        Mvelocidad: "Velocidade"
      },
      
    }
  };

  function cambiarIdioma(idioma) {
    var datosDeIdioma = idiomas[idioma].app;
  
    document.querySelector("#Menu").textContent = datosDeIdioma.Menu;
    document.querySelector("#h2I").textContent = datosDeIdioma.h2I;
    document.querySelector("#h2II").textContent = datosDeIdioma.h2II;
    document.querySelector("#Secuencial").textContent = datosDeIdioma.Secuencial;
    document.querySelector("#titulo").textContent = datosDeIdioma.titulo;
    document.querySelector("#barraDelLenguaje").textContent = datosDeIdioma.barraDelLenguaje;
    document.querySelector("#validador").textContent = datosDeIdioma.validador;
    document.querySelector("#Mvelocidad").textContent = datosDeIdioma.Mvelocidad;
    
    
    document.querySelectorAll("#menuIdioma li").forEach(function(li) {
      li.classList.remove("active");
    });
    document.querySelector("#menuIdioma li a[href='/" + idioma + "']").parentNode.classList.add("active");
    
  }
  
  document.querySelectorAll("#menuIdioma li a").forEach(function(enlace) {
    enlace.addEventListener("click", function(e) {
      e.preventDefault();
      cambiarIdioma(enlace.getAttribute("data-idioma"));
    });
  });
