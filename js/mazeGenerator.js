class mazeGenerator {
  constructor(divDictionary, nodeArray, colors) {
    this.divDictionary = divDictionary;
    this.nodeArray = nodeArray;
    this.colors = colors;
  }
  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async update(cell, time) {
    let cellDiv = this.divDictionary[cell.id];
    cellDiv.animate(
      [
        {
          borderRadius: "10px",
          transform: "rotate(-180deg) scale(0.5)",
          background: `black`,
          offset: 0.5,
          border: `0.01vh solid ${this.colors[cell.type]}`,
        },
        {
          borderRadius: "50px",
          transform: "rotate(360deg) scale(1)",
          background: `black`,
          offset: 1,
          border: `0.01vh solid ${this.colors[cell.type]}`,
        },
      ],
      {
        duration: 1500,
        easing: "ease-in-out",
        delay: 0.1,
        iterations: 1,
        direction: "alternate",
      }
    );
    cellDiv.style.backgroundColor = this.colors[cell.type];
    cellDiv.style.border = `0.01vw solid ${this.colors[cell.type]}`;
  }
  clear() {
    this.nodeArray.forEach((row) => {
      row.forEach((cell) => {
        if (cell.type === "wall") {
          let cellDiv = this.divDictionary[cell.id];
          cell.type = "empty";
          cellDiv.style.backgroundColor = this.colors[cell.type];
          cellDiv.style.border = `0.01vw solid ${this.colors["border"]}`;
        }
      });
    });
  }
  async generateRandomMaze() {
    this.clear();
    for (let i = 0, k = this.nodeArray.length - 1; i <= k; i++, k--) {
      for (
        let j = 0, l = this.nodeArray[k].length - 1;
        j < this.nodeArray[i].length, l > 0;
        j++, l--
      ) {
        let chance = Math.floor(Math.random() * 100);
        if (chance % 2 && this.nodeArray[i][j].type === "empty") {
          let secondChance = Math.floor(Math.random() * 100);
          if (secondChance % 2) {
            this.nodeArray[i][j].type = "wall";
            await this.update(this.nodeArray[i][j], 0.1);
          }
        }
        if (chance % 2 && this.nodeArray[k][l].type === "empty") {
          let secondChance = Math.floor(Math.random() * 100);
          if (secondChance % 2) {
            this.nodeArray[k][l].type = "wall";
            await this.update(this.nodeArray[k][l], 0.1);
          }
        }
      }
    }
  }
  async generateRecursiveDivision() {
    this.clear();
    let gridHeight = this.nodeArray.length;
    let gridWidth = this.nodeArray[0].length;
    let walls = [];
    function chooseOrientation(width, height) {
      if (width < height) return 1;
      else return 0;
    }
    function rand(value) {
      return Math.floor(Math.random() * value);
    }
    function divide(grid, x, y, width, height, orientation) {
      if (width <= 4 || height <= 4) return;
      //location of wall
      let wallX =
        x + (orientation ? 0 : width === 2 ? 1 : Math.floor(width / 2));
      let wallY =
        y + (orientation ? (height === 2 ? 1 : Math.floor(height / 2)) : 0);
      // location of hole
      let holeX = wallX + (orientation ? rand(width) : 0);
      let holeY = wallY + (orientation ? 0 : rand(height));
      let holeX2 = wallX + (orientation ? rand(width) : 0);
      let holeY2 = wallY + (orientation ? 0 : rand(height));

      // direction of wall;
      let directionX = orientation ? 1 : 0;
      let directionY = orientation ? 0 : 1;
      let wallLength = orientation ? width : height;
      while (wallLength--) {
        if (
          (holeX != wallX || holeY != wallY) &&
          (holeX2 != wallX || holeY2 != wallY)
        ) {
          if (
            grid[wallX][wallY].type === "empty" 
          )
            walls.push(grid[wallX][wallY]);
        } else {
          grid[wallX][wallY].type = "path";
        }

        wallX += directionX;
        wallY += directionY;
      }
      let newX = x;
      let newY = y;

      let newWidth = orientation ? width : wallX - x + 1;
      let newHeight = orientation ? wallY - y + 1 : height;
      divide(
        grid,
        newX,
        newY,
        newWidth,
        newHeight,
        chooseOrientation(newWidth, newHeight)
      );

      newX = orientation ? x : wallX + 1;
      newY = orientation ? wallY + 1 : y;
      newWidth = orientation ? width : x + width - wallX - 1;
      newHeight = orientation ? y + height - wallY - 1 : height;
      divide(
        grid,
        newX,
        newY,
        newWidth,
        newHeight,
        chooseOrientation(newWidth, newHeight)
      );
    }

    divide(
      this.nodeArray,
      0,
      0,
      gridHeight,
      gridWidth,
      chooseOrientation(gridWidth, gridHeight)
    );
    for (Element in walls) {
      let cell = walls[Element];
      cell.type = "wall";
      this.update(cell);
      await this.sleep(0.1);
    }
   this.nodeArray.forEach(row =>{
       row.forEach(cell =>{
           if(cell.type === "path") cell.type = "empty";
       })
   }); 
  }
  async generatePrimsAlgorithm() {}
  async generatreKruskalsAlgorith() {}
}
