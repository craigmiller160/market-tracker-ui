export {};

jest.mock('@ant-design/charts', () => {
	const Line = () => <p>Chart is Here</p>;
	return {
		Line
	};
});

window.URL.createObjectURL = () => '';

beforeEach(() => {
	process.env.NODE_ENV = 'test';
});

afterEach(() => {
	process.env.NODE_ENV = 'test';
});
