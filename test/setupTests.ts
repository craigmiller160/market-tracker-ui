/* eslint-disable @typescript-eslint/ban-ts-comment */
export {};

beforeEach(() => {
	// @ts-ignore
	delete window.location;
	// @ts-ignore
	window.location = {
		assign: jest.fn(),
		pathname: '/',
		search: '',
		hash: '',
		href: ''
	};
});
