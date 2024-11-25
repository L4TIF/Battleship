// GameManager.js

export default class GameManager {
    constructor() {
        this.board = Array(10).fill().map(() => Array(10).fill(null));  // Initialize an empty board
        this.ships = [
            { name: 'Carrier', size: 5 },
            { name: 'Battleship', size: 4 },
            { name: 'Cruiser', size: 3 },
            { name: 'Submarine', size: 3 },
            { name: 'Destroyer', size: 2 },
        ];  // Ships with different sizes
        this.currentShipIndex = 0;  // Start with the first ship
        this.axis = 'horizontal'; // Default axis is horizontal
    }

    // Function to toggle the axis
    toggleAxis() {
        this.axis = this.axis === 'horizontal' ? 'vertical' : 'horizontal';
    }

    // Place ships on the board
    placeShip(row, col, length, axis) {
        if (axis === 'horizontal') {
            if (col + length > 10) return false; // Ship goes off the board
            for (let i = 0; i < length; i++) {
                if (this.board[row][col + i] !== null) return false; // Cell is already occupied
            }
            for (let i = 0; i < length; i++) {
                this.board[row][col + i] = 'ship'; // Mark cells with the ship
            }
        } else {  // Vertical
            if (row + length > 10) return false; // Ship goes off the board
            for (let i = 0; i < length; i++) {
                if (this.board[row + i][col] !== null) return false; // Cell is already occupied
            }
            for (let i = 0; i < length; i++) {
                this.board[row + i][col] = 'ship'; // Mark cells with the ship
            }
        }
        return true;
    }

    // Get the current ship
    getCurrentShip() {
        return this.ships[this.currentShipIndex];
    }

    // Move to the next ship in the list
    nextShip() {
        if (this.currentShipIndex < this.ships.length - 1) {
            this.currentShipIndex++;
        } else {
            alert('All ships placed!');
        }
    }
}
