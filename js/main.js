(function (window, document, undefined) {
  let borderColor = "#BDEDE0";
  const colors = {
    empty: "#FFFFFF",
    visited: "#89CFF0", //"#ADD8E6",
    weighted: "brown",
    wall: "#262730",
    start: "#45CB85",
    end: "#C65B7C",
    path: "orange",
  };
  const cellTypes = ["empty", "wall"];
  const WIDTH_RATIO = //20 
  //89
  61
  ;
  const HEIGHT_RATIO = //
  //42
 28 
  ;
  let currentType = "wall";
  let currentAlgo = null;
  let divDictionary = {};
  let cellDictionary = {};
  let startNode = null;
  let endNode = null;
  let targetReached = false;
  function generateGid(width, height) {
    let maze = []; //node array containing node objects
    let grid = document.getElementById("grid"); // grid containing divs
    let counter = 0;
    for (let i = 0, l = 0; i < height; i += Math.floor(height / HEIGHT_RATIO, l++)) {
      let mazeRow = []; //node object row
      let row = document.createElement("div");
      row.className = "gridRow";
      for (let j = 0, k = 0; j < width; j += Math.floor(width / WIDTH_RATIO),k++) {
        let id = "cell" + counter;
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
        cellNode.setLocation([l,k]); 
      }
      grid.appendChild(row);
      maze.push(mazeRow);
    }
    function buildChildren() {
      const dir = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
      ];
      for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {
          for (let k = 0; k < dir.length; k++) {
            let newI = i + dir[k][0];
            let newJ = j + dir[k][1];
            if (newI > -1 && newI < maze.length) {
              if (newJ > -1 && newJ < maze[i].length) {
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
    function clear() {
      let currentType = "wall";
      let currentAlgo = null;
      let startNode = null;
      let endNode = null;
      let targetReached = false;
      targetReached = false;
      startNode = null;
      endNode = null;
      currentAlgo = null;
      Array.from(grid.getElementsByClassName("cell")).forEach((node) => {
        cellDictionary[node.id].type = "empty";
        cellDictionary[node.id].distance = Infinity;
        cellDictionary[node.id].weight = 0;
        node.style.backgroundColor = colors[cellDictionary[node.id].type];
        node.style.border = "solid 0.01vh #BDEDE0";
      });
    }
    //handling input
    function inputHandler() {
      function handleMouseInput() {
        let cellDivs = grid.getElementsByClassName("cell");
        //handling mouse down
        grid.addEventListener("mousedown", () => {
          Array.from(cellDivs).forEach((cellDiv) => {
            cellDiv.onmouseover = () => {
              let cell = cellDictionary[cellDiv.id];
              cell.type = currentType;
              cellDiv.style.backgroundColor = colors[cell.type];
              if (cell.type != "empty")
                cellDiv.style.border = `solid 0.01vh ${colors[cell.type]}`;
              else cellDiv.style.border = `solid 0.01vh ${borderColor}`;
            };
          });
        });
        //handling mouse up
        grid.addEventListener("mouseup", () => {
          Array.from(cellDivs).forEach((cellDiv) => {
            cellDiv.onmouseover = () => {};
          });
        });
      }
      window.addEventListener("keydown", (e) => {
        let val = parseInt(e.key);
        if (typeof val === "number" && !isNaN(val)) {
          currentType = cellTypes[val % cellTypes.length];
        }
        if (e.key == "c") {
          clear();
        }
        if (e.key == " " || e.key == "Spacebar") {
          if (startNode) {
            if (endNode) {
              if (currentAlgo) {
                animate(startNode, currentAlgo);
              } else alert("cselect an algo");
            } else alert("select an end node");
          } else alert("select a startNode");
        }
      });
      function handleNavigationButtons() {
        let buttons = document.getElementsByClassName("buttons");
        Array.from(buttons).forEach((button) => {
          button.onclick = () => {
            currentAlgo = button.getAttribute("data-value");
          };
        });
      }
      handleNavigationButtons();
      handleMouseInput();
    }
    // handling the start and end node selection
    function startEndHandler() {
      let cells = grid.getElementsByClassName("cell");
      Array.from(cells).forEach((cell) => {
        cell.addEventListener("dblclick", () => {
          if (startNode) {
            if (endNode) {
              let start = cellDictionary[startNode.id];
              let end = cellDictionary[endNode.id];
              start.type = "empty";
              start.distance =  Infinity;
              end.type = "empty";
              divDictionary[startNode.id].style.backgroundColor =
                colors[startNode.type];
              divDictionary[endNode.id].style.backgroundColor =
                colors[endNode.type];
              divDictionary[
                endNode.id
              ].style.border = `solid 0.1vh ${borderColor}`;
              divDictionary[
                startNode.id
              ].style.border = `solid 0.1vh ${borderColor}`;
              startNode = null;
              endNode = null;
            } else {
              endNode = cellDictionary[cell.id];
              cell.style.backgroundColor = colors["end"];
              cellDictionary[endNode.id].type = "end";
              cell.style.border = "none";
              divDictionary[
                endNode.id
              ].style.border = `solid 0.1vh ${(divDictionary[
                endNode.id
              ].style.backgroundColor = colors[endNode.type])}`;
            }
          } else {
            startNode = cellDictionary[cell.id];
            startNode.distance = 0;
            cellDictionary[startNode.id].type = "start";
            cell.style.backgroundColor = colors["start"];
            cell.style.border = "none";
            divDictionary[startNode.id].style.border = `solid 0.1vh ${(divDictionary[startNode.id].style.backgroundColor = colors[startNode.type])}`;
          }
        });
      });
    }
    // function that animates the visualizer
    async function animate(startNode, currentAlgo) {
      let path = [];
      let animator = new algoAnimator(
        divDictionary,
        nodeArray,
        colors,
        targetReached,
        borderColor
      );
      if (currentAlgo == "depthFirstSearch") {
        path = await animator.animateDfs(startNode);
      } else if (currentAlgo == "breadthFirstSearch") {
        path = await animator.animateBfs([startNode],startNode,endNode);
      } else if (currentAlgo == "aStar") {
      } else if (currentAlgo == "dijkstra's") {
        path = await animator.animateDijkstra(nodeArray, startNode, endNode);
      }
      for(cell in path){
        path[cell].type = "path";
        await animator.sleep(0.1);
        animator.update(path[cell]);
      }
      console.log(path);
    }
    /// calling funcitons
    inputHandler();
    startEndHandler();
  }
})(window, document, undefined);
