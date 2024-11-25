// index.js
import  GameManager  from './gameManager';
import  DOM  from './dom';
import './styles/style.css'


const gameManager = new GameManager();
const dom = new DOM(gameManager);

// Initialize the game
dom.renderBoard();
dom.renderShipSelection();
