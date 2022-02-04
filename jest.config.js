const merge = require('@craigmiller160/config-merge');
const jestConfig = require('@craigmiller160/jest-config');
const jestTsConfig = require('@craigmiller160/jest-config-ts');
const jestIgnorePatternsConfig = require('@craigmiller160/jest-config-ignore-patterns');
const path = require('path');

// TODO does not work with merging the arrays together...
const config = merge(jestConfig, jestTsConfig, jestIgnorePatternsConfig, {
	setupFilesAfterEnv: [path.join(process.cwd(), 'test', 'setup.ts')]
});
console.log(config.transformIgnorePatterns);

module.exports = config;
