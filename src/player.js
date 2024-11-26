import GameBoard from "./gameboard";
import Ship from "./ship";

class Player {
    constructor(name, isComputer = false) {
        this.name = name;
        this.isComputer = isComputer;
        this.board = new GameBoard();  // Initialize the board here
        if (this.isComputer) {
            this.placeComputerShips();  // Place ships for the computer
        }
    }

    // Randomly place ships on the board
    placeComputerShips() {
        const shipLengths = [5, 4, 3, 3, 2];  // Ship lengths to place
        shipLengths.forEach(length => {
            let placed = false;
            while (!placed) {
                const row = Math.floor(Math.random() * 10);
                const col = Math.floor(Math.random() * 10);
                const axis = Math.random() < 0.5 ? 'horizontal' : 'vertical';  // Random axis (horizontal/vertical)
                placed = this.board.placeShip(row, col, length, axis);  // Attempt to place the ship
            }
        });
    }

    randomAttack(board) {
        let row, col;
        do {
            row = Math.floor(Math.random() * 10);
            col = Math.floor(Math.random() * 10);
        } while (board[row][col] === 'miss' || 
                 board[row][col] === 'hit' ||  // Add check for hit cells
                 board[row][col] === 'sunk');  // Add check for sunk cells
    
        console.log(`Computer attacks: ${row}, ${col}`);  // Debugging line
        return [row, col];
    }
    
    
}

export default Player;
