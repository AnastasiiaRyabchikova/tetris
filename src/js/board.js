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
}
