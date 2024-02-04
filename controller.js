import { Model } from './model.js';
import { View } from './view.js';
import { EventDispatcher } from './eventDispatcher.js';

class Controller {
  constructor() {
    this.eventDispatcher = new EventDispatcher();
    this.model = new Model(this, this.eventDispatcher);
    this.view = new View(this, this.eventDispatcher);

    document.addEventListener('keydown', (event) => {
      this.handleKeyPress(event.key);
    });

    this.eventDispatcher.addEventListener('resetBtnClicked', (message) => {
      console.log(`Controller: ${message}`);
      this.model.resetBoard();
    });

    this.eventDispatcher.addEventListener('startBtnClicked', (boardSize) => {
      console.log(`Controller: game initialized with size ${boardSize}`);
      this.model.createBoard(boardSize, boardSize*boardSize/3);
    })

    this.eventDispatcher.addEventListener('boardGenerated', (board) => {
        this.view.renderBoard(board);
    });

    this.eventDispatcher.addEventListener('updateBoard', (board) => {
      this.view.resetBoard(board);
    });

    this.eventDispatcher.addEventListener('levelFinished', (board) => {
      setTimeout(()=>{
        this.model.createBoard(board.size);
      }, 100);
    })

    this.eventDispatcher.addEventListener('explosionTriggered', (explodedItemIds) => {
      this.view.explode(explodedItemIds);
    })

    this.eventDispatcher.addEventListener('updatePlayerXY', (newXY) => {
      console.log(`Controller: updating player XY to ${newXY}`);
      this.view.updatePlayerXY(newXY);
    });

    this.eventDispatcher.addEventListener('timeUpdated', (time) => {
      this.view.updateTimer(time);
    })

    // Now call the initialize method to generate the board
    this.view.renderMainMenu();
  }

  // Controller methods here
  handleKeyPress(key) {
    this.model.updateStateOnKeyPress(key);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Controller();
});
