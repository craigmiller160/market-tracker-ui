const { merge } = require('webpack-merge');
const config = require('@craigmiller160/webpack-config');
const {
	isDevelopment
} = require('@craigmiller160/webpack-config/utils/nodeEnvCheck');
const sassConfig = require('@craigmiller160/webpack-config-sass');
const tsConfig = require('@craigmiller160/webpack-config-ts');
const path = require('path');
const fs = require('fs');
const { GenerateSW } = require('workbox-webpack-plugin');

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

// TODO getting warnings about files i don't care about
// TODO once all issues are resolved, get rid of full-screen warnings
const serviceWorkerConfig = {
	plugins: [
		new GenerateSW({
			runtimeCaching: [
				{
					handler: 'NetworkFirst',
					urlPattern: /\/api\/tradier/
				}
			]
		})
	]
};

const parts = [config, sassConfig, tsConfig, serviceWorkerConfig];

if (isDevelopment()) {
	parts.push(localDevServerConfig);
}

module.exports = merge(parts);
