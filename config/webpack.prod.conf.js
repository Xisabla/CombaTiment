'use strict';
const merge = require('webpack-merge');
const WebpackConfig = require('./webpack.base.conf');

module.exports = merge(WebpackConfig, {
    mode: 'production'
});
