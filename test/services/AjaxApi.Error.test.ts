import { ajaxApi } from '../../src/services/AjaxApi';
import MockAdapter from 'axios-mock-adapter';
import { store } from '../../src/store';
import { MockStore } from 'redux-mock-store';

jest.mock('../../src/store', () => {
	const createMockStore = jest.requireActual('redux-mock-store');
	return {
		store: createMockStore()
	};
});

const mockApi = new MockAdapter(ajaxApi.instance);
const mockStore = store as MockStore;

describe('AjaxApi Error Handler', () => {
	beforeEach(() => {
		mockApi.reset();
		mockStore.clearActions();
	});

	it('is 500 error, no body', () => {
		mockApi.onGet('/foo').reply(500);
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
