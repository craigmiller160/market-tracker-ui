import { TaskTryT } from '@craigmiller160/ts-functions/es/types';
import { ajaxApi, getResponseData } from './AjaxApi';
import { pipe } from 'fp-ts/es6/function';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import qs from 'qs';
import { TradierHistoryDay, TradierHistory } from '../types/tradier/history';
import { TradierQuote, TradierQuotes } from '../types/tradier/quotes';
import { instanceOf, match } from 'ts-pattern';
import * as RArray from 'fp-ts/es6/ReadonlyArray';
import { Quote } from '../types/quote';
import { HistoryDate } from '../types/history';

const formatTradierQuotes = (quotes: TradierQuotes): ReadonlyArray<Quote> => {
	const tradierQuotes = match(quotes.quotes.quote)
		.with(
			instanceOf(Array),
			() => quotes.quotes.quote as ReadonlyArray<TradierQuote>
		)
		.otherwise(() => [quotes.quotes.quote as TradierQuote]);
	return RArray.map(
		(_: TradierQuote): Quote => ({
			symbol: _.symbol,
			price: _.last
		})
	)(tradierQuotes);
};

const formatTradierHistory = (
	history: TradierHistory
): ReadonlyArray<HistoryDate> =>
	RArray.map((_: TradierHistoryDay) => ({
		date: _.day,
		price: _.close
	}))(history.history.day);

export const getQuotes = (
	symbols: ReadonlyArray<string>
): TaskTryT<ReadonlyArray<Quote>> =>
	pipe(
		ajaxApi.get<TradierQuotes>({
			uri: `/tradier/markets/quotes?symbols=${symbols.join(',')}`
		}),
		TaskEither.map(getResponseData),
		TaskEither.map(formatTradierQuotes)
	);

// TODO delete this
export const getHistoryQuote = (
	symbol: string
): TaskTryT<ReadonlyArray<HistoryDate>> => {
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
		TaskEither.map(getResponseData),
		TaskEither.map(formatTradierHistory)
	);
};

export const getOneWeekHistory = (
	symbol: string
): TaskTryT<ReadonlyArray<TradierHistoryDay>> => {
	throw new Error();
};

export const getOneMonthHistory = (
	symbol: string
): TaskTryT<ReadonlyArray<TradierHistoryDay>> => {
	throw new Error();
};

export const getThreeMonthHistory = (
	symbol: string
): TaskTryT<ReadonlyArray<TradierHistoryDay>> => {
	throw new Error();
};

export const getOneYearHistory = (
	symbol: string
): TaskTryT<ReadonlyArray<TradierHistoryDay>> => {
	throw new Error();
};

export const getFiveYearHistory = (
	symbol: string
): TaskTryT<ReadonlyArray<TradierHistoryDay>> => {
	throw new Error();
};
