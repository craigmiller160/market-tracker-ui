const merge = require('@craigmiller160/config-merge');
const jestConfig = require('@craigmiller160/jest-config');
const jestTsConfig = require('@craigmiller160/jest-config-ts');
const path = require('path');

const config = merge(jestConfig, jestTsConfig, {
	setupFilesAfterEnv: [path.join(process.cwd(), 'test', 'setup.ts')]
});

module.exports = {
	...config,
	transformIgnorePatterns: [...config.transformIgnorePatterns.slice(1)]
};
