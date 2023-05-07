const gojs = go.GraphObject.make;
let automata;
let cinta ;

Automata();
crearCinta();

function Automata(){
    let nodeDataArray = [
        { key: "1", text: "q1", loc: new go.Point(250, -50), isAccept: true},
        { key: "2", text: "q2", loc: new go.Point(550, -50)},
    ];
        
    let linkDataArray = [
        { from: "1", to: "1", text: "a, a/R\nb, a/R" },
        { from: "1", to: "2", text: "B, B/L" },
        { from: "2", to: "2", text: "a, a/L" },
        { from: "2", to: "1", text: "B, B/R" },
    ];
    
    automata = gojs(go.Diagram, "myDiagramDiv")
    
    // Creamos el layout de los nodos
    automata.nodeTemplate =
        gojs(go.Node, "Auto", 
        { width: 50, height: 50},
        new go.Binding("location", "loc"),
        gojs(go.Shape, "Circle", { fill: "white", stroke: "black", strokeWidth: 2 }),
        gojs(go.Panel, "Auto",
        { visible: false },
        new go.Binding("visible", "isAccept"),
        gojs(go.Shape, "Circle", { fill: "null", width: 32, height: 32, strokeWidth: 1})
        ),
        gojs(go.TextBlock, { margin: 5 }, new go.Binding("text", "text"))
    );
    
    // Creamos el layout de las conexiones
    automata.linkTemplate =
        gojs(go.Link,
        gojs(go.Shape, { strokeWidth: 2}),
        gojs(go.Shape, { toArrow: "Standard", fill: null }),
        gojs(go.TextBlock, new go.Binding("text", "text"),
        { position: new go.Point(6, 6), font: "13pt sans-serif" }, 
          new go.Binding("text", "loc"),
          new go.Binding("segmentOffset", "", function(link) {
            if (link.from === "0" && link.to === "0") {
              return new go.Point(0, -30);
            } else {
              return new go.Point(0, -20);
            }
          })
          )
    );
    
    // Agregar los datos al autómata
    automata.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
    automata.isReadOnly = true;
}

function crearCinta(){
    let nodeDataArray = [];
    for (let i = 0; i <= 30; i++) {
        nodeDataArray.push({ key: (i).toString(), text: ""});
    }

    
    cinta = gojs(go.Diagram, "cinta", {
        scrollMode: go.Diagram.InfiniteScroll,
        allowVerticalScroll: false
    });

    // Creamos el layout de los nodos
    cinta.nodeTemplate = gojs(go.Node, "Auto",
        { width: 50, height: 50 },
        // go.Binding("location", "loc"),
        gojs(go.Shape, "Rectangle", { fill: "white", stroke: "black", stretch: go.GraphObject.Fill }),  // Establecer stretch a Fill
        gojs(go.TextBlock, "",
            new go.Binding("text", "text"),
            { font: "bold 16px Verdana" }
        ),
    );

    // Creamos el layout de la cinta
    let layout = gojs(go.GridLayout, {
        wrappingWidth: Infinity,  // colocar todos los nodos en una fila
        spacing: new go.Size(1, 1),  // espacio entre los nodos
        alignment: go.GridLayout.Position,
        cellSize: new go.Size(50, 50)  // tamaño de celda
    });
    
    // asignamos el layout a la cinta
    cinta.layout = layout;
    
    // Agregamos los datos a la cinta
    cinta.model = new go.GraphLinksModel(nodeDataArray);
    cinta.isReadOnly = true;

}

function eliminarSimbolos(){
    cinta.model.commit(function(m){
        for (let i = 0; i <= 30; i++) {
            let nodeData = m.findNodeDataForKey(i.toString());
            nodeData.text = "";
            cinta.model.updateTargetBindings(nodeData);
        }
    });
}

function agregarSimbolos(pos, x){
    cinta.model.commit(function(m){
        let nodeData = m.findNodeDataForKey((pos + 14).toString());
        nodeData.text = x;
        cinta.model.updateTargetBindings(nodeData);
    });
}

function agregarSimbolosALaCinta(){
    eliminarSimbolos();
    const texto = document.getElementById("palabra").value;
    const textoAux = texto + " ";
    for (let i = 0; i < textoAux.length; i++) {
        simbolo = textoAux.charAt(i);
        agregarSimbolos(i, simbolo);
    }
}

function cambiarSimboloBPorA(nodo){
    cinta.model.commit(function(m){
        let nodeData = m.findNodeDataForKey(nodo.toString());
        if(nodeData.text == "b"){
            nodeData.text = "a";
            cinta.model.updateTargetBindings(nodeData);
        }
    });
}

function scrollCinta(dx) {
    var position = cinta.position;
    cinta.position = new go.Point(position.x - dx, position.y);
} 

function reiniciarColoresDeNodosYEnlaces(){
    automata.nodes.each(function(node) {
        node.findMainElement().stroke = "black";
        node.findMainElement().fill = "lightblue";
      });
  
    automata.links.each(function(link) {
      link.path.stroke = "black";
      link.path.strokeDashArray = [];
    });
}

function reemplazarSimboloEnPalabra(palabra){
    for (let i = 0; i < palabra.length; i++) {
      if (palabra[i] === "b") {
        palabra = palabra.substring(0, i) + "a" + palabra.substring(i + 1);
      }
    }
    return palabra;
}



function recorrerAutomata() {
    //let timeoutDelayLinks = 1000;
    //let timeoutDelay = 2000;
    let inputWor = document.getElementById("texto").value;
    let inputWord = inputWor + "B";
    let currentNode = automata.findNodeForKey("0");
    let i = 0;
    let auxIndex = inputWord.length - 1;

    reiniciarColoresDeNodosYEnlaces();
    procesarSiguienteCaracter(currentNode, inputWord, i, auxIndex);
}

function procesarSiguienteCaracter(currentNode, inputWord, i, auxIndex, auxIndex) {
    let timeoutDelayLinks = 1000;
    let timeoutDelay = 2000;
    if (i < (inputWord.length * 2) - 2) {
      let nextNode = null;
      let currentChar = "";

      if(i < inputWord.length){
        currentChar = inputWord.charAt(i);
      }else{
        currentChar = inputWord.charAt(auxIndex);
        auxIndex--;
      }

      automata.links.each(function(link) {
        if (link.fromNode.data.key === currentNode.data.key){
            let transicion = link.data.text.split("\n");
            transicion.forEach(trans => {
                if(i < inputWord.length - 1){
                    if(trans[0] === currentChar && trans[5] === "R"){
                        nextNode = automata.findNodeForKey(link.toNode.data.key);
                    }
                }else{
                    if(trans[0] === currentChar && trans[5] === "L"){
                        nextNode = automata.findNodeForKey(link.toNode.data.key);
                        inputWord = reemplazarSimboloEnPalabra(inputWord);
                    }
                }
            });
        }
    });

      if (nextNode === null) {
          currentNode.findMainElement().stroke = "black";
          currentNode.findMainElement().fill = "red";
          console.log("No se encontró el siguiente nodo");
          return;
      }

      let link = null;
      automata.links.each(function(l) {
          if (l.fromNode === currentNode && l.toNode === nextNode) {
              link = l;
              return false;
          }
      });
    
      if (link === null) {
          return;
      }

      // Colorear el nodo actual y el enlace
      currentNode.findMainElement().stroke = "green";
      currentNode.findMainElement().fill = "lightgreen";

      let previousNode = currentNode;
      setTimeout(function() {
          link.path.stroke = "green";
          link.path.strokeDashArray = [4, 2];
          previousNode.findMainElement().stroke = "blue";
        }, timeoutDelayLinks);
      
      // Actualizar nodo actual y contador
      currentNode = nextNode;
      i++;
      
    // Colorear enlace anterior rojo al pasar al siguiente nodo
    setTimeout(function() {
        link.path.stroke = "red";
        if(i <= inputWord.length - 1){
            scrollCinta(-50);
            setTimeout(function() {
                cambiarSimboloBPorA(i + 14);
            },500);
          }else{
          scrollCinta(50);
          }
        procesarSiguienteCaracter(currentNode, inputWord, i);
      }, timeoutDelay);
    } else {
        // Verificar si el nodo actual es un estado de aceptación
        if (currentNode.data.isAccept) {
            currentNode.findMainElement().stroke = "red";
            currentNode.findMainElement().fill = "yellow";
            /*setTimeout(function() {
              mostrarModal(true);
            }, 1000);*/
        } else {
            currentNode.findMainElement().stroke = "black";
            currentNode.findMainElement().fill = "red";
            /*setTimeout(function() {
              mostrarModal(false);
            }, 1000);*/
        }
    }
}
  

  function sintetizarMensaje(texto, elemento) {
    let sintetizador = window.speechSynthesis;
  
    mensaje = new SpeechSynthesisUtterance(texto);
  
    sintetizador.speak(mensaje);
  
    document.getElementById(elemento).focus();
  }

  function validar() {
    const palabra = document.getElementById("palabra").value;
    let inputWord = palabra + "B";
    let currentNode = automata.findNodeForKey("1");
    let i = 0;
    let auxIndex = inputWord.length - 1;

    agregarSimbolosALaCinta();
    reiniciarColoresDeNodosYEnlaces();
    procesarSiguienteCaracter(currentNode, inputWord, i, auxIndex, auxIndex);
    localStorage.setItem(palabra, resultado);
  }
  
  function rangeSlide(value){
    document.getElementById('rangeValue').innerHTML = value
  }
