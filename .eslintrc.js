module.exports = {
    env: {
        browser: true,
        es6: true,
    },
    extends: [
        'eslint-config-airbnb-base',
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    rules: {
        'implicit-arrow-linebreak': 0,
        'max-len': [
            2,
            {
                code: 100,
            },
        ],
        'no-confusing-arrow': 0,
        'import/prefer-default-export': 0,
        'indent': [2, 4, {
            'SwitchCase': 1
        }],
        'class-methods-use-this': 'off',
        'no-nested-ternary': 'off'
    },
};
