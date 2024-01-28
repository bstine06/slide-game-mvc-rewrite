import { Model } from './model.js';
import { View } from './view.js';
import { EventDispatcher } from './eventDispatcher.js';

class Controller {
  constructor() {
    this.eventDispatcher = new EventDispatcher();
    this.model = new Model(this, this.eventDispatcher);
    this.view = new View(this, this.eventDispatcher);

    document.addEventListener('keydown', (event) => {
      this.eventDispatcher.dispatchEvent('keyPressed', event.key);
    });

    this.eventDispatcher.addEventListener('resetBtnClicked', (message) => {
      console.log(message);
      this.model.clearBoard();
      this.view.clearBoard();
    });

    this.eventDispatcher.addEventListener('boardGenerated', (board) => {
      console.log('Controller recieved generated board from Model');
      console.log('Updating view...');
      this.view.renderBoard(board);
    });
    console.log(this.eventDispatcher);

    // Now call the initialize method to generate the board
    this.model.initialize();
  }

  // Controller methods here
}

document.addEventListener('DOMContentLoaded', () => {
  new Controller();
});
