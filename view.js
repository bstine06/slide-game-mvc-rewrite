export class View {
  constructor(controller, eventDispatcher) {
    this.controller = controller;
    this.eventDispatcher = eventDispatcher;
    this.gameContainer;
    this.playerNode;
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
    console.log(board);
    const sizingFactor = 100/board.size;
    //render obstacles
    board.obstacles.forEach(obstacle => {
      const obstacleNode = document.createElement('div');
      obstacleNode.classList.add('obstacle');
      let lightness = Math.floor(Math.random() * 20 + 40);
      obstacleNode.style.backgroundColor = `hsl(0,0%,${lightness}%)`;
      obstacleNode.style.zIndex = Math.floor(Math.random()*board.countObstacles + 3);
      this.renderNodeSizeAndPosition(obstacleNode, sizingFactor, obstacle.getX(), obstacle.getY());
      this.gameContainer.appendChild(obstacleNode);
    });
    //render player
    this.playerNode = document.createElement('div');
    this.playerNode.classList.add('player');
    this.renderNodeSizeAndPosition(this.playerNode, sizingFactor, board.player.getX(), board.player.getY());
    //render finish
    const finishNode = document.createElement('div');
    finishNode.classList.add('finish');
    this.renderNodeSizeAndPosition(finishNode, sizingFactor, board.finish.getX(), board.finish.getY());
  }

  renderNodeSizeAndPosition(node, sizingFactor, x, y) {
    node.style.height = sizingFactor + '%';
    node.style.width = sizingFactor + '%';
    node.style.left = x * sizingFactor + '%';
    node.style.top = y * sizingFactor + '%';
    this.gameContainer.appendChild(node);
  }

  clearBoard() {
    this.gameContainer.innerHTML = '';
  }
}
