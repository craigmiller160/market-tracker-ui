// TODO confirm this is doing something
import 'jest-canvas-mock';

window.URL.createObjectURL = () => '';

beforeEach(() => {
	process.env.NODE_ENV = 'test';
});

afterEach(() => {
	process.env.NODE_ENV = 'test';
});
