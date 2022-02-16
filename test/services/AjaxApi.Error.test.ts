import { ajaxApi } from '../../src/services/AjaxApi';
import MockAdapter from 'axios-mock-adapter';

const mockApi = new MockAdapter(ajaxApi.instance);

describe('AjaxApi Error Handler', () => {
	beforeEach(() => {
		mockApi.reset();
	});

	it('is 500 error, no body', () => {
		throw new Error();
	});

	it('is 401 error, no body', () => {
		throw new Error();
	});

	it('is 401 error, with body', () => {
		throw new Error();
	});

	it('is 500 error, with body', () => {
		throw new Error();
	});

	it('is error without status', () => {
		throw new Error();
	});
});
