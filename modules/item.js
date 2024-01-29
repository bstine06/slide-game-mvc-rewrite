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

  // eraseWithAnimation(){
  //   this.node.classList.add("outgoing-animation");
  //   setTimeout(() => {
  //     this.node.parentNode.removeChild(this.node);
  //     this.node.classList.remove("outgoing-animation");
  //   }, "280");
  // }
  // displayWithAnimation(){
  //   this.node.classList.add("incoming-animation");
  //   this.gameDomElement.appendChild(this.node);
  //   setTimeout(() => {
  //     this.node.classList.remove("incoming-animation");
  //   }, "280");
  // }
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