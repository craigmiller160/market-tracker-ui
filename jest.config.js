const merge = require('@craigmiller160/config-merge');
const jestConfig = require('@craigmiller160/jest-config');
const path = require('path');

module.exports = merge(jestConfig, {
	setupFilesAfterEnv: [path.join(process.cwd(), 'test', 'setup.tsx')]
});

// module.exports = {
// 	...config,
// 	transformIgnorePatterns: [
// 		...config.transformIgnorePatterns.slice(1),
// 		createCombinedPattern([
// 			...libPatterns,
// 			'@antv\/xflow-core' // eslint-disable-line
// 		])
// 	]
// };
