class algoAnimator {
  constructor(divDictionary, colors, targetReached,borderColor) {
    this.targetReached = targetReached;
    this.divDictionary = divDictionary;
    this.colors = colors;
    this.borderColor = borderColor;
  }
  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async update(cell,time) {
    let cellDiv = this.divDictionary[cell.id];
    cellDiv.style.backgroundColor = this.colors[cell.type];
    if(cell.type != "empty")cellDiv.style.border =  `solid 0.01vh #CEFDFF`;
    else  cellDiv.style.border =  `solid 0.01vh ${this.borderColor}`;
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
      await this.update(cell,20);
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
  async animateBfs(queue) {
    if (queue.length === 0 || this.targetReached) return;
    let newQue = [];
    while (queue.length > 0) {
      let curCell = queue.shift();
      console.log(curCell);
      for (Element in curCell.next) {
        let cell = curCell.next[Element];
        if (cell.type == "empty") {
          newQue.push(cell);
          cell.type = "visited";
          await this.update(cell,1);
        } else if (cell.type == "end") {
          this.targetReached = true;
        }
      }
    }
    await this.animateBfs(newQue);
  }
  async animeAstar(){
    
  }
  async animeDj(){

  }
}
