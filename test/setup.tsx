import { vi } from 'vitest';
import { newApiServer } from './testutils/msw-server';

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

const server = newApiServer();

beforeAll(() => {
	mockWindowMatchMedia();
	server.actions.startServer();
});

beforeEach(() => {
	process.env.NODE_ENV = 'test';
	server.actions.resetServer();
});

afterEach(() => {
	process.env.NODE_ENV = 'test';
});

afterAll(() => {
	server.actions.stopServer();
});
