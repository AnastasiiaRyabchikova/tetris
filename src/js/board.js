import {
    COLS, ROWS, COLORS, POINTS,
} from './constants';

import Piece from './piece';


export default class Board {
    grid;

    ctx;

    account;

    constructor(ctx, account) {
        this.ctx = ctx;
        this.account = account;
    }

    reset() {
        this.grid = this.getEmptyBoard();
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
        // Clone with JSON for immutability
        const p = JSON.parse(JSON.stringify(piece));
        // Transpose matrix, p is the Piece.
        for (let y = 0; y < p.shape.length; y += 1) {
            for (let x = 0; x < y; x += 1) {
                [p.shape[x][y], p.shape[y][x]] = [p.shape[y][x], p.shape[x][y]];
            }
        }

        // Reverse the order of the columns.
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
            this.freeze();
            this.removeFullLine();
            this.piece = new Piece();
            this.piece.ctx = this.ctx;
        }
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
            this.account.score += this.getLineClearPoints(lines);
        }
    }
}
