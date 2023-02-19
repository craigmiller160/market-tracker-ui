import { defineConfig } from 'cypress';

export default defineConfig({
	screenshotOnRunFailure: false,
	video: false,
	component: {
		devServer: {
			framework: 'react',
			bundler: 'vite'
		}
	}
});
