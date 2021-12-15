(function (window, document, undefined) {
  const colors = {
    empty: "white",
    visited: "cyan",
    weighted: "brown",
    wall: "black",
    start:"green",
    end : "red",
    path :"orange"
  };
  const cellTypes = ["empty", "weighted", "wall"];
  let currentType = "wall";
  let currentAlgo = null;
  let divDictionary ={};  
  let cellDictionary = {};
  let startNode = null;
  let endNode = null;
  let targetReached = false;
  function generateGid(width, height) {
    let maze = []; //node array containing node objects
    let grid = document.getElementById("grid"); // grid containing divs
    let counter = 0;
    for (let i = 0; i < height; i += height / 42) {
      let mazeRow = []; //node object row
      let row = document.createElement("div");
      row.className = "gridRow";
      for (let j = 0; j < width; j += width /89) {
        let id = "cell" +counter;
        let cellDiv = document.createElement("div");
        cellDiv.className = "cell";
        cellDiv.type = "empty";
        cellDiv.id = id;
        divDictionary[id] = cellDiv;
        row.appendChild(cellDiv);

        let cellNode = new cell(id, cellTypes[0],[]);
        mazeRow.push(cellNode);
       cellDictionary[id] = cellNode; 
        counter++;
      }
      grid.appendChild(row);
      maze.push(mazeRow);
    }
   function buildChildren(){
    const dir = [
      [0,1],
      [1,0],
      [0,-1],
      [-1,0]
  ];
    for(let i = 0 ; i < maze.length;i++){
      for(let j = 0 ; j < maze[i].length;j++){
        for(let k = 0 ; k < dir.length;k++){
            let newI = i + dir[k][0];  
            let newJ = j + dir[k][1];
            if(newI > -1 && newI <maze.length){
              if(newJ > -1 && newJ < maze[i].length){
                let node = maze[newI][newJ];
                maze[i][j].next.push(node);
              }
            }
        } 
      }
    }
  }
  buildChildren();
    return maze;
  }
  window.onload = init;
  function init() {
    //generate grid
    let width = document.body.clientWidth;
    let height = document.body.clientHeight;
    let nodeArray = generateGid(width, height);
    let grid = document.getElementById("grid");
    grid.type = currentType;
    grid.colors = colors;
    //utility clear function
      function clear(){
      targetReached = false;
      startNode = null;
      endNode = null;
      currentAlgo = null;
      Array.from(grid.getElementsByClassName("cell")).forEach((node)=>{
        cellDictionary[node.id].type = "empty"; 
        node.style.backgroundColor = colors[cellDictionary[node.id].type];
      });
    }
    //handling input
    function handleMouseInput(){
      let cellDivs = grid.getElementsByClassName("cell");
        //handling mouse down
      grid.addEventListener("mousedown",()=>{
        Array.from(cellDivs).forEach((cellDiv)=>{
          cellDiv.onmouseover = () =>{
            let cell = cellDictionary[cellDiv.id];
            cell.type = currentType;
            cellDiv.style.backgroundColor =colors[cell.type]; 
          }
        });
      })
      //handling mouse up
      grid.addEventListener("mouseup",()=>{
        Array.from(cellDivs).forEach((cellDiv)=>{
          cellDiv.onmouseover = () =>{
          }
        });
      })
    }
    window.addEventListener("keydown",(e) => {
       let val = parseInt(e.key);
       if (typeof val === "number" && !isNaN(val)) {
          currentType =  cellTypes[val - 1];
       }
      if(e.key == 'c'){
        clear();
      }
      if(e.key ==' ' || e.key == 'Spacebar'){
        if(startNode){
          if(endNode){
            if(currentAlgo){
              animate(startNode,currentAlgo);
            } else alert("cselect an algo");
          }else alert("select an end node")
        }else
          alert("select a startNode") 
      }
    });
    function startEndHandler(){
  let cells = grid.getElementsByClassName("cell");
  Array.from(cells).forEach( (cell) =>{
    cell.addEventListener('dblclick', () =>{
     if(startNode){
       if(endNode){
        let start = cellDictionary[startNode.id];
        let end = cellDictionary[endNode.id];
        start.type = "empty";
        end.type = "empty";
        divDictionary[startNode.id].style.backgroundColor = colors[startNode.type];
        divDictionary[endNode.id].style.backgroundColor = colors[endNode.type];
        startNode = null; 
        endNode = null;
       }else{
        endNode = cellDictionary[cell.id];
        cell.style.backgroundColor = "red";
        cellDictionary[endNode.id].type = "end";
       }
     }else{
      startNode = cellDictionary[cell.id];
      cellDictionary[startNode.id].type = "start";
      cell.style.backgroundColor = "green"; 
     }
    })
  }); 
    }
    function handleButtons(){
      let buttons = document.getElementsByClassName("buttons");
      Array.from(buttons).forEach((button) =>{
        button.onclick = () =>{
          currentAlgo = button.getAttribute("data-value");
        }
      });    
    } 
    async function animate(startNode,currentAlgo){
      let animator = new algoAnimator(divDictionary,colors,targetReached);
      if(currentAlgo == "depthFirstSearch"){
        let path = await animator.animateDfs(startNode);
        console.log(path);
      }else if(currentAlgo == "breadthFirstSearch"){
      animator.animateBfs([startNode]);
      }else if(currentAlgo == "aStar"){

      }else if(currentAlgo == "dijkstra's"){

      }
      /*
      for(cell in path){
        path[cell].type = "path";
        await animator.sleep(50);
        animator.update(path[cell]);
      }*/

   }
handleButtons();
startEndHandler();
handleMouseInput();
  }
})(window, document, undefined);