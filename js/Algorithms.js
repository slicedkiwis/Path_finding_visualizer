class algoAnimator {
  constructor(divDictionary, nodeArray, colors, targetReached, borderColor) {
    this.targetReached = targetReached;
    this.divDictionary = divDictionary;
    this.colors = colors;
    this.borderColor = borderColor;
    this.nodeArray = nodeArray;
  }
  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async update(cell, time) {
    let cellDiv = this.divDictionary[cell.id];
    let interMediateColor = "#394053";
    let initialColor = "#442234";
    cellDiv.animate(
      [
        {
          borderRadius: "10px",
          transform: "rotate(-180deg) scale(0.5)",
          background: `${interMediateColor}`,
          opacity: 0.8,
          offset: 0.1,
          border: `0.01vh solid ${this.colors[cell.type]}`,
        },
        {
          background: `${initialColor}`,
          opacity: 0.9,
          offset: 0.5,
          border: `0.01vh solid ${this.colors[cell.type]}`,
        },
        {
          borderRadius: "10px",
          transform: "rotate(-360deg) scale(1)",
          background: `${this.colors[cell.type]}`,
          opacity: 0.9,
          offset: 1,
          border: `0.01vh solid ${this.colors[cell.type]}`,
        },
      ],
      {
        duration: 400,
        easing: "ease-in-out",
        delay: 0.1,
        iterations: 1,
        direction: "alternate",
      }
    );
    cellDiv.style.backgroundColor = this.colors[cell.type];

    if (cell.type === "empty")
      cellDiv.style.border = `1px solid ${this.borderColor}`;
    else {
      let rgb = hexToRgb(this.colors[cell.type]);
      let offSet = 200;
      let rgbText = `rgb(${rgb['r']+Math.floor(Math.random() * offSet)},${rgb['g'] + Math.floor(Math.random() * offSet)},${rgb['b'] + Math.floor(Math.random() * offSet)}`;
      console.log(rgbText);
      cellDiv.style.border = `1px solid ${rgbText}`;
    }
    function hexToRgb(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : null;
    }
    await this.sleep(time);
  }
  async animateDfs(cell) {
    if (cell.type === "end") {
      this.targetReached = true;
      cell.type = "visited";
      this.update(cell);
      return [cell];
    }
    cell.type = "visited";
    await this.update(cell, 0.1);
    let path = [];
    for (Element in cell.next) {
      let nextCell = cell.next[Element];
      if (
        !this.targetReached &&
        (nextCell.type === "empty" || nextCell.type === "end")
      ) {
        let newPath = await this.animateDfs(nextCell);
        if (newPath.length + 1 < path.length) {
          path = newPath;
          path.push(cell);
        } else if (path.length === 0) {
          path = newPath;
          if (path.length !== 0) {
            path.push(cell);
          }
        }
      }
    }
    return path;
  }
  async modifiedDfs() {
    this.prepareModDfs();
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
  async animateBfs(queue, start, end) {
    let prev = [];
    for (let i = 0; i < this.nodeArray.length; i++) {
      let row = [];
      for (let j = 0; j < this.nodeArray.length; j++) {
        row.push([Infinity, Infinity]);
      }
      prev.push(row);
    }
    while (queue.length != 0 && !this.targetReached) {
      let curCell = queue.shift();
      curCell.type = "visited";
      for (Element in curCell.next) {
        let nextCell = curCell.next[Element];
        if (nextCell.type === "visited" || nextCell.type === "wall") continue;
        let i = nextCell.location[0];
        let j = nextCell.location[1];
        prev[i][j] = curCell.location;
        if (nextCell.type === "end") this.targetReached = true;
        queue.push(nextCell);
        nextCell.type = "visited";
      }
      await this.update(curCell);
    }
    let path = [];
    if (this.targetReached) {
      let i = end.location[0];
      let j = end.location[1];
      while (i != start.location[0] || j != start.location[1]) {
        path.push(this.nodeArray[i][j]);
        let curLocation = prev[i][j];
        i = curLocation[0];
        j = curLocation[1];
      }
    }
    return path;
  }
  async animateDijkstra(nodeArray, startNode, endNode) {
    let path = [];
    let prev = await this.animateDj([startNode]);
    if (this.targetReached) {
      let i = endNode.location[0];
      let j = endNode.location[1];
      while (i != startNode.location[0] || j != startNode.location[1]) {
        path.push(this.nodeArray[i][j]);
        let curLocation = prev[i][j];
        i = curLocation[0];
        j = curLocation[1];
      }
    }
    return path;
  }
  async animateDj(queue) {
    function sort(cells) {
      cells.sort((a, b) => {
        let aDist = a.distance;
        let bDist = b.distance;
        if (aDist > bDist) return 1;
        if (bDist > aDist) return -1;
        return 0;
      });
    }
    let prev = [];
    for (let i = 0; i < this.nodeArray.length; i++) {
      let row = [];
      for (let j = 0; j < this.nodeArray.length; j++) {
        row.push([Infinity, Infinity]);
      }
      prev.push(row);
    }
    while (queue.length != 0) {
      sort(queue);
      let curCell = queue.shift();
      if (curCell.type === "start") {
        curCell.type = "visited";
        this.update(curCell, 0);
      }
      for (Element in curCell.next) {
        let nextCell = curCell.next[Element];
        if (nextCell.type === "visited" || nextCell.type === "wall") continue;
        // preform relaxtion update distance to current node.
        if (
          curCell.distance + 1 + curCell.weight <
          nextCell.distance + nextCell.weight
        ) {
          nextCell.distance = curCell.distance + 1;
          let i = nextCell.location[0];
          let j = nextCell.location[1];
          prev[i][j] = curCell.location;
          queue.push(nextCell);
          if (nextCell.type === "end") {
            this.targetReached = true;
            nextCell.type = "visited";
            return prev;
          }
          nextCell.type = "visited";
          await this.update(nextCell);
        }
      }
    }
  }
  async prepareModDfs(nodeArray, startNode, endNode) {
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
