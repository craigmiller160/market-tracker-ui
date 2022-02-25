import path from 'path';

export default {
	build: {
		outDir: path.join(process.cwd(), 'build'),
		emptyOutDir: true,
		rollupOptions: {
			input: path.join(process.cwd(), 'src', 'service-worker.js'),
			output: {
				entryFileNames: 'service-worker.js'
			}
		}
	}
};
