import { ajaxApiFpTs } from '../../src/services/AjaxApi';
import MockAdapter from 'axios-mock-adapter';
import { store } from '../../src/store';
import { MockStore } from 'redux-mock-store';
import * as Sleep from '@craigmiller160/ts-functions/es/Sleep';

const sleep550ms = Sleep.sleep(550);

jest.mock('../../src/store', () => {
	const createMockStore = jest.requireActual('redux-mock-store').default;
	return {
		store: createMockStore()()
	};
});

const mockApi = new MockAdapter(ajaxApiFpTs.instance);
const mockStore = store as MockStore;

describe('AjaxApi Error Handling', () => {
	beforeEach(() => {
		mockApi.reset();
		mockStore.clearActions();
	});

	describe('Error handler', () => {
		it('is 500 error, no body', async () => {
			mockApi.onGet('/foo').reply(500);
			await ajaxApiFpTs.get({
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
			await ajaxApiFpTs.get({
				uri: '/foo'
			})();
			await sleep550ms();
			expect(mockStore.getActions()).toEqual([
				{
					type: 'notification/addError',
					payload: 'Unauthorized'
				}
			]);
		});

		it('is 500 error, with body', async () => {
			mockApi.onGet('/foo').reply(500, { hello: 'world' });
			await ajaxApiFpTs.get({
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
	});
});
