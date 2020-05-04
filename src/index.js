import './scss/style.scss';

import {
    COLS, ROWS, BLOCK_SIZE, KEY,
} from './js/constants';
import Board from './js/board';
import Piece from './js/piece';

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;

ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

const board = new Board();


const MOVES = {
    [KEY.LEFT]: (p) => ({ ...p, x: p.x - 1 }),
    [KEY.RIGHT]: (p) => ({ ...p, x: p.x + 1 }),
    [KEY.DOWN]: (p) => ({ ...p, y: p.y + 1 }),
    [KEY.UP]: (p) => (board.rotate(p)),
    [KEY.SPACE]: (p) => ({ ...p, y: p.y + 1 }),
};

function play(e) {
    e.target.blur();
    board.reset();
    const piece = new Piece(ctx);
    piece.draw();
    board.piece = piece;
}


document.querySelector('.play-button').addEventListener('click', play);
document.addEventListener('keydown', (e) => {
    if (MOVES[e.keyCode]) {
        e.preventDefault();
        let p = MOVES[e.keyCode](board.piece);
        if (board.valid(p)) {
            board.piece.move(p);
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            board.piece.draw();
        }
        if (e.keyCode === KEY.SPACE) {
            while (board.valid(p)) {
                board.piece.move(p);
                p = MOVES[KEY.DOWN](board.piece);
            }
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            board.piece.draw();
        }
    }
});
