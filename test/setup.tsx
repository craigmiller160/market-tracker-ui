import { vi } from 'vitest';

vi.mock('@ant-design/charts', () => {
	const Line = () => <p>Chart is Here</p>;
	return {
		Line
	};
});

window.URL.createObjectURL = () => '';

const mockWindowMatchMedia = () =>
	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: vi.fn().mockImplementation((query: unknown) => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: vi.fn(), // Deprecated
			removeListener: vi.fn(), // Deprecated
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn()
		}))
	});

beforeAll(() => {
	mockWindowMatchMedia();
});

beforeEach(() => {
	process.env.NODE_ENV = 'test';
});

afterEach(() => {
	process.env.NODE_ENV = 'test';
});
