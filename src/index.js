import './scss/style.scss';

import Board from './js/board';

const tetris = new Board({
    board: '#board',
    nextBoard: '#next',
});

document.querySelector('.play-button').addEventListener('click', (e) => tetris.play(e));
