/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any */
/* Everything here was copied from the axios-mock-adapter type definitions, they're just not exported */
import { AxiosRequestConfig } from 'axios';
import MockAdapter from 'axios-mock-adapter';

export interface AsymmetricMatcher {
	asymmetricMatch: Function;
}

export interface RequestDataMatcher {
	[index: string]: any;
	params?: {
		[index: string]: any;
	};
}

export type AsymmetricRequestDataMatcher =
	| AsymmetricMatcher
	| RequestDataMatcher;

export interface HeadersMatcher {
	[header: string]: string;
}

export type AsymmetricHeadersMatcher = AsymmetricMatcher | HeadersMatcher;

export type CallbackResponseSpecFunc = (
	config: AxiosRequestConfig
) => any[] | Promise<any[]>;

export type ResponseSpecFunc = <T = any>(
	statusOrCallback: number | CallbackResponseSpecFunc,
	data?: T,
	headers?: any
) => MockAdapter;
