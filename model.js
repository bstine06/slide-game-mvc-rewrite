import { EventDispatcher } from './eventDispatcher.js';
import { Board } from './modules/board.js';

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
  }

  resetBoard() {
    console.log("Model: resetting board...");
    this.board.reset();
    this.eventDispatcher.dispatchEvent('updateBoard', this.board);
  }

  clearBoard() {
    this.board = new Board();
  }

  initialize() {
    this.generateRandomBoard(12, 20);
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
}
