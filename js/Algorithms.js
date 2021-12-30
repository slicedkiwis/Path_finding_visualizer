class algoAnimator {
  constructor(divDictionary, nodeArray, colors, targetReached, borderColor) {
    this.targetReached = targetReached;
    this.divDictionary = divDictionary;
    this.colors = colors;
    this.borderColor = borderColor;
    this.nodeArray = nodeArray;
    this.time = 0.1;
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
          transform: "rotate(-360deg) scale(0.01)",
          background: `${interMediateColor}`,
          opacity: 0.5,
          offset: 0.3,
          border: `0.01vh solid ${this.colors[cell.type]}`,
        },
        {
          background: `${initialColor}`,
          opacity: 0.9,
          offset: 0.7,
          border: `0.01vh solid ${this.colors[cell.type]}`,
        },
        {
          borderRadius: "100%",
          transform: "rotate(-360deg) scale(1)",
          background: `${this.colors[cell.type]}`,
          opacity: 0.1,
          offset: 1,
          border: `0.01vh solid ${this.colors[cell.type]}`,
        },
      ],
      {
        duration: 800,
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
      let rgbText = `rgb(${rgb["r"] + Math.floor(Math.random() * offSet)},${
        rgb["g"] + Math.floor(Math.random() * offSet)
      },${rgb["b"] + Math.floor(Math.random() * offSet)}`;
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
      this.update(cell),this.time;
      return [cell];
    }
    cell.type = "visited";
    await this.update(cell, this.time);
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
      await this.update(curCell,this.time);
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
  // constructs the path for dijkstra function
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
  // actual dijkstra algorithm
  async animateDj(queue) {0
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
        this.update(curCell,0);
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
          await this.update(nextCell,this.time);
        }
      }
    }
  }
  async animateAstar(startNode, endNode, nodeArray) {
    function manhatanDistance(cellA, cellB) {
      return Math.abs(cellA.x - cellB.x) + Math.abs(cellA.y - cellB.y);
    }
    function makePath(previous, current) {
      let path = [];
      while (previous[current.id]) {
        current = cameFrom[current.id];
        path.push(current);
      }
      if (path.length) {
        path.push(endNode);
      }
      return path;
    }
    let openList = [];
    let cameFrom = {};
    startNode.g = 0;
    startNode.f = 0;
    openList = [startNode];
    startNode.open = true;
    while (openList.length) {
      //sorting
      openList.sort((a, b) => {
        return a.f - b.f;
      });
      //
      let node = openList.shift();
      node.closed = true;
      if (node.type === "end") {
        node.type = "visited";
        this.targetReached = true;
        return makePath(cameFrom, node);
      }
      for (let i = 0; i < node.next.length; i++) {
        let neighboor = node.next[i];
        if (neighboor.closed || neighboor.type === "wall") {
          continue;
        }
        if (neighboor.type !== "end") neighboor.type = "visited";
        this.update(neighboor,this.time);
        await this.sleep(0.1);
        let x = neighboor.x;
        let y = neighboor.y;

        let newG =
          node.g + ((x - node.x === 0) | (y - node.y === 0) ? 1 : Math.SQRT2);

        if (!neighboor.open || newG < neighboor.g) {
          neighboor.g = newG;
          neighboor.f = (node.weight * 2) + manhatanDistance(neighboor, endNode);
          cameFrom[neighboor.id] = node;
          if (!neighboor.open) {
            openList.push(neighboor);
            neighboor.open = true;
          } else {
            openList.sort((a, b) => {
              return a.f - b.f;
            });
          }
        }
      }
    }
    return [];
  }
}
