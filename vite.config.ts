/// <reference types="vitest" />
import { defineConfig } from '@craigmiller160/js-config/configs/vite/vite.config.mjs';
import { VitePWA } from 'vite-plugin-pwa';

const define = !process.env.CYPRESS
	? undefined
	: {
			'process.env.POLYGON_CLIPPING_MAX_QUEUE_SIZE': '1000000',
			'process.env.POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS': '1000000'
		};

export default defineConfig({
	server: {
		port: 3000,
		proxy: {
			'/market-tracker/api': {
				target: 'https://localhost:8080',
				changeOrigin: true,
				secure: false,
				rewrite: (path) => path.replace(/^\/market-tracker\/api/, '')
			},
			'/market-tracker/portfolios': {
				target: 'http://localhost:8082',
				changeOrigin: true,
				secure: false,
				rewrite: (path) =>
					path.replace(/^\/market-tracker\/portfolios/, '')
			}
		}
	},
	define,
	optimizeDeps: {
		include: [
			'@ant-design/icons',
			'@ant-design/plots',
			'@ant-design/charts'
		]
	},
	plugins: [
		VitePWA({
			injectRegister: 'script',
			registerType: 'autoUpdate',
			strategies: 'generateSW',
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg}']
			}
		})
	],
	test: {
		setupFiles: ['./setup.tsx'],
		environment: 'jsdom'
	}
});
