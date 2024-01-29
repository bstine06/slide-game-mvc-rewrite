export class View {
  constructor(controller, eventDispatcher) {
    this.controller = controller;
    this.eventDispatcher = eventDispatcher;
    this.gameContainer;
    this.renderContainer();
  }

  renderContainer() {
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'reset';
    this.gameContainer  = document.createElement('div');
    this.gameContainer.classList.add('game-container');

    resetBtn.addEventListener('click', () => {
      this.eventDispatcher.dispatchEvent('resetBtnClicked', 'Reset Button clicked');
    });

    document.body.appendChild(resetBtn);
    document.body.appendChild(this.gameContainer);
  }

  renderBoard(board) {
    this.clearBoard();
    console.log('View: rendering board...');
    const sizingFactor = 100/board.size;
    board.obstacles.forEach(obstacle => {
      const obstacleNode = document.createElement('div');
      obstacleNode.classList.add('obstacle');
      obstacleNode.style.height = sizingFactor + '%';
      obstacleNode.style.width = sizingFactor + '%';
      obstacleNode.style.top = obstacle.getY() * sizingFactor + '%';
      obstacleNode.style.left = obstacle.getX() * sizingFactor + '%';
      let lightness = Math.floor(Math.random() * 20 + 40);
      obstacleNode.style.backgroundColor = `hsl(0,0%,${lightness}%)`;
      obstacleNode.style.zIndex = Math.floor(Math.random()*board.countObstacles + 3);
      this.gameContainer.appendChild(obstacleNode);
    });
  }

  clearBoard() {
    this.gameContainer.innerHTML = '';
  }
}
