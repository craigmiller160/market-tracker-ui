import { TaskTryT } from '@craigmiller160/ts-functions/es/types';
import { ajaxApi } from './AjaxApi';
import { pipe } from 'fp-ts/es6/function';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import qs from 'qs';
import { HistoryDay, TradierHistory } from '../types/tradier/history';
import { Quote, TradierQuotes } from '../types/tradier/quotes';
import { instanceOf, match } from 'ts-pattern';

// TODO refactor response into standardized form

const formatQuotes = (quotes: TradierQuotes): ReadonlyArray<Quote> =>
	match(quotes.quotes.quote)
		.with(
			instanceOf(Array),
			() => quotes.quotes.quote as ReadonlyArray<Quote>
		)
		.otherwise(() => [quotes.quotes.quote as Quote]);

export const getQuotes = (
	symbols: ReadonlyArray<string>
): TaskTryT<ReadonlyArray<Quote>> =>
	pipe(
		ajaxApi.get<TradierQuotes>({
			uri: `/tradier/markets/quotes?symbols=${symbols.join(',')}`
		}),
		TaskEither.map((_) => formatQuotes(_.data))
	);

// TODO delete this
export const getHistoryQuote = (
	symbol: string
): TaskTryT<ReadonlyArray<HistoryDay>> => {
	const queryString = qs.stringify({
		symbol,
		interval: 'monthly',
		start: '2021-01-01',
		end: '2022-01-31'
	});

	return pipe(
		ajaxApi.get<TradierHistory>({
			uri: `/tradier/markets/history?${queryString}`
		}),
		TaskEither.map((_) => _.data.history.day)
	);
};

export const getOneWeekHistory = (
	symbol: string
): TaskTryT<ReadonlyArray<HistoryDay>> => {
	throw new Error();
};

export const getOneMonthHistory = (
	symbol: string
): TaskTryT<ReadonlyArray<HistoryDay>> => {
	throw new Error();
};

export const getThreeMonthHistory = (
	symbol: string
): TaskTryT<ReadonlyArray<HistoryDay>> => {
	throw new Error();
};

export const getOneYearHistory = (
	symbol: string
): TaskTryT<ReadonlyArray<HistoryDay>> => {
	throw new Error();
};

export const getFiveYearHistory = (
	symbol: string
): TaskTryT<ReadonlyArray<HistoryDay>> => {
	throw new Error();
};
