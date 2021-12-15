class cell {
  constructor(id, type, next) {
    this.id = id;
    this.type = type;
    this.next = next;
  }
  getNext() {
    return this.next;
  }
  getType() {
    return this.type;
  }
  getId() {
    return this.id;
  }
  setNext(next) {
    this.next = next;
  }
  setType(type) {
    this.type = type;
  }
  setId(id) {
    this.id = id;
  }
}
