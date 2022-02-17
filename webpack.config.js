const { merge } = require('webpack-merge');
const config = require('@craigmiller160/webpack-config');
const {
	isDevelopment
} = require('@craigmiller160/webpack-config/utils/nodeEnvCheck');
const sassConfig = require('@craigmiller160/webpack-config-sass');
const tsConfig = require('@craigmiller160/webpack-config-ts');
const path = require('path');
const fs = require('fs');

const localDevServerConfig = {
	devServer: {
		port: 3000,
		server: {
			type: 'https',
			options: {
				cert: fs.readFileSync(
					path.join(process.cwd(), 'config', 'localhost.cert.pem'),
					'utf8'
				),
				key: fs.readFileSync(
					path.join(process.cwd(), 'config', 'localhost.key.pem'),
					'utf8'
				)
			}
		},
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

// /api/tradier
// /api/coingecko

// TODO see about adding optional service-worker support into main config... or maybe that's going too far?
const serviceWorkerBase = {
	entry: path.join(process.cwd(), 'src', 'service-worker.ts'),
	target: 'webworker',
	output: {
		path: path.join(process.cwd(), 'build'),
		filename: '[name].js?hash=[contenthash]',
		chunkFilename: '[name].js?hash=[contenthash]',
		publicPath: process.env.WEBPACK_PUBLIC_PATH || '/'
	}
};

const standardParts = [config, sassConfig, tsConfig];
const serviceWorkerParts = [serviceWorkerBase, tsConfig];

if (isDevelopment()) {
	standardParts.push(localDevServerConfig);
	serviceWorkerParts.push(localDevServerConfig);
}

const standardConfig = merge(standardParts);
const serviceWorkerConfig = merge(serviceWorkerParts);

module.exports = [standardConfig, serviceWorkerConfig];
