import './styles/style.css';
import GameManager from './gameManager';
import DOM from './dom';

const gameManager = new GameManager();
const dom = new DOM(gameManager);

dom.init();
