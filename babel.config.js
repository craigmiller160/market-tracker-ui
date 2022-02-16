const babelConfig = require('@craigmiller160/babel-config');
const babelPolyfills = require('@craigmiller160/babel-config-core-polyfills');
const babelConfigReact = require('@craigmiller160/babel-config-react');
const merge = require('@craigmiller160/config-merge');

module.exports = merge(babelConfig, babelPolyfills, babelConfigReact);