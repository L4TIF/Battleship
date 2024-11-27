import Ship from './ship';

class GameBoard {
    constructor() {
        this.board = Array(10).fill(null).map(() => Array(10).fill(null));
        this.ships = [];
    }

    // Method to place a ship on the board
    placeShip(row, col, length, axis) {
        // Check if placement is valid
        if (axis === 'horizontal') {
            if (col + length > 10) return false;  // Check if the ship fits within the grid
            for (let i = 0; i < length; i++) {
                if (this.board[row][col + i]) return false; // Check if space is already occupied
            }
            // Create a new Ship instance and place it on the board
            const newShip = new Ship(length);
            for (let i = 0; i < length; i++) {
                this.board[row][col + i] = newShip;  // Place the ship
            }
            this.ships.push(newShip);  // Add the ship to the ships array
        } else {  // Vertical placement
            if (row + length > 10) return false;
            for (let i = 0; i < length; i++) {
                if (this.board[row + i][col]) return false; // Check if space is already occupied
            }
            // Create a new Ship instance and place it on the board
            const newShip = new Ship(length);
            for (let i = 0; i < length; i++) {
                this.board[row + i][col] = newShip;  // Place the ship
            }
            this.ships.push(newShip);  // Add the ship to the ships array
        }
        return true;  // Successfully placed the ship
    }

    receiveAttack(row, col, computerBoard = null, isEmptyBoard = false) {
        const cell = this.board[row][col];

        if (cell === 'hit' || cell === 'miss') {
            return 'already_attacked'; // Indicate the cell was already attacked
        }

        if (isEmptyBoard) {
            const computerBoardCell = computerBoard[row][col];
            if (computerBoardCell instanceof Ship) {
                this.board[row][col] = 'hit';
            } else
                this.board[row][col] = 'miss';
            return
        }


        if (cell instanceof Ship) {
            this.board[row][col] = 'hit';
            cell.hit();
            return cell.isSunk() ? 'sunk' : 'hit';
        } else {
            this.board[row][col] = 'miss';
            return 'miss';
        }
    }

    areAllShipsSunk() {
        return this.board.every(row =>
            row.every(cell => !(cell instanceof Ship) || cell.isSunk())
        );
    }


}

export default GameBoard;
