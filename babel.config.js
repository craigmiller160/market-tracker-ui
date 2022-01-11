const babelConfig = require('@craigmiller160/babel-config');
const babelConfigReact = require('@craigmiller160/babel-config-react');
const merge = require('@craigmiller160/config-merge');

module.exports = merge(babelConfig, babelConfigReact);