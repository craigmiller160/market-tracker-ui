import { TaskTryT } from '@craigmiller160/ts-functions/es/types';
import { ajaxApi } from './AjaxApi';
import { pipe } from 'fp-ts/es6/function';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import qs from 'qs';

// TODO make this an array
export const getQuotes = (symbols: string): TaskTryT<any> =>
	pipe(
		ajaxApi.get({
			uri: `/tradier/markets/quotes?symbols=${symbols}`
		}),
		TaskEither.map((_) => _.data)
	);

export const getHistoryQuote = (symbol: string): TaskTryT<any> => {
	const queryString = qs.stringify({
		symbol,
		interval: 'monthly',
		start: '2021-01-01',
		end: '2022-01-31'
	});

	return pipe(
		ajaxApi.get({
			uri: `/tradier/markets/history?${queryString}`
		}),
		TaskEither.map((_) => _.data)
	);
};
