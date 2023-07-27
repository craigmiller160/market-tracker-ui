module.exports = {
	extends: [
		'@craigmiller160/eslint-config-js',
		'@craigmiller160/eslint-config-prettier',
		'@craigmiller160/eslint-config-react',
		'@craigmiller160/eslint-config-jest',
		'@craigmiller160/eslint-config-ts'
	],
	rules: {
		'react/react-in-jsx-scope': 0,
		'@typescript-eslint/no-namespace': [
			'error',
			{
				allowDeclarations: true
			}
		]
	}
};
