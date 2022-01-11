const { merge } = require('webpack-merge');
const config = require('@craigmiller160/webpack-config');
const sassConfig = require('@craigmiller160/webpack-config-sass');
const tsConfig = require('@craigmiller160/webpack-config-ts');

const localDevServerConfig = {
    devServer: {
        port: 3000,
        https: true,
        proxy: {}
    }
};

const parts = [config, sassConfig, tsConfig];

if (process.env.NODE_ENV === 'development') {
    parts.push(localDevServerConfig);
}

module.exports = merge(parts);