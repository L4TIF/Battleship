import GameBoard from "./gameboard";
import Ship from "./ship";

class Player {
    constructor(name, isComputer = false) {
        this.name = name;
        this.isComputer = isComputer;
        this.board = new GameBoard();  // Initialize the board here
    }

    randomAttack(board) {
        let row, col;
        do {
            row = Math.floor(Math.random() * 10);
            col = Math.floor(Math.random() * 10);
        } while (board[row][col] === 'miss' || 
                 (board[row][col] instanceof Ship && board[row][col].isSunk()));
                 console.log(`Computer attacks: ${row}, ${col}`);  // Debugging line
        return [row, col];
    }
    
}

export default Player;
