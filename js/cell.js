class cell {
  constructor(id, type, next) {
    this.id = id;
    this.type = type;
    this.next = next;
    this.distance = Infinity;
    this.weight = 0; 
  }
  getNext() {
    return this.next;
  }
  getType() {
    return this.type;
  }
  getDistance(){
    return this.distance;
  }
  getId() {
    return this.id;
  }
  getWeight(){
    return this.weight;
  }
  setWeight(weight){
    this.weight = weight;
  }
  setNext(next) {
    this.next = next;
  }
  setType(type) {
    this.type = type;
  }
  setDistance(distance){
    this.distance = distance;
  }
  setId(id) {
    this.id = id;
  }
}
