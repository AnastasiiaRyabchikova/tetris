// Переменные, описывающие габариты канваса

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

const NEXTCOLS = 4;

const KEY = {
    LEFT: 37,
    RIGHT: 39,
    DOWN: 40,
    UP: 38,
    SPACE: 32,
};

const COLORS = [
    'cyan',
    'blue',
    'orange',
    'yellow',
    'green',
    'purple',
    'red',
];

const SHAPES = [
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    [
        [2, 0, 0],
        [2, 2, 2],
        [0, 0, 0],
    ],
    [
        [0, 0, 3],
        [3, 3, 3],
        [0, 0, 0],
    ],
    [
        [4, 4],
        [4, 4],
    ],
    [
        [0, 5, 5],
        [5, 5, 0],
        [0, 0, 0],
    ],
    [
        [6, 6, 0],
        [0, 6, 6],
        [0, 0, 0],
    ],
    [
        [0, 7, 0],
        [7, 7, 7],
        [0, 0, 0],
    ],
];

Object.freeze(KEY);

const POINTS = {
    SINGLE: 100,
    DOUBLE: 300,
    TRIPLE: 500,
    TETRIS: 800,
    SOFT_DROP: 1,
    HARD_DROP: 2,
};
Object.freeze(POINTS);
export {
    COLS, ROWS, BLOCK_SIZE, KEY, COLORS, SHAPES, POINTS, NEXTCOLS,
};
