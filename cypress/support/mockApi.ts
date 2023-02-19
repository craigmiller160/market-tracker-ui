import MockAdapter from 'axios-mock-adapter';
import { ajaxApi } from '../../src/services/AjaxApi';
import {
	AsymmetricHeadersMatcher,
	AsymmetricRequestDataMatcher
} from './axiosMockAdapterTypes';
import Chainable = Cypress.Chainable;
import { AxiosRequestConfig } from 'axios';

export const mockApiInstance = new MockAdapter(ajaxApi.instance);

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
	fn(mockApiInstance.history as unknown as MockApiHistory);
	return cy.wrap(null);
};
