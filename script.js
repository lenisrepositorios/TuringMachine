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
