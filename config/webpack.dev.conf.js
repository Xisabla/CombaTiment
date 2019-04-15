'use strict';
const config = require('./config');
const merge = require('webpack-merge');
const WebpackConfig = require('./webpack.base.conf');

module.exports = merge(WebpackConfig, {
    mode: 'development',

    devServer: {
        compress: true,
        host: config.dev.server.host || 'localhost',
        port: config.dev.server.port || 3000
    },

    watch: config.dev.server.watch
});
