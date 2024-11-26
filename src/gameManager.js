import DOM from './dom';
import GameBoard from './gameboard';
import Player from './player';
// GameManager class

class GameManager {
  constructor() {
    this.player = new Player('Player 1');
    this.computer = new Player('Computer', true);

    this.playerBoard = new GameBoard();
    this.computerBoard = new GameBoard();

    this.currentShipIndex = 0;
    this.shipsToPlace = [5, 4, 3, 3, 2]; // Ship lengths

    this.isPlayerTurn = true; // Start with player turn
  }

  // Place a ship on the board
  placeShipInBoard(board, row, col, length, axis) {
    return board.placeShip(row, col, length, axis);
  }

  // Handle the player's attack on the computer's board
  attackOpponent(row, col) {
    return this.computerBoard.receiveAttack(row, col);
  }

  // Handle the computer's turn
  computerTurn() {
    console.log("Computer's turn");  // Debugging line
    // Add a delay to simulate thinking
    setTimeout(() => {
      const [row, col] = this.computer.randomAttack(this.playerBoard.board);
      const result = this.player.board.receiveAttack(row, col);

      // Update game status based on result
      const statusElement = document.getElementById('game-status');
      if (result === 'hit') {
        statusElement.textContent = 'Computer hit your ship!';
      } else if (result === 'miss') {
        statusElement.textContent = 'Computer missed!';
      } else if (result === 'sunk') {
        statusElement.textContent = 'Computer sunk your ship!';
      }

      this.isPlayerTurn = true; // After computer's turn, it's now the player's turn
      this.updateTurn(); // Update the turn indicator
      this.updateGameBoard(); // Update the board display after the computer's turn
      return result;
    }, 1000);  // Delay of 1 second
  }

  // Function to update the game UI or status for turn switching
  updateTurn() {
    console.log('turn ', this.isPlayerTurn);
    
    const statusElement = document.getElementById('game-status');
    if (this.isPlayerTurn) {
      statusElement.textContent = 'Your turn!';
      this.enablePlayerBoard(); // Enable player's interaction
    } else {
      statusElement.textContent = 'Computer\'s turn!';
      this.disablePlayerBoard(); // Disable player's interaction during computer turn
    }
  }

  // Enable the player to make moves
  enablePlayerBoard() {
    const playerBoard = document.getElementById('player-game-board');
    playerBoard.addEventListener('click', this.handlePlayerAttack.bind(this));
  }

  // Disable the player from making moves
  disablePlayerBoard() {
    const playerBoard = document.getElementById('player-game-board');
    playerBoard.removeEventListener('click', this.handlePlayerAttack.bind(this));
  }

  // Handle player attack logic
  handlePlayerAttack(event) {
    if (!this.isPlayerTurn) return; // Ensure it’s the player's turn
    console.log('handlePlayerAttack');
    
    const cell = event.target;
    const row = parseInt(cell.getAttribute('data-row'));
    const col = parseInt(cell.getAttribute('data-col'));

    const result = this.attackOpponent(row, col);

    // Update the board with the attack result (hit, miss, or sunk)
    this.updateGameBoard();

    const statusElement = document.getElementById('game-status');
    if (result === 'hit') {
      statusElement.textContent = 'You hit a ship!';
    } else if (result === 'miss') {
      statusElement.textContent = 'You missed!';
    } else if (result === 'sunk') {
      statusElement.textContent = 'You sunk a ship!';
    }

    this.isPlayerTurn = false; // After the player’s attack, it’s now the computer’s turn
    this.updateTurn();
    this.computerTurn(); // Call computer's turn after the player’s attack
  }

  // Update the game board UI or internal state
  updateGameBoard() {
    const dom = new DOM(this); // Ensure the DOM instance is properly passed with the current GameManager context
    console.log("Updating game board...");  // Debugging line
    // Update the player board
    dom.renderPlayerGameBoard();

    // Update the computer board
    dom.renderComputerGameBoard();
  }
}

export default GameManager;
