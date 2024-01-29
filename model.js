import { EventDispatcher } from './eventDispatcher.js';
import { Board } from './modules/board.js';

export class Model {
  constructor(controller, eventDispatcher) {
    this.board = new Board();
    this.controller = controller;
    this.eventDispatcher = eventDispatcher;
    this.resetBoardToThisState = this.board;

    this.eventDispatcher.addEventListener('keyPressed', (data) => {
      console.log('Model received keyPressed event:', data);
    });
  }

  generateRandomBoard(size, countObstacles) {
    this.board.generateRandomBoard(size, countObstacles);
    this.resetBoardToThisState = this.board;
    console.log("Model: generating board...");
    this.eventDispatcher.dispatchEvent('boardGenerated', this.board);
  }

  resetBoard() {
    this.board = this.resetBoardToThisState;
    console.log("Model: resetting board...");
    this.eventDispatcher.dispatchEvent('boardGenerated', this.board);
  }

  clearBoard() {
    this.board = new Board();
  }

  initialize() {
    this.generateRandomBoard(12, 20);
  }
}
