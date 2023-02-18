const merge = require('@craigmiller160/config-merge');
const jestConfig = require('@craigmiller160/jest-config');
const {
	libPatterns,
	createCombinedPattern
} = require('@craigmiller160/jest-config/utils/libsToRecompile');
const path = require('path');

const config = merge(jestConfig, {
	setupFilesAfterEnv: [path.join(process.cwd(), 'test', 'setup.tsx')]
});

module.exports = {
	...config,
	transformIgnorePatterns: [
		...config.transformIgnorePatterns.slice(1),
		createCombinedPattern([
			...libPatterns,
			'@antv\/xflow-core' // eslint-disable-line
		])
	]
};
