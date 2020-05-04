import {
    COLS, ROWS,
} from './constants';

export default class Board {
    grid;

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
                    || (this.insideWalls(x) && this.aboveFlow(y))
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
}
