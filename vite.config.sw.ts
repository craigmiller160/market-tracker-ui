import path from 'path';

export default {
	build: {
		outDir: path.join(process.cwd(), 'build'),
		emptyOutDir: false,
		rollupOptions: {
			input: path.join(process.cwd(), 'src', 'service-worker.ts'),
			output: {
				entryFileNames: 'service-worker.js'
			}
		}
	}
};
