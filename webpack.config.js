const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'boundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: __dirname + "/src/index.html",
            inject: 'body'
        })
    ],
    module: {
            rules: [
                {
                    test: /\.js$/,
                    include: path.resolve(__dirname, 'src/js'),
                    use: {
                      loader: 'babel-loader',
                      options: {
                        presets: 'env'
                      }
                    }
                },
                {
                    test: /\.(sass|scss)$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        'sass-loader',
                      ],
                },
            ],
        },
};