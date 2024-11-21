import GameBoard from "../src/gameboard";
import Ship from "../src/ship";


describe('GameBoard', () => {

    describe('placeShips', () => {

        let gameboard;
        beforeEach(() => {
            gameboard = new GameBoard();
        });

        test('should place ship at a given coordinates', () => {
            const battleShip = new Ship(4);
            gameboard.placeShip(battleShip, [6, 4], 'x'); //place ship takes a ship Object , (i,j) coordinates and x,y axis.

            expect(gameboard.board[6][4].ship).toBe(battleShip);
            expect(gameboard.board[6][5].ship).toBe(battleShip);
            expect(gameboard.board[6][6].ship).toBe(battleShip);
            expect(gameboard.board[6][7].ship).toBe(battleShip);
        });

        test('should place ship at a give y axis coordinates', () => {
            const battleShip = new Ship(5);
            gameboard.placeShip(battleShip, [1, 4], 'y'); //place ship takes a ship Object , (i,j) coordinates and x,y axis.

            expect(gameboard.board[1][4].ship).toBe(battleShip);
            expect(gameboard.board[2][4].ship).toBe(battleShip);
            expect(gameboard.board[3][4].ship).toBe(battleShip);
            expect(gameboard.board[4][4].ship).toBe(battleShip);
            expect(gameboard.board[5][4].ship).toBe(battleShip);
        });

        test('should not go beyond the board ', () => {
            const battleShip = new Ship(5);
            gameboard.placeShip(battleShip, [8, 8], 'x');
            expect(gameboard.board[8][8]).toBeNull();
        })

        test('should not go beyond the board in y axis ', () => {
            const battleShip = new Ship(5);
            gameboard.placeShip(battleShip, [8, 4], 'y');
            expect(gameboard.board[8][4]).toBeNull();
        })

        test('should not overlap with other ships', () => {
            const submarine = new Ship(3);
            gameboard.placeShip(submarine, [1, 1], 'x');
            const battleShip = new Ship(2);
            gameboard.placeShip(battleShip, [1, 2], 'y');

            expect(gameboard.board[2][2]).toBeNull();

        })

    });

    describe('recive attack', () => {
        let gameBoard;

        beforeEach(() => {
            gameBoard = new GameBoard();
            gameBoard.placeShip(gameBoard.carrier, [2, 3], 'x');
            gameBoard.placeShip(gameBoard.battleship, [5, 3], 'y');
            gameBoard.placeShip(gameBoard.submarine, [5, 6], 'x');
            gameBoard.placeShip(gameBoard.cruiser, [7, 6], 'y');
            gameBoard.placeShip(gameBoard.destroyer, [1, 1], 'y');
         
        });

        test('should hit the ship with coordinates ', () => {

            gameBoard.receiveAttack([5, 3]);

            expect(gameBoard.battleship.hits).toBeGreaterThan(0);
            expect(gameBoard.board[5][3].hit).toBeTruthy();

        })

        test('should not do anything if the there is no ship', () => {
            gameBoard.receiveAttack([5, 4]);

            expect(gameBoard.battleship.hits).toBeLessThanOrEqual(0);
            expect(gameBoard.board[9][6].hit).toBeFalsy();

        })

        test('should have track of missed attacks', () => {

            gameBoard.receiveAttack([0, 4])
            gameBoard.receiveAttack([3, 1])
            gameBoard.receiveAttack([7, 7])

            expect(gameBoard.missedAttacks).toEqual(
                [[0, 4],
                [3, 1],
                [7, 7]]
            )

        })

        test('The gameboard reports if all ships are sunk', () => {

            for (let i = 2, j = 3, k = 0; k < 5; j++, k++) {
                gameBoard.receiveAttack([i, j]);
            }

            for (let i = 5, j = 3, k = 0; k < 4; i++, k++) {
                gameBoard.receiveAttack([i, j]);
            }
            for (let i = 5, j = 6, k = 0; k < 3; j++, k++) {
                gameBoard.receiveAttack([i, j]);
            }

            for (let i = 7, j = 6, k = 0; k < 3; i++, k++) {
                gameBoard.receiveAttack([i, j]);
            }

            for (let i = 1, j = 1, k = 0; k < 2; i++, k++) {
                gameBoard.receiveAttack([i, j]);
            }
           
            expect(gameBoard.allSunk).toBeTruthy();
        });


    })

});