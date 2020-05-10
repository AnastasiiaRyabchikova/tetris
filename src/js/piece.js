import { COLORS, SHAPES } from './constants';

export default class Piece {
    x;

    y;

    color;

    shape;

    ctx;

    constructor(ctx) {
        this.ctx = ctx;
        this.spawn();
    }

    spawn() {
        const typeID = this.randomize(COLORS.length);
        this.shape = SHAPES[typeID];
        this.color = COLORS[typeID];

        // Starting position.
        this.x = 0;
        this.y = 0;
    }

    randomize(noOfTypes) {
        return Math.floor(Math.random() * noOfTypes);
    }

    draw(ctx = this.ctx) {
        ctx.fillStyle = this.color;
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
            // this.x, this.y gives the left upper position of the shape
            // x, y gives the position of the block in the shape
            // this.x + x is then the position of the block on the board
                if (value > 0) {
                    ctx.fillRect(this.x + x, this.y + y, 1, 1);
                }
            });
        });
    }

    move(p) {
        this.x = p.x;
        this.y = p.y;
        this.shape = p.shape;
    }
}
