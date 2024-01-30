import { Board } from './modules/board.js';
import { CoordinateSet } from './modules/coordinateSet.js';

export class Model {
  constructor(controller, eventDispatcher) {
    this.board = new Board();
    this.controller = controller;
    this.eventDispatcher = eventDispatcher;

    this.eventDispatcher.addEventListener('keyPressed', (data) => {
      this.handleKeyPress(data);
    });
  }

  generateRandomBoard(size, countObstacles) {
    this.board.generateRandomBoard(size, countObstacles);
    console.log("Model: generating board...");
    this.eventDispatcher.dispatchEvent('boardGenerated', this.board);
    const graph = this.generateAdjacencyList(this.board.size*2);
    console.log(graph);
    console.log(this.isBoardSolvable(graph));
  }

  resetBoard() {
    console.log("Model: resetting board...");
    this.board.reset();
    this.eventDispatcher.dispatchEvent('boardGenerated', this.board);
  }

  clearBoard() {
    this.board = new Board();
  }

  initialize() {
    this.generateRandomBoard(5, 6);
  }

  handleKeyPress(data) {
    switch (data) {
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
      case 'e':
        let explodedItemIds = this.board.triggerExplosion();
        if (explodedItemIds.length > 0) {
          this.eventDispatcher.dispatchEvent('explosionTriggered', explodedItemIds);
        }
        break;
    };
  }

  generateAdjacencyList(maxDepth) {
    const graph = {};

    this.generateGraphFromPosition(graph, this.board.player.getXY(), maxDepth);

    return graph;
  }
  addNeighbor(graph, currentXY, newXY, maxDepth) {
    if (!graph[currentXY]) {
      graph[currentXY] = new CoordinateSet();
    }
    graph[currentXY].add(newXY);
    this.generateGraphFromPosition(graph, newXY, maxDepth - 1);
  }
  generateGraphFromPosition(graph, currentXY, depth) {
    if (depth <= 0) return;
    const upMove = this.board.findUpMoveDestination(currentXY);
    const downMove = this.board.findDownMoveDestination(currentXY);
    const leftMove = this.board.findLeftMoveDestination(currentXY);
    const rightMove = this.board.findRightMoveDestination(currentXY);

    // Add neighbors based on available moves
    if (upMove && !(upMove[0]===currentXY[0] && upMove[1]===currentXY[1])) this.addNeighbor(graph, currentXY, upMove, depth);
    if (downMove && !(downMove[0]===currentXY[0] && downMove[1]===currentXY[1])) this.addNeighbor(graph, currentXY, downMove, depth);
    if (leftMove && !(leftMove[0]===currentXY[0] && leftMove[1]===currentXY[1])) this.addNeighbor(graph, currentXY, leftMove, depth);
    if (rightMove && !(rightMove[0]===currentXY[0] && rightMove[1]===currentXY[1])) this.addNeighbor(graph, currentXY, rightMove, depth);
  }
  
  isBoardSolvable(graph) {
    let isFinishInGraph = false;
    for (const [key, value] of Object.entries(graph)) {
      value.forEach(e => {
        if (e[0]===this.board.finish.getX() && e[1]===this.board.finish.getY()) {
          isFinishInGraph = true;
        }
      });
    }
    return isFinishInGraph;
  }
}
