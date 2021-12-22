class cell {
  constructor(id, type, next) {
    this.id = id;
    this.type = type;
    this.next = next;
    this.distance = Infinity;
    this.weight = 0;
  }
}
