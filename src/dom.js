import Ship from "./ship";

class DOM {
  constructor(gameManager) {
    this.gameManager = gameManager;
    this.axis = 'horizontal'; // Default axis for ship placement
    this.currentPreview = null; // Track preview element
  }

  init() {
    this.renderPlayerBoard();
    document.getElementById('start-game').addEventListener('click', () => this.startGame());
    this.addAxisToggle();
  }

  renderPlayerBoard() {
    const boardElement = document.getElementById('player-board');
    boardElement.innerHTML = ''; // Clear previous content

    // Ensure the axis toggle button is visible
    document.getElementById('axis-toggle').style.display = 'block';

    const currentShipIndex = this.gameManager.currentShipIndex;
    const currentShipLength = this.gameManager.shipsToPlace[currentShipIndex];

    if (currentShipIndex >= this.gameManager.shipsToPlace.length) {
      console.error('All ships are placed.');
      return; // Stop if there are no more ships to place
    }

    console.log(`Placing ship of length: ${currentShipLength}`);

    // Render the board with the current preview logic
    this.renderBoard(
      boardElement,
      this.gameManager.player.board.board,
      (row, col) => this.handleCellClick(boardElement, row, col), // Add handleCellClick as callback
      (row, col) => this.showPreview(boardElement, row, col, currentShipLength, this.axis) // Hover preview
    );
  }

  handleCellClick(boardElement, row, col) {
    const currentShipIndex = this.gameManager.currentShipIndex;
    const currentShipLength = this.gameManager.shipsToPlace[currentShipIndex];

    const success = this.gameManager.placeShipInBoard(
      this.gameManager.player.board,
      row,
      col,
      currentShipLength,
      this.axis
    );

    if (success) {
      console.log(`Successfully placed ship ${this.gameManager.currentShipIndex}`);
      this.gameManager.currentShipIndex++; // Increment ship index

      this.updateBoard(boardElement, this.gameManager.player.board.board); // Update the display

      // If there are still ships to place, render preview for the next ship
      if (this.gameManager.currentShipIndex < this.gameManager.shipsToPlace.length) {
        console.log("Rendering preview for next ship.");
        this.renderPreview(boardElement);
      }

      // If all ships are placed, show the start game button
      if (this.gameManager.currentShipIndex >= this.gameManager.shipsToPlace.length) {
        console.log("All ships placed. Showing start game button.");
        document.getElementById('start-game').style.display = 'block'; // Show start game button
      }
    } else {
      console.log("Ship placement failed.");
    }
  }

  updateBoard(boardElement, boardState) {
    console.log(boardElement, boardState);

    // Re-render the board with updated ship placements
    this.renderBoard(boardElement, boardState);
  }

  renderPreview(boardElement) {
    const nextShipLength = this.gameManager.shipsToPlace[this.gameManager.currentShipIndex];
    console.log('Rendering preview for ship:', this.gameManager.shipsToPlace[this.gameManager.currentShipIndex]);


    // Re-render the board with hover preview logic
    this.renderBoard(
      boardElement,
      this.gameManager.player.board.board, // Ensure this is the updated board
      (row, col) => this.handleCellClick(boardElement, row, col), // Add handleCellClick as callback
      (row, col) => {
        this.showPreview(boardElement, row, col, nextShipLength, this.axis);
      }
    );
  }

  showPreview(boardElement, row, col, length, axis) {
    this.clearPreview(boardElement); // Clear previous preview cells

    let previewCells = [];
    if (axis === 'horizontal') {
      for (let i = 0; i < length; i++) {
        const cellDiv = boardElement.querySelector(`.board-cell[data-row="${row}"][data-col="${col + i}"]`);
        if (cellDiv && !cellDiv.classList.contains('ship-cell')) {
          cellDiv.classList.add('preview');
          previewCells.push(cellDiv);
        }
      }
    } else {
      for (let i = 0; i < length; i++) {
        const cellDiv = boardElement.querySelector(`.board-cell[data-row="${row + i}"][data-col="${col}"]`);
        if (cellDiv && !cellDiv.classList.contains('ship-cell')) {
          cellDiv.classList.add('preview');
          previewCells.push(cellDiv);
        }
      }
    }

    this.currentPreview = previewCells;
  }

  clearPreview(boardElement) {
    const previewCells = boardElement.querySelectorAll('.preview');
    previewCells.forEach(cell => {
      cell.classList.remove('preview');
      cell.style.transition = 'none'; // Ensure there's no transition when removing the class
    });
  }

  startGame() {
    document.getElementById('placement-phase').style.display = 'none';
    document.getElementById('game-phase').style.display = 'block';
    this.renderGameBoards();

    // Hide the axis toggle button when the game starts
    document.getElementById('axis-toggle').style.display = 'none';
  }

  renderGameBoards() {
    const playerBoard = document.getElementById('player-game-board');
    const computerBoard = document.getElementById('computer-board');

    // Log player and computer boards for debugging
    console.log(this.gameManager.playerBoard);  // Check the player board state
    console.log(this.gameManager.computerBoard); // Check the computer board state

    // Ensure both boards are properly initialized before rendering
    if (!this.gameManager.playerBoard || !Array.isArray(this.gameManager.playerBoard.board) ||
      !this.gameManager.computerBoard || !Array.isArray(this.gameManager.computerBoard.board)) {
      console.error('Board is not properly initialized');
      return;
    }

    // Render the player board
    this.renderBoard(playerBoard, this.gameManager.playerBoard.board);

    // Render the computer board
    this.renderBoard(computerBoard, this.gameManager.computerBoard.board, (row, col) => {
      const result = this.gameManager.attackOpponent(row, col);  // Attack the computer's board

      // Update the board rendering after the attack
      this.updateBoard(computerBoard, this.gameManager.computerBoard.board);

      // Display the result of the attack
      if (result === 'hit') {
        document.getElementById('game-status').textContent = 'You hit a ship!';
      } else if (result === 'miss') {
        document.getElementById('game-status').textContent = 'You missed!';
      }

      // Call computer's turn after the player attack
      this.computerTurn();  // Let the computer take its turn
    });
  }

  computerTurn() {
    const result = this.gameManager.computerTurn();
    document.getElementById('game-status').textContent = result === 'hit' ? 'Computer hit your ship!' : 'Computer missed!';

    // Update the computer's board after the turn
    // this.updateGameBoard(this.gameManager.computerBoard.board, document.getElementById('computer-board'));
  }

  renderBoard(boardElement, board, clickCallback, hoverCallback = null) {
    boardElement.innerHTML = ''; // Clear the board


    board.forEach((row, rowIndex) => {
      const rowElement = document.createElement('div');
      rowElement.classList.add('board-row');

      row.forEach((cell, colIndex) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('board-cell');
        cellElement.setAttribute('data-row', rowIndex);
        cellElement.setAttribute('data-col', colIndex);

        // Set class based on the cell's state
        this.setCellClass(cellElement, cell);

        // Attach hover events if a hoverCallback is provided
        if (hoverCallback) {
          cellElement.addEventListener('mouseover', () => hoverCallback(rowIndex, colIndex));
          cellElement.addEventListener('mouseout', () => this.clearPreview(boardElement));
        }

        // Attach click event listener if a clickCallback is provided
        if (clickCallback) {
          cellElement.addEventListener('click', () => {
            clickCallback(rowIndex, colIndex); // Handle click events
          });
        }

        rowElement.appendChild(cellElement); // Append cell to row
      });

      boardElement.appendChild(rowElement); // Append row to board
    });
  }


  addAxisToggle() {
    const axisToggle = document.querySelector('#axis-toggle');
    axisToggle.addEventListener('click', () => {
      this.axis = this.axis === 'horizontal' ? 'vertical' : 'horizontal';
      axisToggle.textContent = `Axis: ${this.axis}`;  // Update the axis toggle text
    });
  }

  setCellClass(cellElement, cell) {
    // Check if the cell contains a Ship object
    if (cell instanceof Ship) {
      cellElement.classList.add('ship-cell');  // Add the class for cells containing ships
    } else if (cell === 'hit') {
      cellElement.classList.add('hit');  // Mark the cell as hit
    } else if (cell === 'miss') {
      cellElement.classList.add('miss');  // Mark the cell as a miss
    } else if (cell === 'empty') {
      cellElement.classList.add('empty');  // Empty cell
    }
  }

  updateGameBoard(board, boardElement) {
    console.log('calling render board ', board, boardElement);
    const computerBoard = document.getElementById('computer-board');

    this.renderBoard(boardElement, board, (row, col) => {
      const result = this.gameManager.attackOpponent(row, col);  // Attack the computer's board

      // Update the board rendering after the attack
      this.updateBoard(computerBoard, this.gameManager.computerBoard.board);

      // Display the result of the attack
      if (result === 'hit') {
        document.getElementById('game-status').textContent = 'You hit a ship!';
      } else if (result === 'miss') {
        document.getElementById('game-status').textContent = 'You missed!';
      }

      // Call computer's turn after the player attack
      this.computerTurn();  // Let the computer take its turn
    });
  }


  // Call this function whenever the board state changes
  renderPlayerGameBoard() {
    const boardElement = document.querySelector('#player-game-board');
    console.log("updating player board ....");

    this.updateGameBoard(this.gameManager.player.board.board, boardElement); // Update player board
  }

  renderComputerGameBoard() {
    const boardElement = document.querySelector('#computer-board');
    console.log("updating computer board ....");
    this.updateGameBoard(this.gameManager.computerBoard.board, boardElement); // Update computer board
  }

}

export default DOM;
