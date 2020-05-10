import {
    COLS, ROWS, COLORS, POINTS, NEXTCOLS, KEY, BLOCK_SIZE,
} from './constants';

import Piece from './piece';


export default class Board {
    grid;

    ctx;

    ctxNext;

    account;

    next;

    time = { start: 0, elapsed: 0 }

    moves = {
        [KEY.LEFT]: (p) => ({ ...p, x: p.x - 1 }),
        [KEY.RIGHT]: (p) => ({ ...p, x: p.x + 1 }),
        [KEY.DOWN]: (p) => ({ ...p, y: p.y + 1 }),
        [KEY.UP]: (p) => (this.rotate(p)),
        [KEY.SPACE]: (p) => ({ ...p, y: p.y + 1 }),
    }

    constructor({
        board, nextBoard,
    }) {
        this.ctx = document.querySelector(board).getContext('2d');
        this.ctx.canvas.width = COLS * BLOCK_SIZE;
        this.ctx.canvas.height = ROWS * BLOCK_SIZE;
        this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

        this.ctxNext = document.querySelector(nextBoard).getContext('2d');
        this.ctxNext.canvas.width = NEXTCOLS * BLOCK_SIZE;
        this.ctxNext.canvas.height = NEXTCOLS * BLOCK_SIZE;
        this.ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);

        const account = {
            score: 0,
            lines: 0,
            level: 0,
        };

        function updateAccount(key, value) {
            const elem = document.getElementById(key);
            if (elem) elem.textContent = value;
        }

        this.account = new Proxy(account, {
            set(target, property, value) {
                target[property] = value;
                updateAccount(property, value);
                return true;
            },
        });
    }

    play(e) {
        e.target.blur();
        this.resetGame();
        this.piece = new Piece(this.ctx);
        this.next = new Piece(this.ctx);
        this.next.draw(this.ctxNext);
        this.animate();
        document.addEventListener('keydown', (event) => this.keydownEventListener(event));
    }

    keydownEventListener(e) {
        if (this.moves[e.keyCode]) {
            e.preventDefault();
            let p = this.moves[e.keyCode](this.piece);
            if (this.valid(p)) {
                if (e.keyCode === KEY.DOWN) this.account.score += POINTS.SOFT_DROP;
                this.piece.move(p);
                this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
                this.draw();
            }
            if (e.keyCode === KEY.SPACE) {
                while (this.valid(p)) {
                    this.piece.move(p);
                    p = this.moves[KEY.DOWN](this.piece);
                    this.account.score += POINTS.HARD_DROP;
                }
                this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
                this.draw();
            }
        }
    }

    resetGame() {
        this.grid = this.getEmptyBoard();
        this.ctxNext.fillStyle = 'white';
        this.ctxNext.fillRect(0, 0, NEXTCOLS, NEXTCOLS);
        this.account.score = 0;
        this.account.lines = 0;
        this.account.level = 0;
    }

    getEmptyBoard() {
        return Array.from(Array(ROWS), () => Array(COLS).fill(0));
    }

    valid(p) {
        return p.shape.every((row, indexY) => row.every((item, indexX) => {
            const x = p.x + indexX;
            const y = p.y + indexY;
            return (
                this.isEmpty(item)
                    || (this.insideWalls(x) && this.aboveFlow(y) && this.isEmptyBoardRect(x, y))
            );
        }));
    }

    isEmpty(item) {
        return item === 0;
    }

    insideWalls(x) {
        return x >= 0 && x < COLS;
    }

    aboveFlow(y) {
        return y >= 0 && y < ROWS;
    }

    isEmptyBoardRect(x, y) {
        return this.grid[y][x] === 0;
    }


    rotate(piece) {
        const p = JSON.parse(JSON.stringify(piece));
        for (let y = 0; y < p.shape.length; y += 1) {
            for (let x = 0; x < y; x += 1) {
                [p.shape[x][y], p.shape[y][x]] = [p.shape[y][x], p.shape[x][y]];
            }
        }
        p.shape.forEach((row) => row.reverse());
        return p;
    }

    drawBoard() {
        this.grid.forEach((row, indexY) => {
            row.forEach((item, indexX) => {
                if (item > 0) {
                    this.ctx.fillStyle = COLORS[item - 1];
                    this.ctx.fillRect(indexX, indexY, 1, 1);
                }
            });
        });
    }

    draw() {
        this.piece.draw();
        this.drawBoard();
    }


    drop() {
        const p = { ...this.piece, y: this.piece.y + 1 };
        if (this.valid(p)) {
            this.piece.move(p);
        } else {
            if (this.piece.y === 0) {
                return false;
            }
            this.freeze();
            this.removeFullLine();
            this.piece = this.next;
            this.next = new Piece(this.ctx);
            this.ctxNext.fillStyle = 'white';
            this.ctxNext.fillRect(0, 0, NEXTCOLS, NEXTCOLS);
            this.next.draw(this.ctxNext);
        }
        return true;
    }

    gameOver() {
        cancelAnimationFrame(this.requestId);
        this.ctx.fillStyle = 'rgba(100, 100, 100, 0.5)';
        this.ctx.fillRect(0, 0, COLS, ROWS);
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(COLS * 0.15, ROWS / 5, COLS * 0.7, 3);
        this.ctx.font = '1px Arial';
        this.ctx.fillStyle = 'red';
        this.ctx.fillText('GAME OVER', COLS * 0.2, ROWS * 0.29);
    }

    freeze() {
        this.piece.shape.forEach((row, y) => {
            row.forEach((item, x) => {
                if (item > 0) {
                    this.grid[this.piece.y + y][this.piece.x + x] = item;
                }
            });
        });
    }


    getLineClearPoints(lines) {
        return lines === 1 ? POINTS.SINGLE
            : lines === 2 ? POINTS.DOUBLE
                : lines === 3 ? POINTS.TRIPLE
                    : lines === 4 ? POINTS.TETRIS
                        : 0;
    }

    setNextLevel() {
        this.account.level += 1;
    }

    removeFullLine() {
        let lines = 0;
        this.grid.forEach((row, index) => {
            const isRowFull = row.every((item) => item > 0);
            if (isRowFull) {
                lines += 1;
                const arr = Array(COLS).fill(0);
                this.grid.splice(index, 1);
                this.grid.unshift(arr);
            }
        });
        if (lines > 0) {
            this.account.lines += lines;
            this.account.score += this.getLineClearPoints(lines) * (this.account.level + 1);
            if (this.account.lines > 9) {
                this.setNextLevel();
            }
        }
    }

    animate(now = 0) {
        // Update elapsed time.
        this.time.elapsed = now - this.time.start;

        // If elapsed time has passed time for current level
        if (this.time.elapsed > Math.max(1000 - 50 * this.account.level, 20)) {
            // Restart counting from now
            this.time.start = now;
            if (!this.drop()) {
                this.gameOver();
                return;
            }
        }

        // Clear board before drawing new state.
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.draw();
        this.requestId = requestAnimationFrame(this.animate.bind(this));
    }
}
