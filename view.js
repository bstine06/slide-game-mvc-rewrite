export class View {
  constructor(controller, eventDispatcher) {
    this.controller = controller;
    this.eventDispatcher = eventDispatcher;
    this.gameContainer;
    this.renderContainer();

    // Example: Adding an event listener
    this.eventDispatcher.addEventListener('keyPressed', (data) => {
      console.log('View recieved keyPress event:', data);
      // Update the view accordingly
    });
  }

  renderContainer() {
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'reset';
    this.gameContainer  = document.createElement('div');
    this.gameContainer.classList.add('game-container');

    // Add a click event listener to the button
    resetBtn.addEventListener('click', () => {
      // Dispatch a custom event when the button is clicked
      this.eventDispatcher.dispatchEvent('resetBtnClicked', 'Reset Button clicked!');
    });

    // Append the button to the document body
    document.body.appendChild(resetBtn);
    document.body.appendChild(this.gameContainer);
  }

  renderBoard(board) {
    console.log('View rendering board...');
    console.log(board);
    board.obstacles.forEach(obstacle => {
      const obstacleNode = document.createElement('div');
      obstacleNode.classList.add('obstacle');
      obstacleNode.style.top = obstacle.getY() * 10 + '%';
      obstacleNode.style.left = obstacle.getX() * 10 + '%';
      this.gameContainer.appendChild(obstacleNode);
    });
  }

  clearBoard() {
    this.gameContainer.innerHTML = '';
  }
  // Your other view-related methods here
}
