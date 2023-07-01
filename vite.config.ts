import path from 'path';
import react from '@vitejs/plugin-react-swc';
import fs from 'fs';
import { defineConfig } from 'vite';

const https =
	process.env.CYPRESS === 'true'
		? undefined
		: {
				cert: fs.readFileSync(
					path.join(process.cwd(), 'config', 'localhost.cert.pem'),
					'utf8'
				),
				key: fs.readFileSync(
					path.join(process.cwd(), 'config', 'localhost.key.pem'),
					'utf8'
				)
		  };

const define = !process.env.CYPRESS
	? undefined
	: {
			'process.env.POLYGON_CLIPPING_MAX_QUEUE_SIZE': '1000000',
			'process.env.POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS': '1000000'
	  };

export default defineConfig({
	root: path.join(process.cwd(), 'src'),
	base: '/market-tracker/',
	publicDir: path.join(process.cwd(), 'public'),
	envDir: path.join(process.cwd(), 'environment'),
	define,
	optimizeDeps: {
		include: [
			'@ant-design/icons',
			'@ant-design/plots',
			'@ant-design/charts'
		]
	},
	server: {
		port: 3000,
		host: true,
		https,
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
			},
			'/market-tracker/service-worker.js': {
				target: 'https://localhost:3000',
				changeOrigin: true,
				secure: false,
				rewrite: (path) => path.replace(/^\/market-tracker/, '')
			}
		}
	},
	plugins: [react()],
	build: {
		outDir: path.join(process.cwd(), 'build'),
		emptyOutDir: true
	}
});
