module.exports = {
    extends: [
        '@craigmiller160/eslint-config-js',
        '@craigmiller160/eslint-config-prettier',
        '@craigmiller160/eslint-config-react',
        '@craigmiller160/eslint-config-jest',
        '@craigmiller160/eslint-config-tree-shaking-import-restrictions',
        '@craigmiller160/eslint-config-ts'
    ],
    rules: {
        'react/react-in-jsx-scope': 0
    }
}
