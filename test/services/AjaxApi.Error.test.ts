import { ajaxApi, isNestedAxiosError } from '../../src/services/AjaxApi';
import MockAdapter from 'axios-mock-adapter';
import { store } from '../../src/store';
import { MockStore } from 'redux-mock-store';
import * as Option from 'fp-ts/es6/Option';
import * as Sleep from '@craigmiller160/ts-functions/es/Sleep';
import { AxiosError } from 'axios';
import TraceError from 'trace-error';

const sleep550ms = Sleep.sleep(550);

jest.mock('../../src/store', () => {
	const createMockStore = jest.requireActual('redux-mock-store').default;
	return {
		store: createMockStore()()
	};
});

const mockApi = new MockAdapter(ajaxApi.instance);
const mockStore = store as MockStore;

const axiosError: AxiosError = {
	config: {},
	isAxiosError: true,
	toJSON: () => ({}),
	name: 'AxiosError',
	message: ''
};

describe('AjaxApi Error Handling', () => {
	beforeEach(() => {
		mockApi.reset();
		mockStore.clearActions();
	});

	describe('isNestedAxiosError', () => {
		it('is axios error', () => {
			const result = isNestedAxiosError(axiosError);
			expect(result).toEqual(true);
		});

		it('is not axios error', () => {
			const result = isNestedAxiosError(new Error());
			expect(result).toEqual(false);
		});

		it('is trace error with axios error cause', () => {
			const traceError = new TraceError('', axiosError);
			const result = isNestedAxiosError(traceError);
			expect(result).toEqual(true);
		});

		it('is trace error without axios error cause', () => {
			const traceError = new TraceError('', new Error());
			const result = isNestedAxiosError(traceError);
			expect(result).toEqual(false);
		});
	});

	describe('Error handler', () => {
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
			await sleep550ms();
			expect(mockStore.getActions()).toEqual([
				{
					type: 'auth/setUserData',
					payload: Option.none
				},
				{
					type: 'notification/addError',
					payload: 'Unauthorized'
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
	});
});
