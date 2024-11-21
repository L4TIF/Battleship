import GameBoard from "./gameboard";

export default class Player {
    constructor(name = 'Computer') {
        this.name = name;
        this.GameBoard = new GameBoard();
    }
}