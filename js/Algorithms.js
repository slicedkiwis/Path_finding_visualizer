class algoAnimator {
  constructor(divDictionary, colors, targetReached, borderColor) {
    this.targetReached = targetReached;
    this.divDictionary = divDictionary;
    this.colors = colors;
    this.borderColor = borderColor;
  }
  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async update(cell, time) {
    let cellDiv = this.divDictionary[cell.id];
    if (cell.type == "empty")
      cellDiv.style.border = `solid 0.01vh ${this.borderColor}`;
    let red = Math.random() * 255;
    let green = Math.random() * 255;
    let blue = Math.random() * 255;
    if (cell.type != "empty") {
      let rgb = `rgb(${red},${green},${blue})`;
      cellDiv.style.backgroundColor = rgb;
      rgb = `rgb(${red},${green},${blue})`;
      cellDiv.style.backgroundColor = rgb;
      rgb = `rgb(${red},${green},${blue})`;
      cellDiv.style.backgroundColor = rgb;
      await this.sleep(0.01);
      cellDiv.style.border = `solid 0.01vh #CEFDFF`;
      cellDiv.style.backgroundColor = this.colors[cell.type];
    }

    await this.sleep(time);
  }
  async animateDfs(cell) {
    try {
      if (cell.type == "end") {
        this.targetReached = true;
        return [cell];
      }
      if (
        (cell.type != "empty" && cell.type != "end" && cell.type != "start") ||
        this.targetReached
      )
        return [];
      cell.type = "visited";
      let minPath = [];
      await this.update(cell, 0.01);
      for (Element in cell.next) {
        let path = await this.animateDfs(cell.next[Element]);
        if (path.length > 0) minPath = path;
      }
      minPath.push(cell);
      return minPath;
    } catch (e) {
      console.log(e);
    }
  }
  async modifiedDfs() {
    let cell = queue.shift();
    try {
      if (cell.type == "end") {
        this.targetReached = true;
        return [cell];
      }
      if (
        (cell.type != "empty" && cell.type != "end" && cell.type != "start") ||
        this.targetReached
      )
        return [];
      cell.type = "visited";
      let minPath = [];
      await this.update(cell, 0.01);
      sort(cell);
      for (Element in cell.next) {
        let path = await this.animateDj([cell.next[Element]]);
        if (path.length > 0) minPath = path;
      }
      minPath.push(cell);
      return minPath;
    } catch (e) {
      console.log(e);
    }
  }
  async animateBfs(queue) {
    if (queue.length === 0 || this.targetReached) return;
    let newQue = [];
    while (queue.length > 0) {
      let curCell = queue.shift();
      for (Element in curCell.next) {
        let cell = curCell.next[Element];
        if (cell.type == "empty") {
          newQue.push(cell);
          cell.type = "visited";
          await this.update(cell, 0.01);
        } else if (cell.type == "end") {
          this.targetReached = true;
        }
      }
    }
    await this.animateBfs(newQue);
  }
  async animeAstar() {}
  // dijkstra's and helper methods
  async animateDijkstra(nodeArray, startNode, endNode) {
    nodeArray = this.prepareDj(nodeArray, startNode, endNode);
    this.animateDj([startNode]);
  }
  async animateDj(queue) {
    //utility sort function
    function sort(cell) {
      cell.next.sort((a, b) => {
        let aDist = a.distance;
        let bDist = b.distance;
        if (aDist > bDist) return 1;
        if (bDist > aDist) return -1;
        return 0;
      });
    }
    while(queue.length) {
      let newQueue = [];
      let curCell = queue.shift();
      sort(curCell);
      for(Element in curCell.next){
        let nextCell = curCell.next[Element];
        if(nextCell.type === "empty"){
          newQueue.push(nextCell);
          nextCell.type = "visited";
          await this.update(nextCell);
        }
      }
      queue = newQueue;
      console.log(queue);
    }
  }
  async prepareDj(nodeArray, startNode, endNode) {
    // idea is to make a distance map of the cells in relation to the start node
    // and one in relation to the endNode, then combine them taking the smallest value for each cell, and run animateDJ on that grid
    // deep clone of the grid
    function clone(grid) {
      let newGrid = [];
      grid.forEach((row) => {
        let newRow = [];
        row.forEach((node) => {
          let newCell = new cell(node.id, node.type, node.next);
          newRow.push(newCell);
        });
        newGrid.push(newRow);
      });
      return newGrid;
    }
    let nodeArrayClone = clone(nodeArray);
    let stateSaver = clone(nodeArray);
    //setting the endNode to reference to a cell in the clone array
    let flag = false;
    for (let i = 0; i < nodeArrayClone.length; i++) {
      if (flag) break;
      for (let j = 0; j < nodeArrayClone[i].length; j++) {
        if (nodeArrayClone[i][j].id == endNode.id) {
          endNode = nodeArrayClone[i][j];
          flag = true;
          break;
        }
      }
    }
    //updating the distance
    function updateDistance() {
      //updated the integer distance value
      function updateDist(queue) {
        let newQueue = [];
        while (queue.length) {
          let curCell = queue.shift();
          if (curCell.distance == Infinity) curCell.distance = 0;
          curCell.next.forEach((nextCell) => {
            if (curCell.distance + 1 < nextCell.distance)
              nextCell.distance = curCell.distance + 1;
            if (nextCell.type != "visited") newQueue.push(nextCell);
            nextCell.type = "visited";
          });
        }
        if (newQueue.length) updateDist(newQueue);
      }
      // merges the clone and normal array
      function mergeArrays() {
        for (let i = 0; i < nodeArray.length; i++) {
          for (let j = 0; j < nodeArray[i].length; j++) {
            nodeArray[i][j].distance = Math.min(
              nodeArray[i][j].distance,
              nodeArrayClone[i][j].distance
            );
            nodeArray[i][j].type = stateSaver[i][j].type;
          }
        }
      }
      updateDist([startNode]);
      updateDist([endNode]);
      mergeArrays();
    }
    updateDistance();
    return nodeArray;
  }
}
