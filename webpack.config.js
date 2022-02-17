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

// TODO see about adding optional service-worker support into main config... or maybe that's going too far?
const serviceWorkerConfig = {
	entry: {
		main: path.join(process.cwd(), 'src'),
		'service-worker2': path.join(process.cwd(), 'src', 'service-worker2.ts')
	},
	output: {
		// TODO apply this to the main config and to the CSS files and see if it works
		filename: 'assets/js/[name].js?hash=[contenthash]'
	},
	plugins: [
		new GenerateSW({
			exclude: [ // TODO only do this in dev
				/.*/
			],
			runtimeCaching: [
				{
					handler: 'NetworkFirst',
					urlPattern: /.*\/api\/tradier\/.*/,
					options: {
						cacheName: 'tradier'
					}
				}
			],
			clientsClaim: true,
			skipWaiting: true
		})
	]
};

const parts = [config, sassConfig, tsConfig, serviceWorkerConfig];

if (isDevelopment()) {
	parts.push(localDevServerConfig);
}

module.exports = merge(parts);
