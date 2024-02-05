export class Item {
  constructor(itemType) {
    this.x = 5;
    this.y = 5;
    this.itemType = itemType;
  }
  setX(x){
    this.x=x;
  }
  setY(y){
    this.y=y;
  }
  setXY(xyPair){
    this.x=xyPair[0];
    this.y=xyPair[1];
  }
  setXYifNew(xyPair){
    if(xyPair[0]!==this.x || xyPair[1]!==this.y){
      this.setXY(xyPair);
      return true;
    }
    return false;
  }
  getX(){
    return this.x;
  }
  getY(){
    return this.y;
  }
  getXY(){
    return [this.x, this.y];
  }
}

export class Obstacle extends Item {
  constructor(itemType, id) {
    super(itemType);
    this.isOn = true;
    this.id = id;
  }
  turnOff(){
    this.isOn = false;
  }
  turnOn() {
    this.isOn = true;
  }
}