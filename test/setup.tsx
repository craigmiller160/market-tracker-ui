jest.mock('@ant-design/charts', () => {
	const Line = () => <p>Chart is Here</p>;
	return {
		Line
	};
});

window.URL.createObjectURL = () => '';

const mockWindowMatchMedia = () =>
	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: jest.fn().mockImplementation((query) => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: jest.fn(), // Deprecated
			removeListener: jest.fn(), // Deprecated
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
			dispatchEvent: jest.fn()
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
