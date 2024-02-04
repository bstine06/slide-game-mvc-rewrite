import { Item, Obstacle } from './item.js';

export class Board {
  constructor() {
    this.size;
    this.countObstacles;
    this.obstacles = [];
    this.resetToThisState;
    this.player;
    this.finish;
  }
  generateRandomBoard(size, countObstacles) {
    this.size = size
    this.countObstacles = countObstacles;
    this.player = new Item("player");
    this.finish = new Item("finish");
    for (let i=0; i<this.countObstacles; i++) {
      let newObstacle = new Obstacle("obstacle", i);
      newObstacle.setXY(this.findRandomUnoccupiedCoordinates());
      this.obstacles.push(newObstacle);
    }
    // this.obstacles.sort((a, b) => {
    //   if (a.x !== b.x) {
    //     return a.x - b.x;
    //   } else {
    //     return a.y - b.y;
    //   }
    // });
    this.player.setXY(this.findRandomUnoccupiedCoordinates());
    this.finish.setXY(this.findRandomUnoccupiedCoordinates());
    this.resetToThisState = this.player.getXY();
  }

  findAvailableMoves(currentXY) {
    let availableMoves = [];
    availableMoves.push(this.findLeftMoveDestination(currentXY));
    availableMoves.push(this.findRightMoveDestination(currentXY));
    availableMoves.push(this.findUpMoveDestination(currentXY));
    availableMoves.push(this.findDownMoveDestination(currentXY));
    availableMoves = availableMoves.filter(xy => !xy.every((value, index) => value === currentXY[index]));
    console.table(availableMoves);
  }


  findLeftMoveDestination(currentXY) {
    const obstacleXYs = this.getObstacleXYs();
    const filteredObstacles = obstacleXYs
      .filter(obstacleXY => obstacleXY[1] === currentXY[1] && obstacleXY[0] < currentXY[0])
      .sort((a, b) => b[0] - a[0]);  // Sort in descending order
  
    const rightmostObstacleX = filteredObstacles.length > 0 ? filteredObstacles[0][0] : -1;
    const finishX = (this.finish.getY() === currentXY[1] && this.finish.getX() < currentXY[0]) ? this.finish.getX()-1 : -1;
    const leftMoveDestinationX = Math.max(rightmostObstacleX, -1, finishX) + 1;
  
    return [leftMoveDestinationX, currentXY[1]];
  }

  findRightMoveDestination(currentXY) {
    const obstacleXYs = this.getObstacleXYs();
    const filteredObstacles = obstacleXYs
      .filter(obstacleXY => obstacleXY[1] === currentXY[1] && obstacleXY[0] > currentXY[0])
      .sort((a, b) => a[0] - b[0]);  // Sort in ascending order
  
    const rightmostObstacleX = filteredObstacles.length > 0 ? filteredObstacles[0][0] : this.size;
    const finishX = (this.finish.getY() === currentXY[1] && this.finish.getX() > currentXY[0]) ? this.finish.getX()+1 : this.size;
    const rightMoveDestinationX = Math.min(rightmostObstacleX, this.size, finishX) - 1;
  
    return [rightMoveDestinationX, currentXY[1]];
  }
  
  findUpMoveDestination(currentXY) {
    const obstacleXYs = this.getObstacleXYs();
    const filteredObstacles = obstacleXYs
      .filter(obstacleXY => obstacleXY[0] === currentXY[0] && obstacleXY[1] < currentXY[1])
      .sort((a, b) => b[1] - a[1]);  // Sort in descending order
  
    const bottommostObstacleY = filteredObstacles.length > 0 ? filteredObstacles[0][1] : -1;
    const finishY = (this.finish.getX() === currentXY[0] && this.finish.getY() < currentXY[1]) ? this.finish.getY()-1 : -1;
    const rightMoveDestinationY = Math.max(bottommostObstacleY, -1, finishY) + 1;
  
    return [currentXY[0], rightMoveDestinationY];
  }

  findDownMoveDestination(currentXY) {
    const obstacleXYs = this.getObstacleXYs();
    const filteredObstacles = obstacleXYs
      .filter(obstacleXY => obstacleXY[0] === currentXY[0] && obstacleXY[1] > currentXY[1])
      .sort((a, b) => a[1] - b[1]);  // Sort in ascending order
  
    const topmostObstacleY = filteredObstacles.length > 0 ? filteredObstacles[0][1] : this.size;
    const finishY = (this.finish.getX() === currentXY[0] && this.finish.getY() > currentXY[1]) ? this.finish.getY()+1 : this.size;
    const rightMoveDestinationY = Math.min(topmostObstacleY, this.size, finishY) - 1;
  
    return [currentXY[0], rightMoveDestinationY];
  }

  findRandomUnoccupiedCoordinates() {
    let randomX = 0;
    let randomY = 0;
    do {
      randomX = Math.floor(Math.random()*this.size);
      randomY = Math.floor(Math.random()*this.size);
    } while (this.getObstacleXYs().concat([this.player.getXY()]).filter((e)=>(e[0]===randomX && e[1]===randomY)).length!==0);
    return [randomX,randomY];
  }
  getObstacleXYs(){
    return this.obstacles.filter(o => o.isOn === true).map(o => o.getXY());
  }

  reset(){
    this.obstacles.forEach((o)=>o.turnOn());
    this.player.setXY(this.resetToThisState);
  }
  finishLevel(){
    if (this.player.getX() === this.finish.getX() && this.player.getY() === this.finish.getY()) {
        return true;
    }
    return false;
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
    const explodedItems = this.obstacles.filter(o => xRange.includes(o.getX()) && yRange.includes(o.getY()));  
    explodedItems.forEach(o => o.turnOff());      
    return explodedItems.map(o => o.id);
    // this.obstacles = (this.obstacles.filter(o => !(xRange.includes(o.getX()) && yRange.includes(o.getY()))));
  }
}