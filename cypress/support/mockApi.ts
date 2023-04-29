import MockAdapter, { RequestHandler } from 'axios-mock-adapter';
import { marketTrackerApiFpTs } from '../../src/services/AjaxApi';
import {
	AsymmetricHeadersMatcher,
	AsymmetricRequestDataMatcher
} from './axiosMockAdapterTypes';
import Chainable = Cypress.Chainable;
import { AxiosRequestConfig } from 'axios';

export const mockApiInstance = new MockAdapter(marketTrackerApiFpTs.instance, {
	onNoMatch: 'passthrough'
});

type MockApiHistory = {
	readonly delete: ReadonlyArray<AxiosRequestConfig>;
	readonly get: ReadonlyArray<AxiosRequestConfig>;
	readonly head: ReadonlyArray<AxiosRequestConfig>;
	readonly list: ReadonlyArray<AxiosRequestConfig>;
	readonly options: ReadonlyArray<AxiosRequestConfig>;
	readonly patch: ReadonlyArray<AxiosRequestConfig>;
	readonly post: ReadonlyArray<AxiosRequestConfig>;
	readonly put: ReadonlyArray<AxiosRequestConfig>;
};

type ReplyValues<T> = [
	status: number,
	data?: T | Chainable<string>,
	headers?: object
];
type ReplyFunc<T> = (
	config: AxiosRequestConfig
) => [status: number, data?: T, headers?: object];

export type RequestConfig<T> = {
	readonly url?: string | RegExp;
	readonly body?: string | AsymmetricRequestDataMatcher | Chainable<string>;
	readonly headers?: AsymmetricHeadersMatcher;
	readonly reply: ReplyValues<T> | ReplyFunc<T>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isChainable = (value?: any): value is Chainable<string> =>
	typeof value === 'object' && 'intercept' in value;

export const mockGet = <T>(
	config: RequestConfig<T>
): Chainable<RequestHandler> => {
	let requestChainable: Chainable<RequestHandler>;
	if (isChainable(config.body)) {
		requestChainable = config.body.then((payload) =>
			mockApiInstance.onGet(config.url, payload, config.headers)
		);
	} else {
		requestChainable = cy.wrap(
			mockApiInstance.onGet(config.url, config.body, config.headers)
		);
	}

	return requestChainable.then((requestHandler) => {
		if (config.reply instanceof Function) {
			requestHandler.reply(config.reply);
		} else if (isChainable(config.reply[1])) {
			config.reply[1].then((payload) => {
				const reply = config.reply as ReplyValues<T>;
				return requestHandler.reply(reply[0], payload, reply[2]);
			});
		} else {
			requestHandler.reply(...config.reply);
		}
	});
};

export const mockApiHistory = (
	fn: (h: MockApiHistory) => void
): Chainable<null> => {
	fn(mockApiInstance.history as unknown as MockApiHistory);
	return cy.wrap(null);
};
