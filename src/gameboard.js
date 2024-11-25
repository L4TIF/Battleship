
import Ship from "./ship";

class GameBoard {
    constructor() {
        this.board = Array(10).fill().map(() => Array(10).fill(null)); //10*10 board


        // initializing all ships
        this.carrier = new Ship(5);
        this.battleship = new Ship(4);
        this.cruiser = new Ship(3);
        this.submarine = new Ship(3);
        this.destroyer = new Ship(2);

        // array of all ships
        this.ships = [
            this.carrier,
            this.battleship,
            this.cruiser,
            this.submarine,
            this.destroyer,
        ];

    }

    missedAttacks = [];
    allSunk = false;


    #isCoordinatesExist([i, j]) {
        // Check if starting coordinates are within bounds
        if (i < 0 || j < 0 || i >= this.board.length || j >= this.board[i].length) return false;
        return true
    }


    #isValidCoordinates(shipLength, [i, j], axis) {
        if (!this.#isCoordinatesExist([i, j])) return false

        // Check if the tail of the ship is within bounds for the given axis
        if (axis === 'x' && (j + shipLength - 1 >= this.board[i].length)) {
            return false; // the ship exceeds the right edge
        } else if (axis === 'y' && (i + shipLength - 1 >= this.board.length)) {
            return false; // the ship exceeds the bottom edge
        }


        for (let index = 0; index < shipLength; index++) {
            if (this.board[i][j] !== null)
                return false
            axis === 'x' ? j++ : i++; //increace column if x axis and row if y axis
            continue;
        }
        return true;
    }

    #isAllShipsSunk() {
        return this.ships.every(ship => ship.isSunk());
    }


    placeShip(row, col, shipLength, axis) {
        const success = this.player.GameBoard.placeShip({ shipLength }, [row, col], axis);
    
        if (success) {
            console.log(`Ship placed at (${row}, ${col})`);
            this.dom.renderGameBoard(this.player.GameBoard, "playerBoard");
        } else {
            alert("Invalid ship placement. Try again.");
        }
    }
    
    

    receiveAttack([i, j]) {
        if (!this.#isCoordinatesExist([i, j])) return

        if (this.board[i][j] !== null && !this.board[i][j].hit) {
            this.board[i][j].hit = true;
            this.board[i][j].ship.hit();

        } else if (this.board[i][j] === null) {

            this.missedAttacks.push([i, j]);
        }


        // if all sunk
        this.allSunk = this.#isAllShipsSunk();
    }
    logBoard() {
        console.table(
            this.board.map(row => 
                row.map(cell => 
                    cell ? (cell.hit ? 'X' : 'S') : this.missedAttacks.some(([x, y]) => x === row && y === cell) ? 'M' : '-'
                )
            )
        );
    }
    

}



export default GameBoard;
