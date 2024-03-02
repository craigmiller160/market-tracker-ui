import { defineConfig } from 'cypress';

export default defineConfig({
	retries: {
		openMode: 0,
		runMode: 4
	},
	screenshotOnRunFailure: true,
	video: false,
	component: {
		devServer: {
			framework: 'react',
			bundler: 'vite'
		}
	}
});
