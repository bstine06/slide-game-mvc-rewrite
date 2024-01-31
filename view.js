export class View {
  constructor(controller, eventDispatcher) {
    this.controller = controller;
    this.eventDispatcher = eventDispatcher;
    this.gameContainer;
    this.playerNode;
    this.sizingFactor;
    this.renderContainer();
  }

  renderContainer() {
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'reset';
    this.gameContainer  = document.createElement('div');
    this.gameContainer.classList.add('game-container');

    // resetBtn.addEventListener('click', () => {
    //   this.eventDispatcher.dispatchEvent('resetBtnClicked', 'Reset Button clicked');
    // });

    // document.body.appendChild(resetBtn);
    document.querySelector('.container').appendChild(this.gameContainer);
  }

  renderMainMenu() {
    const menuContainer = document.createElement('div');
    menuContainer.classList.add('menu-container');
    const title = document.createElement('h1');
    title.textContent = 'slide';
    title.classList.add('title');
    const sliderOutput = document.createElement('p');
    sliderOutput.textContent = '12x12 maze';
    const sizeSlider = document.createElement('input');
    sizeSlider.type = 'range';
    sizeSlider.min = '8';
    sizeSlider.max = '36';
    sizeSlider.defaultValue = '12';
    sizeSlider.classList.add('size-slider');
    sizeSlider.oninput = () => {
      this.clearBoard();
      sliderOutput.innerHTML = `${sizeSlider.value}x${sizeSlider.value} maze`;
      this.renderPreview(sizeSlider.value);
    }
    const startBtn = document.createElement('button');
    startBtn.textContent = 'start';
    startBtn.classList.add('start-btn');
    startBtn.addEventListener('click', ()=>{
      this.eventDispatcher.dispatchEvent('startBtnClicked', sizeSlider.value);
      menuContainer.remove();
    })
    menuContainer.appendChild(title);
    menuContainer.appendChild(sliderOutput);
    menuContainer.appendChild(sizeSlider);
    menuContainer.appendChild(startBtn);
    const container = document.querySelector('.container');
    container.appendChild(menuContainer);
    this.renderPreview(12);
  }

  renderPreview(size) {
    this.sizingFactor = 100/size;
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        
          const obstacleNode = document.createElement('div');
          obstacleNode.classList.add('obstacle');
          let lightness = Math.floor(Math.random() * 20 + 40);
          obstacleNode.style.backgroundColor = `hsl(0,0%,${lightness}%)`;
          obstacleNode.style.zIndex = Math.floor(Math.random()*3);
          this.renderNodeSizeAndPosition(obstacleNode, x, y, true);
        
      }
    }
  }

  renderBoard(board) {
    this.clearBoard();
    console.log('View: rendering board...');
    console.log(board);
    this.sizingFactor = 100/board.size;
    //render obstacles
    board.obstacles.forEach(obstacle => {
      const obstacleNode = document.createElement('div');
      obstacleNode.classList.add('obstacle');
      obstacleNode.id = `obstacle${obstacle.id}`;
      let lightness = Math.floor(Math.random() * 20 + 40);
      obstacleNode.style.backgroundColor = `hsl(0,0%,${lightness}%)`;
      obstacleNode.style.zIndex = Math.floor(Math.random()*board.countObstacles + 3);
      this.renderNodeSizeAndPosition(obstacleNode, obstacle.getX(), obstacle.getY());
    });
    //render player
    this.playerNode = document.createElement('div');
    this.playerNode.classList.add('player');
    this.renderNodeSizeAndPosition(this.playerNode, board.player.getX(), board.player.getY());
    //render finish
    const finishNode = document.createElement('div');
    finishNode.classList.add('finish');
    this.renderNodeSizeAndPosition(finishNode, board.finish.getX(), board.finish.getY());
  }

  renderNodeSizeAndPosition(node, x, y, isStatic) {
    node.style.height = this.sizingFactor + '%';
    node.style.width = this.sizingFactor + '%';
    node.style.left = x * this.sizingFactor + '%';
    node.style.top = y * this.sizingFactor + '%';
    if (!isStatic) node.classList.add('incoming-animation');
    this.gameContainer.appendChild(node);
    {
      setTimeout(() => {
        node.classList.remove('incoming-animation');
      }, 600);
    }
  }

  resetBoard(board) {
    console.log('View: updating board render...');
    this.updatePlayerXY(board.player.getXY());
    this.renderBoard(board);
    // board.obstacles.forEach((o) => o.id)
  }

  clearBoard() {
    this.gameContainer.innerHTML = '';
  }

  updatePlayerXY(newXY) {
    this.playerNode.style.left = newXY[0] * this.sizingFactor + '%';
    this.playerNode.style.top  = newXY[1] * this.sizingFactor + '%';
  }

  explode(explodedItemIds) {
    explodedItemIds.forEach((id) => {
      const obstacleNode = document.getElementById(`obstacle${id}`)
      obstacleNode.classList.add('outgoing-animation');
      setTimeout(() => {
        obstacleNode.style.display = 'none';
      }, 280);
    });
  }
}
