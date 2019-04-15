'use strict';
const config = require('./config');
const path = require('path');
const webpack = require('webpack');

const buildEslintModule = () => ({
    test: /\.js$/,
    loader: 'eslint-loader',
    enforce: 'pre',
    include: [path.resolve(__dirname, '../', 'src')],
    options: {
        fix: true,
        emitWarning: true
    }
});

module.exports = {
    mode: config.mode || 'development',

    context: path.resolve(__dirname, '../'),

    entry: {
        app: [path.resolve(__dirname, '../', 'src', 'index.js')],
        vendor: ['phaser']
    },

    output: {
        path: config.build.assetsRoot,
        publicPath: config.build.assetsPublicPath,
        filename: config.build.outputBundle,
        chunkFilename: config.build.outputVendor
    },

    plugins: [
        new webpack.DefinePlugin({
            'CANVAS_RENDERER': JSON.stringify(true),
            'WEBGL_RENDERER': JSON.stringify(true)
        })
    ],

    module: {
        rules: [
            ...(config.dev.useEslint ? [buildEslintModule()] : []),
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
        ]
    },

    performance: {
        hints: config.dev.hints
    },

    optimization: {
        splitChunks: {
            name: 'vendor',
            chunks: 'all'
        }
    }
};
