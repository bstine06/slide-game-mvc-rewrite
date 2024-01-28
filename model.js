import { EventDispatcher } from './eventDispatcher.js';
import { Board } from './modules/board.js';

export class Model {
  constructor(controller, eventDispatcher) {
    this.board = new Board();
    this.controller = controller;
    this.eventDispatcher = eventDispatcher;

    // Example: Adding an event listener
    this.eventDispatcher.addEventListener('keyPressed', (data) => {
      console.log('Model received keyPressed event:', data);
      // Update the view accordingly
    });

    // Don't generate the board in the constructor
    // this.generateRandomBoard(10, 20);
  }

  // Your data-related methods here

  generateRandomBoard(size, countObstacles) {
    this.board.generateRandomBoard(size, countObstacles);
    console.log("generating board...");
    this.eventDispatcher.dispatchEvent('boardGenerated', this.board);
  }

  clearBoard() {
    this.board = new Board();
  }

  initialize() {
    // Call this method after setting up the controller
    this.generateRandomBoard(10, 20);
  }
}
