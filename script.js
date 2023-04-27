var myDiagram = new go.Diagram("myDiagramDiv")
var gojs = go.GraphObject.make;

  myDiagram.model = new go.GraphLinksModel(
    [
      { key: "1" , text: "q1" , loc: new go.Point(-150, 0)},
      { key: "2" , text: "q2" , loc: new go.Point(0, 0)},
    ],
    [
      { from: "1", to: "1" , text: "b, a/R" },
      { from: "1", to: "1" , text: "a, a/R" },
      { from: "1", to: "2" , text: "B, B/L" },
      { from: "2", to: "2" , text: "a, a/L" },
      { from: "2", to: "1" , text: "B, B/R" },
    ]
  );

  myDiagram.nodeTemplate =
  gojs(go.Node, "Auto",
    gojs(go.Shape, "circle", { fill: "#33FFDD" }),
    gojs(go.TextBlock, { margin: 8 }, new go.Binding("text", "key")),

    gojs(go.Shape, "Circle", { width: 32, height: 32, fill: "transparent", strokeWidth: 1 },
      new go.Binding("visible", "", function(data) {
        return data.key === "1";
      }))
  );

  myDiagram.nodeTemplateMap.add("stack",
  gojs(go.Node, "Auto",
    { location: new go.Point(0, 0) },
    gojs(go.Shape, "Rectangle", { fill: "lightgray", stroke: null}),
    gojs(go.Panel, "Vertical",
      {
        defaultAlignment: go.Spot.Left,  // Alineación de los nodos hijos
        defaultStretch: go.GraphObject.Horizontal,  // El tamaño de los nodos hijos se estira horizontalmente
        itemTemplate:
          gojs(go.Panel, "Horizontal",
            gojs(go.Shape, "Rectangle", { width: 12, height: 12, fill: "white" }), // Representación del símbolo en la pila
            gojs(go.TextBlock, { margin: new go.Margin(4, 0, 0, 0), font: "bold 12px sans-serif" }, // Etiqueta con el símbolo
              new go.Binding("text", "key"))
          )
      },
      new go.Binding("itemArray", "stack") // Asociamos el array de elementos de la pila a la propiedad itemArray del panel
    )
  )
);

myDiagram.linkTemplate =
  gojs(go.Link,
    gojs(go.Shape),
    gojs(go.Shape, { toArrow: "Standard"}),
    gojs(go.TextBlock, { segmentOffset: new go.Point(45, -15), segmentIndex: 5 },
      new go.Binding("text", "", function(data) {
        if (data.from === "1" && data.to === "1") return data.text;

        if (data.from === "1" && data.to === "2") return data.text;

        if (data.from === "2" && data.to === "2") return data.text;

        if (data.from === "2" && data.to === "1") return data.text;

      }))
  );

  function validarPalindromoPar(palabra) {
    const pila = ["#"]; // Inicializamos la pila con el símbolo de pila inicial '#'
    let estadoActual = "p"; // El estado inicial es p
    
    for (let i = 0; i < palabra.length; i++) {
      const simboloActual = palabra[i];
      console.log(simboloActual, palabra.length)
      // Buscamos una transición para el símbolo actual desde el estado actual
      const transicion = myDiagram.model.linkDataArray.find(
        (t) => t.from === estadoActual && t.text.includes(`${simboloActual},`)
      );
  
      if (!transicion) {
        console.log("existe?")
        // No se encontró una transición válida para el símbolo actual
        return false;
      }
      console.log("sigue?")
      // Realizamos la transición sacando y agregando símbolos a la pila
      const [, sacar, agregar] = transicion.text.split("/");
      if (sacar !== "#") {
        const simboloEnPila = pila.pop();
        console.log("Valor actual de ", simboloEnPila, "y sacar: ",sacar)
        if (simboloEnPila !== sacar) {
          console.log("sigue?2: ", simboloEnPila)
          // El símbolo a sacar de la pila no coincide con el que está en la cima
          return false;
        }
        console.log("sigue?3")
      }
      if (agregar !== "#") {
        const nuevosSimbolos = agregar.split("").reverse();
        pila.push(...nuevosSimbolos);
      }
      console.log("sigue?4")
      // Actualizamos el estado actual
      estadoActual = transicion.to;
    }
  console.log("tam de pila", pila.length)
    // Llegamos al final de la palabra, ahora debemos vaciar la pila
    while (pila.length > 1) {
      const transicion = myDiagram.model.linkDataArray.find(
        (t) => t.from === estadoActual && t.text.includes(`#,`)
      );
      console.log("transicion", transicion)
      if (!transicion) {
        // No se encontró una transición válida para el símbolo #
        return false;
      }
      const [, sacar, agregar] = transicion.text.split("/");
      if (sacar !== "#") {
        const simboloEnPila = pila.pop();
        if (simboloEnPila !== sacar) {
          // El símbolo a sacar de la pila no coincide con el que está en la cima
          return false;
        }
      }
      if (agregar !== "#") {
        const nuevosSimbolos = agregar.split("").reverse();
        pila.push(...nuevosSimbolos);
      }
      estadoActual = transicion.to;
    }
    console.log("")
    // Verificamos si la palabra es palíndroma
    return palabra === palabra.split("").reverse().join("");
  }
  
  function esPalindromoPar(palabra) {
    if (palabra === '') {
      return "Palabra no ingresada";
    }
    if (palabra.length % 2 !== 0) {
      return "Palabra rechazada";
    }
    if (palabra === palabra.split('').reverse().join('')) {
      return "Palabra aceptada";
    } else {
      return "Palabra rechazada";
    }
  }
  
  
  console.log(validarPalindromoPar("aabbaa")); // true

  function sintetizarMensaje(texto, elemento) {
    let sintetizador = window.speechSynthesis;
  
    mensaje = new SpeechSynthesisUtterance(texto);
  
    sintetizador.speak(mensaje);
  
    document.getElementById(elemento).focus();
  }

  function validar() {
    const palabra = document.getElementById("palabra").value;
    const resultado = esPalindromoPar(palabra);
    const divResultado = document.getElementById("resultado");
    divResultado.innerHTML = resultado;
    localStorage.setItem(palabra, resultado)
  }
  
  function rangeSlide(value){
    document.getElementById('rangeValue').innerHTML = value
  }
