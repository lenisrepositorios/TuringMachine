const gojs = go.GraphObject.make;
let automata;
let cinta ;

Automata();
crearCinta();

function Automata(){
    let nodeDataArray = [
        { key: "1", text: "q1", loc: new go.Point(250, -50), isAccept: true},
        { key: "2", text: "q2", loc: new go.Point(450, -50)},   
    ];
        
    let linkDataArray = [
        { from: "1", to: "1", text: "a, a/R\nb, a/R\na, a/L" },
        { from: "1", to: "2", text: "B, B/L" },
        { from: "2", to: "2", text: "a, a/L" },
        { from: "2", to: "1", text: "a, a/L" },
        //{ from: "2", to: "3", text: "a, a/L" },   
       // { from: "2", to: "1", text: "a, a/L" },
    ];
    
    automata = gojs(go.Diagram, "myDiagramDiv")

    automata.nodeTemplate =
        gojs(go.Node, "Auto", 
        { width: 50, height: 50},
        new go.Binding("location", "loc"),
        gojs(go.Shape, "Circle", { fill: "aqua", stroke: "black", strokeWidth: 2 }),
        gojs(go.Panel, "Auto",
        { visible: false },
        new go.Binding("visible", "isAccept"),
        gojs(go.Shape, "Circle", { fill: "null", width: 32, height: 32, strokeWidth: 1})
        ),
        gojs(go.TextBlock, { margin: 5 }, new go.Binding("text", "text"))
    );
    
    automata.linkTemplate =
        gojs(go.Link,
        gojs(go.Shape, { strokeWidth: 2}),
        gojs(go.Shape, { toArrow: "Standard", fill: null }),
        gojs(go.TextBlock, new go.Binding("text", "text"),
        { position: new go.Point(6, 6), font: "18px Poppins" }, 
          new go.Binding("text", "loc"),
          new go.Binding("segmentOffset", "", function(link) {
            if (link.from === link.to && link.to === link.from) {
              return new go.Point(0, -30);
            } else {
              return new go.Point(0, -40);
            }
          })
          )
    );
    
    automata.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
    automata.isReadOnly = true;
}

function crearCinta(){
    let nodeDataArray = [];
    for (let i = 0; i <= 50; i++) {
        nodeDataArray.push({ key: (i).toString(), text: ""});
    }

    cinta = gojs(go.Diagram, "cinta", {
        scrollMode: go.Diagram.InfiniteScroll,
        allowVerticalScroll: false
    });

    cinta.nodeTemplate = gojs(go.Node, "Auto",
        { width: 50, height: 50 },
        gojs(go.Shape, "Rectangle", { fill: "white", stroke: "black", stretch: go.GraphObject.Fill }),
        gojs(go.Shape, "Rectangle", { width: 60, height: 60, fill: "transparent", stroke: "black", strokeWidth: 2, stroke: "black"}),
        gojs(go.TextBlock, "",
            new go.Binding("text", "text"),
            { font: "bold 24px Poppins" }
        ),
    );

    let layout = gojs(go.GridLayout, {
        wrappingWidth: Infinity, 
        spacing: new go.Size(1, 1), 
        alignment: go.GridLayout.Position,
        cellSize: new go.Size(50, 50)
    });
    
    cinta.layout = layout;
    
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
        let nodeData = m.findNodeDataForKey((pos+12).toString());
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
        let nodeData = m.findNodeDataForKey((nodo).toString());
        if(nodeData.text == "b"){
            nodeData.text = "a";
            cinta.model.updateTargetBindings(nodeData);
        }
    });
}

function moverCinta(dx) {
    const {position} = cinta;
    cinta.position = new go.Point(position.x - dx, position.y);
} 

function reinicio(){
    automata.nodes.each(node => {
        node.findMainElement().stroke = "black";
        node.findMainElement().fill = "lightblue";
      });
  
    automata.links.each(link => {
      link.path.stroke = "black";
    });
}

function CambiarBporAenlaPalabra(palabra){
    for (let i = 0; i < palabra.length; i++) {
      if (palabra[i] === "b") {
        palabra = palabra.substring(0, i) + "a" + palabra.substring(i + 1);
      }
    }
    return palabra;
}

function procesarPalabra(nodoActual, inputWord, i, auxIndex, auxIndex) {
    let timeoutDelayLinks = 1000;
    let timeoutDelay = 2000;
    if (i < (inputWord.length * 2) - 2) {
      let nodoSgte = null;
      let simboloActual = "";

      if(i < inputWord.length){
        simboloActual = inputWord.charAt(i);
      }else{
        simboloActual = inputWord.charAt(auxIndex);
        auxIndex--;
      }

      automata.links.each(function(link) {
        if (link.fromNode.data.key === nodoActual.data.key){
            let transicion = link.data.text.split("\n");
            transicion.forEach(trans => {
                if(i < inputWord.length - 1){
                    if(trans[0] === simboloActual && trans[5] === "R"){
                        nodoSgte = automata.findNodeForKey(link.toNode.data.key);
                        console.log(simboloActual)
                    }
                }else{
                    if(trans[0] === simboloActual && trans[5] === "L"){
                        nodoSgte = automata.findNodeForKey(link.toNode.data.key);
                        inputWord = CambiarBporAenlaPalabra(inputWord);
                        console.log(simboloActual)   
                    }
                }
            });
        }
    });

      if (nodoSgte === null) {
          nodoActual.findMainElement().stroke = "black";
          nodoActual.findMainElement().fill = "red";
          return;
      }

      let link = null;
      automata.links.each(l => {
          if (l.fromNode === nodoActual && l.toNode === nodoSgte) {
              link = l;
              return false;
          }
      });
    
      if (link === null) {
          return;
      }

      // Colorear el nodo actual y el enlace
      nodoActual.findMainElement().stroke = "green";
      nodoActual.findMainElement().fill = "lightgreen";

      let previousNode = nodoActual;
      setTimeout(function() {
          link.path.stroke = "green";
          previousNode.findMainElement().stroke = "blue";
        }, timeoutDelayLinks);
      
      nodoActual = nodoSgte;
      i++;
      
    setTimeout(function() {
        link.path.stroke = "blue";
        if(i <= inputWord.length - 1){
            moverCinta(-50);
            setTimeout(function() {
                cambiarSimboloBPorA(i + 12);
            },500);
          }else{
          moverCinta(50);
          }
        procesarPalabra(nodoActual, inputWord, i);
      }, timeoutDelay);
    } else {
        if (nodoActual.data.isAccept) {
            nodoActual.findMainElement().stroke = "black";
            nodoActual.findMainElement().fill = "yellow";
        } else {
            nodoActual.findMainElement().stroke = "black";
            nodoActual.findMainElement().fill = "red";
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

    let currentNode = inicializarProceso(palabra);

    procesarPalabra(currentNode, inputWord, 0, inputWord.length - 1);

    localStorage.setItem(palabra, resultado);
}

function inicializarProceso(palabra) {
    agregarSimbolosALaCinta();
    reinicio();
    return automata.findNodeForKey("1");
}
  
  function rangeSlide(value){
    document.getElementById('rangeValue').innerHTML = value
  }
