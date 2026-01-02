import type { Config } from 'jest';

const config: Config = {
	clearMocks: true,
	collectCoverage: true,
	coverageDirectory: 'coverage',
	coverageProvider: 'v8',

	collectCoverageFrom: [
		'src/components/**/*.{js,jsx,ts,tsx}', // Include all files in src with supported extensions
		'!src/**/*.d.ts', // Exclude TypeScript definition files
	],

	coveragePathIgnorePatterns: [
		'\\.d\\.ts$',
		'\\.interface\\.tsx$',
		'\\.styles\\.tsx$',
		'(?<!\\.component)\\.ts$',
		'src/components/Icons',
	],

	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
	},

	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	testEnvironment: 'jsdom',

	transform: {
		'^.+\\.(ts|tsx|js|jsx)$': [
			'ts-jest',
			{
				tsconfig: {
					jsx: 'react-jsx',
				},
			},
		],
	},

	transformIgnorePatterns: [
		'node_modules/(?!(@testing-library|other-esm-package)/)',
	],
};

export default config;
