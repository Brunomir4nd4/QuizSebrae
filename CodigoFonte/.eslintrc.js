/* eslint-env node */
module.exports = {
	root: true,
	extends: [
        "next/core-web-vitals",
        "prettier",
        "plugin:storybook/recommended",
        "plugin:storybook/recommended"
    ],
	plugins: ['@typescript-eslint', 'jest'],
	parser: '@typescript-eslint/parser',
	overrides: [
		{
			files: ['*.ts', '*.tsx'],
			parserOptions: {
				project: ['./tsconfig.json'],
				projectService: true,
				tsconfigRootDir: __dirname,
			},
			extends: [
				'next/core-web-vitals',
				'plugin:@typescript-eslint/recommended',
				'prettier',
			],
			rules: {
				'no-unused-vars': 'off',
				'@typescript-eslint/no-unused-vars': [
					'warn',
					{
						argsIgnorePattern: '^_',
						varsIgnorePattern: '^_',
					},
				],
			},
		},
		{
			files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
			env: {
				'jest/globals': true,
			},
			plugins: ['jest'],
			extends: ['plugin:jest/recommended', 'plugin:jest/style'],
		},
	],
};
