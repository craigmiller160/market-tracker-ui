import path from 'path';
import react from '@vitejs/plugin-react-swc';
import fs from 'fs';
import { defineConfig } from 'vite';

export default defineConfig({
	root: path.join(process.cwd(), 'src'),
	base: '/market-tracker/',
	publicDir: path.join(process.cwd(), 'public'),
	envDir: path.join(process.cwd(), 'environment'),
	server: {
		port: 3000,
		host: true,
		https: {
			cert: fs.readFileSync(
				path.join(process.cwd(), 'config', 'localhost.cert.pem'),
				'utf8'
			),
			key: fs.readFileSync(
				path.join(process.cwd(), 'config', 'localhost.key.pem'),
				'utf8'
			)
		},
		proxy: {
			'/market-tracker/api': {
				target: 'https://localhost:8080',
				changeOrigin: true,
				secure: false,
				rewrite: (path) => path.replace(/^\/market-tracker\/api/, ''),
				logLevel: 'debug'
			},
			'/market-tracker/oauth2': {
				target: 'https://localhost:7003',
				changeOrigin: true,
				secure: false,
				rewrite: (path) =>
					path.replace(/^\/market-tracker\/oauth2/, ''),
				logLevel: 'debug'
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
