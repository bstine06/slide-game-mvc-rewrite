export class Item {
  constructor(boardSize, itemType) {
    // this.gameDomElement = document.getElementById("game");
    this.x = 5;
    this.y = 5;
    this.itemType = itemType;
    // this.node = document.createElement("div");
    // this.style = this.node.style;
    // this.node.classList.add(itemType);
    // this.displayWithAnimation();
    // this.updateDisplay();
    // this.style.width = (100/this.boardSize)+"%";
    // this.style.height = (100/this.boardSize)+"%";
  }
  // updateDisplay() {
  //   this.style.left= this.x * (100/this.boardSize) + "%";
  //   this.style.top = this.y * (100/this.boardSize) + "%";
  // }
  setX(x){
    this.x=x;
    // this.updateDisplay();
  }
  setY(y){
    this.y=y;
    // this.updateDisplay();
  }
  setXY(xyPair){
    this.x=xyPair[0];
    this.y=xyPair[1];
    // this.updateDisplay();
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