import { ajaxApi } from '../../src/services/AjaxApi';
import MockAdapter from 'axios-mock-adapter';
import { store } from '../../src/store';
import { MockStore } from 'redux-mock-store';
import * as Option from 'fp-ts/es6/Option';

jest.mock('../../src/store', () => {
	const createMockStore = jest.requireActual('redux-mock-store').default;
	return {
		store: createMockStore()()
	};
});

const mockApi = new MockAdapter(ajaxApi.instance);
const mockStore = store as MockStore;

describe('AjaxApi Error Handler', () => {
	beforeEach(() => {
		mockApi.reset();
		mockStore.clearActions();
	});

	it('is 500 error, no body', async () => {
		mockApi.onGet('/foo').reply(500);
		await ajaxApi.get({
			uri: '/foo'
		})();
		expect(mockStore.getActions()).toEqual([
			{
				type: 'notification/addError',
				payload:
					'500 - Message: Request failed with status code 500 Body: {}'
			}
		]);
	});

	it('is 401 error, no body', async () => {
		mockApi.onGet('/foo').reply(401);
		await ajaxApi.get({
			uri: '/foo'
		})();
		expect(mockStore.getActions()).toEqual([
			{
				type: 'auth/setUserData',
				payload: Option.none
			},
			{
				type: 'notification/addError',
				payload:
					'401 - Message: Request failed with status code 401 Body: {}'
			}
		]);
	});

	it('is 401 error, with body', async () => {
		mockApi.onGet('/foo').reply(401, { hello: 'world' });
		await ajaxApi.get({
			uri: '/foo'
		})();
		const text = JSON.stringify({ hello: 'world' });
		expect(mockStore.getActions()).toEqual([
			{
				type: 'auth/setUserData',
				payload: Option.none
			},
			{
				type: 'notification/addError',
				payload: `401 - Message: Request failed with status code 401 Body: ${text}`
			}
		]);
	});

	it('is 500 error, with body', async () => {
		mockApi.onGet('/foo').reply(500, { hello: 'world' });
		await ajaxApi.get({
			uri: '/foo'
		})();
		const text = JSON.stringify({ hello: 'world' });
		expect(mockStore.getActions()).toEqual([
			{
				type: 'notification/addError',
				payload: `500 - Message: Request failed with status code 500 Body: ${text}`
			}
		]);
	});

	it('is error without status', async () => {
		throw new Error();
	});
});
