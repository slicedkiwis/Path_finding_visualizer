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
          transform: "rotate(0deg) scale(0.5)",
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
        duration: 2000,
        easing: "ease-in-out",
        delay: 0.1,
        iterations: 1,
        direction: "alternate",
      }
    );
    cellDiv.style.backgroundColor = this.colors[cell.type];
    cellDiv.style.border = `0.01vw solid ${this.colors[cell.type]}`;
    await this.sleep(time);
  }
  async generateRandomMaze() {
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
            console.log(this.nodeArray[i][j]);
            await this.update(this.nodeArray[i][j], 0.1);
          }
        }
        if (chance % 2 && this.nodeArray[k][l].type === "empty") {
          let secondChance = Math.floor(Math.random() * 100);
          if (secondChance % 2) {
            this.nodeArray[k][l].type = "wall";
            console.log(this.nodeArray[k][l]);
            await this.update(this.nodeArray[k][l], 0.1);
          }
        }
      }
    }
  }
  async generateRecursiveDivision(){

  }
  async generatePrimsAlgorithm(){

  }
  async generatreKruskalsAlgorith(){

  }
}
