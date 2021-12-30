class cell {
  constructor(id, type, next) {
    this.id = id;
    this.type = type;
    this.next = next;
    this.distance = Infinity;
    this.weight = 0;
    this.x = undefined;
    this.y = undefined;
    this.g = Infinity;
    this.f = Infinity;
    this.open = false;
    this.closed = false;
  }
  setLocation(location) {
    this.location = location;
  }
}
