import './scss/style.scss';

import {
    COLS, ROWS, BLOCK_SIZE, KEY, POINTS,
} from './js/constants';
import Board from './js/board';
import Piece from './js/piece';

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;
ctx.scale(BLOCK_SIZE, BLOCK_SIZE);


let account = {
    score: 0,
    lines: 0,
};

function updateAccount(key, value) {
    const elem = document.getElementById(key);
    if (elem) elem.textContent = value;
}

account = new Proxy(account, {
    set(target, property, value) {
        target[property] = value;
        updateAccount(property, value);
        return true;
    },
});

const board = new Board(ctx, account);


const MOVES = {
    [KEY.LEFT]: (p) => ({ ...p, x: p.x - 1 }),
    [KEY.RIGHT]: (p) => ({ ...p, x: p.x + 1 }),
    [KEY.DOWN]: (p) => ({ ...p, y: p.y + 1 }),
    [KEY.UP]: (p) => (board.rotate(p)),
    [KEY.SPACE]: (p) => ({ ...p, y: p.y + 1 }),
};


let requestId;

const time = { start: 0, elapsed: 0, level: 1000 };

function animate(now = 0) {
    // Update elapsed time.
    time.elapsed = now - time.start;

    // If elapsed time has passed time for current level
    if (time.elapsed > time.level) {
        // Restart counting from now
        time.start = now;
        board.drop();
    }

    // Clear board before drawing new state.
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    board.draw();
    requestId = requestAnimationFrame(animate);
}

function play(e) {
    e.target.blur();
    board.reset();
    const piece = new Piece(ctx);
    board.piece = piece;
    animate();
}


document.querySelector('.play-button').addEventListener('click', play);
document.addEventListener('keydown', (e) => {
    if (MOVES[e.keyCode]) {
        e.preventDefault();
        let p = MOVES[e.keyCode](board.piece);
        if (board.valid(p)) {
            if (e.keyCode === KEY.DOWN) board.account.score += POINTS.SOFT_DROP;
            board.piece.move(p);
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            board.piece.draw();
        }
        if (e.keyCode === KEY.SPACE) {
            while (board.valid(p)) {
                board.piece.move(p);
                p = MOVES[KEY.DOWN](board.piece);
                board.account.score += POINTS.HARD_DROP;
            }
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            board.piece.draw();
        }
    }
});
