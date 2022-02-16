const { merge } = require('webpack-merge');
const config = require('@craigmiller160/webpack-config');
const {
	isDevelopment
} = require('@craigmiller160/webpack-config/utils/nodeEnvCheck');
const sassConfig = require('@craigmiller160/webpack-config-sass');
const tsConfig = require('@craigmiller160/webpack-config-ts');
const { GenerateSW } = require('workbox-webpack-plugin');
const path = require('path');

const localDevServerConfig = {
	devServer: {
		port: 3000,
		https: true,
		proxy: {
			'/market-tracker/api': {
				target: 'https://localhost:8080',
				changeOrigin: true,
				secure: false,
				pathRewrite: {
					'^/market-tracker/api': ''
				},
				logLevel: 'debug'
			},
			'/market-tracker/oauth2': {
				target: 'https://localhost:7003',
				changeOrigin: true,
				secure: false,
				pathRewrite: {
					'^/market-tracker/oauth2': ''
				},
				logLevel: 'debug'
			}
		}
	}
};

// TODO delete this if useless
const serviceWorkerConfig2 = {
	entry: {
		main: path.resolve(process.cwd(), 'src'),
		serviceWorker: path.resolve(process.cwd(), 'src', 'serviceWorker.ts')
	}
};

const serviceWorkerConfig = {
	plugins: [
		new GenerateSW()
	]
}

const parts = [config, sassConfig, tsConfig, serviceWorkerConfig];

if (isDevelopment()) {
	parts.push(localDevServerConfig);
}

module.exports = merge(parts);
