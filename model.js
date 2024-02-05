import { Board } from './modules/board.js';
import { CoordinateSet } from './modules/coordinateSet.js';

export class Model {
  constructor(controller, eventDispatcher) {
    this.board = new Board();
    this.controller = controller;
    this.eventDispatcher = eventDispatcher;
    this.finishAddedToGraph = false;
    this.size;
    this.timer = 100;
    this.isTimerOn = false;
    this.countLevelsFinished = 0;

    this.eventDispatcher.addEventListener('startGame', (data) => {
      this.createBoard(data);
    });
  }

  /* board manipulation functions */

  createBoard(size) {
    let playerStartXY;
    if (this.board.player === undefined) {
      playerStartXY = this.board.findRandomCoordinatesOnBoardOfSize(size);
    } else {
      playerStartXY = this.board.player.getXY();
    }
    console.log(`in model:creatBoard. playerStartXY:${playerStartXY}`)
    this.clearBoard();
    this.size = size;
    const startTime = performance.now();
    const obstacleCount = size*size/(Math.ceil(Math.random()*4)+2)
    this.generateRandomBoard(size, obstacleCount, playerStartXY);
    const endTime = performance.now();
    const executionTime = Math.ceil(endTime - startTime)/1000;
    console.log(`Model: Generated board in ${executionTime} seconds`)
    this.eventDispatcher.dispatchEvent('boardGenerated', this.board);
    this.startTimer();
  }

  generateRandomBoard(size, countObstacles, playerStartXY) {
    if (countObstacles >= size*size-size) {
      throw new Error(`Obstacle count must be less than size*size-size`);
    }

    let msg = "Model: generating board..."
    console.log(msg);
    
    this.board.generateRandomBoard(size, countObstacles, playerStartXY);
    this.generateAdjacencyListUntilFinishIsFound(this.board.size, performance.now());
  
    if (!this.finishAddedToGraph) {
      this.clearBoard();
      this.generateRandomBoard(size, countObstacles, playerStartXY);
    }
  }

  resetBoard() {
    console.log("Model: resetting board...");
    this.board.reset();
    this.eventDispatcher.dispatchEvent('boardGenerated', this.board);
  }

  clearBoard() {
    this.board = new Board();
    this.finishAddedToGraph = false;
  }

  /* timer functions */

  startTimer() {
    this.isTimerOn = true;
    this.timerInterval = setInterval(() => this.updateTimer(-1), 1000);
  }

  stopTimer() {
      this.isTimerOn = false;
      clearInterval(this.timerInterval);
  }

  updateTimer(amount) {
    if (this.timer <= 0) {
      this.stopTimer();
  } else {
      this.timer += amount;
      if (this.timer > 30) this.timer += amount; // timer moves slower as it dwindles
      this.eventDispatcher.dispatchEvent('timeUpdated', this.timer);
  }
  }

  /* keypress handler functions */

  updateStateOnKeyPress(key) {
    switch (key) {
      case 'ArrowLeft': 
      case 'a':
        if (this.board.player.setXYifNew(this.board.findLeftMoveDestination(this.board.player.getXY()))){
          this.eventDispatcher.dispatchEvent('updatePlayerXY', this.board.player.getXY());
        };
        if (this.board.finishLevel()) this.dispatchFinish();
        break;
      case 'ArrowRight':
      case 'd':
        if (this.board.player.setXYifNew(this.board.findRightMoveDestination(this.board.player.getXY()))){
          this.eventDispatcher.dispatchEvent('updatePlayerXY', this.board.player.getXY());
        };
        if (this.board.finishLevel()) this.dispatchFinish();
        break;
      case 'ArrowUp':
      case 'w':
        if (this.board.player.setXYifNew(this.board.findUpMoveDestination(this.board.player.getXY()))){
          this.eventDispatcher.dispatchEvent('updatePlayerXY', this.board.player.getXY());
        };
        if (this.board.finishLevel()) this.dispatchFinish();
        break;
      case 'ArrowDown':
      case 's':
        if (this.board.player.setXYifNew(this.board.findDownMoveDestination(this.board.player.getXY()))){
          this.eventDispatcher.dispatchEvent('updatePlayerXY', this.board.player.getXY());
        };
        if (this.board.finishLevel()) this.dispatchFinish();
        break;
      case 'b':
        let explodedItemIds = this.board.triggerExplosion();
        if (explodedItemIds.length > 0) {
          this.eventDispatcher.dispatchEvent('explosionTriggered', explodedItemIds);
        }
        break;
      case ' ':
        this.updateTimer(-2);
        this.resetBoard();
        break;
    };
  }
  
  dispatchFinish() {
    this.stopTimer();
    this.updateTimer(2);
    this.countLevelsFinished++;
    const finishData = {
      boardSize : this.board.size,
      countLevelsFinished : this.countLevelsFinished
    }
    setTimeout(()=>{
      this.eventDispatcher.dispatchEvent('levelFinished', finishData);
    }, 300);
  }


  /* check maze solvability functions */

  generateAdjacencyListUntilFinishIsFound(maxDepth) {
    const graph = {};

    this.generateGraphFromPosition(graph, this.board.player.getXY(), maxDepth, performance.now());

    return graph;
  }

  addNeighbor(graph, currentXY, newXY, maxDepth, startTime) {
    if (this.finishAddedToGraph) {
      return;
    }
    if (performance.now() - startTime > 1000) {
      return;
    }
    if (!graph[currentXY]) {
      graph[currentXY] = new CoordinateSet();
    }
    graph[currentXY].add(newXY);
    this.generateGraphFromPosition(graph, newXY, maxDepth - 1, startTime);
  }

  generateGraphFromPosition(graph, currentXY, depth, startTime) {
    if (depth <= 0 || this.finishAddedToGraph) return;
    const upMove = this.board.findUpMoveDestination(currentXY);
    const downMove = this.board.findDownMoveDestination(currentXY);
    const leftMove = this.board.findLeftMoveDestination(currentXY);
    const rightMove = this.board.findRightMoveDestination(currentXY);

    const moves = [upMove, downMove, leftMove, rightMove];
    if (!this.finishAddedToGraph) {
      if (moves.some((m) => m[0]===this.board.finish.getX() && m[1]===this.board.finish.getY())) {
        this.finishAddedToGraph = true;
        return;
      }
    }
    if (performance.now() - startTime > 1000) {
      return;
    }

    if (upMove && !(upMove[0]===currentXY[0] && upMove[1]===currentXY[1])) this.addNeighbor(graph, currentXY, upMove, depth, startTime);
    if (downMove && !(downMove[0]===currentXY[0] && downMove[1]===currentXY[1])) this.addNeighbor(graph, currentXY, downMove, depth, startTime);
    if (leftMove && !(leftMove[0]===currentXY[0] && leftMove[1]===currentXY[1])) this.addNeighbor(graph, currentXY, leftMove, depth, startTime);
    if (rightMove && !(rightMove[0]===currentXY[0] && rightMove[1]===currentXY[1])) this.addNeighbor(graph, currentXY, rightMove, depth, startTime);
  }
  
}
