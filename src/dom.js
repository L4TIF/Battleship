// DOM.js

import GameManager from './gameManager.js';

export default class DOM {
    constructor() {
        this.gameManager = new GameManager();
        this.boardElement = document.getElementById('board');
        this.axisToggleButton = document.getElementById('axis-toggle');
        this.shipPreview = null;

        this.renderBoard();
        this.setupEventListeners();
    }

    // Render the board grid
    renderBoard() {
        this.boardElement.innerHTML = ''; // Clear the board before rendering

        // Create grid cells with a modern UI style
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 10; col++) {
                const cell = document.createElement('div');
                cell.classList.add('board-cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                this.boardElement.appendChild(cell);
            }
        }

        this.boardElement.classList.add('board');
    }

    // Handle cell click for placing ships
    handleCellClick(row, col) {
        const currentShip = this.gameManager.getCurrentShip();
        const axis = this.gameManager.axis;

        if (this.gameManager.placeShip(row, col, currentShip.size, axis)) {
            this.updateBoard();
            this.gameManager.nextShip();
        }
    }

    // Update the board UI after placing a ship
    updateBoard() {
        const cells = document.querySelectorAll('.board-cell');
        cells.forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            if (this.gameManager.board[row][col] === 'ship') {
                cell.classList.add('ship-placed');
            }
        });
    }

    // Setup event listeners for axis toggle and cell clicks
    setupEventListeners() {
        // Toggle axis on button click
        this.axisToggleButton.addEventListener('click', () => {
            this.gameManager.toggleAxis();
        });

        // Handle cell click to place ships
        this.boardElement.addEventListener('click', (e) => {
            if (e.target.classList.contains('board-cell')) {
                const row = parseInt(e.target.dataset.row);
                const col = parseInt(e.target.dataset.col);
                this.handleCellClick(row, col);
            }
        });

        // Listen for ship preview during hover
        this.boardElement.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('board-cell')) {
                this.previewShip(e.target);
            }
        });

        // Remove preview on mouse out
        this.boardElement.addEventListener('mouseout', () => {
            this.removeShipPreview();
        });
    }

    // Preview the ship during hover
    previewShip(target) {
        const currentShip = this.gameManager.getCurrentShip();
        const row = parseInt(target.dataset.row);
        const col = parseInt(target.dataset.col);
        const axis = this.gameManager.axis;

        if (this.shipPreview) {
            this.removeShipPreview();
        }

        this.shipPreview = document.createElement('div');
        this.shipPreview.classList.add('ship-preview');

        let validPlacement = true;

        if (axis === 'horizontal') {
            if (col + currentShip.size > 10) validPlacement = false;
            for (let i = 0; i < currentShip.size; i++) {
                const cell = document.querySelector(`[data-row='${row}'][data-col='${col + i}']`);
                if (!cell || cell.classList.contains('ship-placed')) validPlacement = false;
                this.shipPreview.style.width = `${currentShip.size * 50}px`;
                this.shipPreview.style.height = '50px';
            }
        } else {
            if (row + currentShip.size > 10) validPlacement = false;
            for (let i = 0; i < currentShip.size; i++) {
                const cell = document.querySelector(`[data-row='${row + i}'][data-col='${col}']`);
                if (!cell || cell.classList.contains('ship-placed')) validPlacement = false;
                this.shipPreview.style.height = `${currentShip.size * 50}px`;
                this.shipPreview.style.width = '50px';
            }
        }

        this.shipPreview.classList.toggle('valid', validPlacement);
        this.shipPreview.classList.toggle('invalid', !validPlacement);

        this.boardElement.appendChild(this.shipPreview);
        this.positionShipPreview(row, col, axis);
    }

    // Position the preview on the board
    positionShipPreview(row, col, axis) {
        const cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
        if (axis === 'horizontal') {
            this.shipPreview.style.top = `${cell.offsetTop}px`;
            this.shipPreview.style.left = `${cell.offsetLeft}px`;
        } else {
            this.shipPreview.style.top = `${cell.offsetTop}px`;
            this.shipPreview.style.left = `${cell.offsetLeft}px`;
        }
    }

    // Remove the preview ship
    removeShipPreview() {
        if (this.shipPreview) {
            this.shipPreview.remove();
            this.shipPreview = null;
        }
    }
}
