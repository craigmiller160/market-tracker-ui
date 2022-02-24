import path from 'path';
import react from '@vitejs/plugin-react';

export default {
	root: path.join(process.cwd(), 'src'),
	publicDir: path.join(process.cwd(), 'public'),
	server: {
		port: 3000
	},
	plugins: [react()],
	build: {
		outDir: path.join(process.cwd(), 'build')
	}
};
