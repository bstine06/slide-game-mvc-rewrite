import { Item } from './item.js';

export class Board {
  constructor() {
    this.size;
    this.countObstacles;
    this.obstacles = [];
    this.resetToThisState;
  }
  generateRandomBoard(size, countObstacles) {
    this.size = size;
    this.countObstacles = countObstacles;
    this.player = new Item(size, "player");
    this.finish = new Item(size, "finish");
    for (let i=0; i<this.countObstacles; i++) {
      let newObstacle = new Item(this.size, "obstacle");
      newObstacle.setXY(this.findRandomUnoccupiedCoordinates());
      this.obstacles.push(newObstacle);
    }
    this.obstacles.sort((a, b) => {
      if (a.x !== b.x) {
        return a.x - b.x;
      } else {
        return a.y - b.y;
      }
    });
    this.player.setXY(this.findRandomUnoccupiedCoordinates());
    this.finish.setXY(this.findRandomUnoccupiedCoordinates());
    this.resetToThisState = [this.obstacles, this.player.getXY(), this.finish.getXY()];
  }




  findAvailableMoves(currentXY, board) {
    let availableMoves = [];
    availableMoves.push(this.findLeftMoveDestination(currentXY));
    availableMoves.push(this.findRightMoveDestination(currentXY));
    availableMoves.push(this.findUpMoveDestination(currentXY));
    availableMoves.push(this.findDownMoveDestination(currentXY));
    availableMoves = availableMoves.filter(xy => !xy.every((value, index) => value === currentXY[index]));
    console.table(availableMoves);
  }


  findLeftMoveDestination(currentXY) {
    return [this.getObstacleXYs().concat([[this.finish.getX()-1, this.finish.getY()]])
                          .filter(obstacleXY => obstacleXY[1] === currentXY[1] && obstacleXY[0] < currentXY[0])
                          .concat([[-1, currentXY[1]]])
                          .sort((a,b) => (a[0]<b[0]) ? 1 : -1)
                          [0][0]+1,currentXY[1]];
  }
  findRightMoveDestination(currentXY) {
    return [this.getObstacleXYs().concat([[this.finish.getX()+1, this.finish.getY()]])
                          .filter(obstacleXY => obstacleXY[1] === currentXY[1] && obstacleXY[0] > currentXY[0])
                          .concat([[this.size, currentXY[1]]])
                          .sort((a,b) => (a[0]>b[0]) ? 1 : -1)
                          [0][0]-1,currentXY[1]];
  }
  findUpMoveDestination(currentXY) {
    return [currentXY[0], this.getObstacleXYs().concat([[this.finish.getX(), this.finish.getY()-1]])
                          .filter(obstacleXY => obstacleXY[0] === currentXY[0] && obstacleXY[1] < currentXY[1])
                          .concat([[currentXY[0], -1]])
                          .sort((a,b) => (a[1]<b[1]) ? 1 : -1)
                          [0][1]+1];
  }
  findDownMoveDestination(currentXY) {
    return [currentXY[0], this.getObstacleXYs().concat([[this.finish.getX(), this.finish.getY()+1]])
                          .filter(obstacleXY => obstacleXY[0] === currentXY[0] && obstacleXY[1] > currentXY[1])
                          .concat([[currentXY[0], this.size]])
                          .sort((a,b) => (a[1]>b[1]) ? 1 : -1)
                          [0][1]-1];
  }




  findRandomUnoccupiedCoordinates() {
    let randomX = 0;
    let randomY = 0;
    do {
      randomX = Math.floor(Math.random()*this.size);
      randomY = Math.floor(Math.random()*this.size);
    } while (this.getObstacleXYs().filter((e)=>(e[0]===randomX && e[1]===randomY)).length!==0);
    return [randomX,randomY];
  }
  getObstacleXYs(){
    return this.obstacles.map(o => o.getXY());
  }

  reset(){
    this.obstacles = this.resetToThisState[0];
    this.obstacles.filter(o => o.node.parentNode===null).forEach(o => {
      o.displayWithAnimation();
    });
    this.player.setXY(this.resetToThisState[1]);
    this.player.node.classList.remove("player-wins");
    this.player.node.style.backgroundColor = "red";
    this.finish.setXY(this.resetToThisState[2]);
  }
  finishLevel(){
    if (this.player.getX() !== this.finish.getX() || this.player.getY() !== this.finish.getY()) return;
    setTimeout(()=>{
      this.animateFinish();
      //this.clearBoard();
      this.displayPostGame();
    }, "280");
  }
  clearBoard(){
    this.obstacles.forEach(o => o.eraseWithAnimation());
    this.player.eraseWithAnimation();
    this.finish.eraseWithAnimation();
    this.obstacles = [];
  }
  displayPostGame(){
    console.log("POSTGAME");
  }
  animateFinish(){
    this.player.style.backgroundColor = "rgb(26, 175, 26)";
    this.player.node.classList.add('player-wins');
    
    // setTimeout(()=>{
    //   this.player.node.classList.remove("player-wins");
    // }, "4000");
  }

  isBetween(number, lowerBound, upperBound) {
    return (number >= lowerBound && number <= upperBound);
  }
  triggerExplosion(){
    let xRange = [this.player.getX()-1, this.player.getX(), this.player.getX()+1];
    let yRange = [this.player.getY()-1, this.player.getY(), this.player.getY()+1];
    this.obstacles.filter(o => xRange.includes(o.getX()) && yRange.includes(o.getY())).forEach(o => o.eraseWithAnimation());
    this.obstacles = (this.obstacles.filter(o => !(xRange.includes(o.getX()) && yRange.includes(o.getY()))));
  }
}