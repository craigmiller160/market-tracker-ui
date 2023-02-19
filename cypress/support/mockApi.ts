import MockAdapter from 'axios-mock-adapter';
import { ajaxApi } from '../../src/services/AjaxApi';
import {
	AsymmetricHeadersMatcher,
	AsymmetricRequestDataMatcher
} from './axiosMockAdapterTypes';
import Chainable = Cypress.Chainable;
import { AxiosRequestConfig } from 'axios';

export const mockApiInstance = new MockAdapter(ajaxApi.instance);

type MockApiHistory = typeof mockApiInstance.history;

type ReplyValues<T> = [status: number, data?: T, headers?: object];
type ReplyFunc<T> = (config: AxiosRequestConfig) => ReplyValues<T>;

export type RequestConfig<T> = {
	readonly matcher?: string | RegExp;
	readonly body?: string | AsymmetricRequestDataMatcher;
	readonly headers?: AsymmetricHeadersMatcher;
	readonly reply: ReplyValues<T> | ReplyFunc<T>;
};

export const mockGet = <T>(config: RequestConfig<T>): Chainable<unknown> => {
	const requestHandler = mockApiInstance.onGet(
		config.matcher,
		config.body,
		config.headers
	);
	if (config.reply instanceof Function) {
		requestHandler.reply(config.reply);
	} else {
		requestHandler.reply(...config.reply);
	}
	return cy.wrap(null);
};

export const mockApiHistory = (
	fn: (h: MockApiHistory) => void
): Chainable<unknown> => {
	fn(mockApiInstance.history);
	return cy.wrap(null);
};
