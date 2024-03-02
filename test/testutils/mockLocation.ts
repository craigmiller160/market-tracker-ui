/* eslint-disable @typescript-eslint/ban-ts-comment */
import { vi } from 'vitest';

export const mockLocation = (): Location => {
	const location = window.location;
	// @ts-ignore
	delete window.location;
	// @ts-ignore
	window.location = {
		assign: vi.fn(),
		pathname: '/',
		search: '',
		hash: '',
		href: ''
	};
	return location;
};

export const restoreLocation = (location: Location): void => {
	window.location = location;
};
