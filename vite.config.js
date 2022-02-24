import path from 'path';
import react from '@vitejs/plugin-react';
import fs from 'fs';

export default {
	root: path.join(process.cwd(), 'src'),
	// base: '/market-tracker',
	publicDir: path.join(process.cwd(), 'public'),
	server: {
		port: 3000,
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
				pathRewrite: {
					'^/market-tracker/api': ''
				},
				logLevel: 'debug'
			}
		},
	},
	plugins: [react()],
	build: {
		outDir: path.join(process.cwd(), 'build')
	}
};
