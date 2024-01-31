import { Board } from './modules/board.js';
import { CoordinateSet } from './modules/coordinateSet.js';

export class Model {
  constructor(controller, eventDispatcher) {
    this.board = new Board();
    this.controller = controller;
    this.eventDispatcher = eventDispatcher;
    this.finishAddedToGraph = false;

    this.eventDispatcher.addEventListener('startGame', (data) => {
      this.createBoard(data);
    });
  }

  generateRandomBoard(size, countObstacles, maxAttempts = 10) {
    if (countObstacles >= size*size-size) {
      throw new Error(`Obstacle count must be less than size*size-size`);
    }
    
    if (maxAttempts === 0) {
      console.error('Unable to generate a solvable board.');
    }

    let msg = "Model: generating board..."
    switch (maxAttempts) {
      case 9 : msg = "Model: making sure it's solvable..."; break;
      case 8 : msg = "Model: sometimes it takes a little while..."; break;
    }
    console.log(msg);
    
    this.board.generateRandomBoard(size, countObstacles);
    this.generateAdjacencyListUntilFinishIsFound(this.board.size, performance.now());
  
    if (!this.finishAddedToGraph) {
      this.clearBoard();
      this.generateRandomBoard(size, countObstacles, maxAttempts - 1);
    }
  }

  resetBoard() {
    console.log("Model: resetting board...");
    this.board.reset();
    this.eventDispatcher.dispatchEvent('boardGenerated', this.board);
  }

  clearBoard() {
    this.board = new Board();
  }

  createBoard() {
    const startTime = performance.now();
    this.generateRandomBoard(25, 100);
    const endTime = performance.now();
    const executionTime = Math.ceil(endTime - startTime)/1000;
    console.log(`Model: Generated board in ${executionTime} seconds`)
    this.eventDispatcher.dispatchEvent('boardGenerated', this.board);
  }

  updateStateOnKeyPress(key) {
    switch (key) {
      case 'ArrowLeft': 
      case 'a':
        if (this.board.player.setXYifNew(this.board.findLeftMoveDestination(this.board.player.getXY()))){
          this.eventDispatcher.dispatchEvent('updatePlayerXY', this.board.player.getXY());
        };
        break;
      case 'ArrowRight':
      case 'd':
        if (this.board.player.setXYifNew(this.board.findRightMoveDestination(this.board.player.getXY()))){
          this.eventDispatcher.dispatchEvent('updatePlayerXY', this.board.player.getXY());
        };
        break;
      case 'ArrowUp':
      case 'w':
        if (this.board.player.setXYifNew(this.board.findUpMoveDestination(this.board.player.getXY()))){
          this.eventDispatcher.dispatchEvent('updatePlayerXY', this.board.player.getXY());
        };
        break;
      case 'ArrowDown':
      case 's':
        if (this.board.player.setXYifNew(this.board.findDownMoveDestination(this.board.player.getXY()))){
          this.eventDispatcher.dispatchEvent('updatePlayerXY', this.board.player.getXY());
        };
        break;
      case 'b':
      case 'Shift':
        let explodedItemIds = this.board.triggerExplosion();
        if (explodedItemIds.length > 0) {
          this.eventDispatcher.dispatchEvent('explosionTriggered', explodedItemIds);
        }
        break;
    };
  }

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

    // Add neighbors based on available moves
    if (upMove && !(upMove[0]===currentXY[0] && upMove[1]===currentXY[1])) this.addNeighbor(graph, currentXY, upMove, depth, startTime);
    if (downMove && !(downMove[0]===currentXY[0] && downMove[1]===currentXY[1])) this.addNeighbor(graph, currentXY, downMove, depth, startTime);
    if (leftMove && !(leftMove[0]===currentXY[0] && leftMove[1]===currentXY[1])) this.addNeighbor(graph, currentXY, leftMove, depth, startTime);
    if (rightMove && !(rightMove[0]===currentXY[0] && rightMove[1]===currentXY[1])) this.addNeighbor(graph, currentXY, rightMove, depth, startTime);
  }
  
  isBoardSolvable(graph) {
    return Object.values(graph).some(neighbors =>
      Array.from(neighbors).some(neighbor =>
        neighbor[0] === this.board.finish.getX() && neighbor[1] === this.board.finish.getY()
      )
    );
  }
}
