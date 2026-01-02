import '@testing-library/jest-dom';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: jest.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: jest.fn(), // deprecated
		removeListener: jest.fn(), // deprecated
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		dispatchEvent: jest.fn(),
	})),
});

global.ResizeObserver = jest.fn().mockImplementation(() => ({
	observe: jest.fn(),
	unobserve: jest.fn(),
	disconnect: jest.fn(),
}));

jest.mock('next/navigation', () => ({
	useRouter: jest.fn(() => ({
		push: jest.fn(),
		replace: jest.fn(),
		prefetch: jest.fn(),
		pathname: '/',
		query: {},
		asPath: '/',
	})),
}));

// Suppress act() warnings for async operations in tests
const originalError = console.error;
beforeAll(() => {
	console.error = (...args: unknown[]) => {
		if (
			typeof args[0] === 'string' &&
			args[0].includes('Warning: An update to')
		) {
			return;
		}
		if (args[0] instanceof Error && args[0].message.includes('Upload failed')) {
			return;
		}
		if (
			typeof args[0] === 'string' &&
			args[0].includes('Invalid DOM property')
		) {
			return;
		}
		originalError.call(console, ...args);
	};
});

afterAll(() => {
	console.error = originalError;
});
