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
import * as Time from '@craigmiller160/ts-functions/es/Time';

const HISTORY_DATE_FORMAT = 'yyyy-MM-dd';
const formatHistoryDate = Time.format(HISTORY_DATE_FORMAT);

export interface HistoryQuery {
	readonly symbol: string;
	readonly interval: string;
	readonly start: string;
	readonly end: string;
}

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
	pipe(
		history.history.day,
		RArray.map(
			(_: TradierHistoryDay): ReadonlyArray<HistoryDate> => [
				{
					date: _.date,
					type: 'open',
					price: _.open
				},
				{
					date: _.date,
					type: 'close',
					price: _.close
				}
			]
		),
		RArray.flatten
	);

const getHistoryStartDate = (
	today: Date,
	intervalFn: (d: Date) => Date
): string => pipe(today, intervalFn, formatHistoryDate);

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

const getHistoryQuote = (
	historyQuery: HistoryQuery
): TaskTryT<ReadonlyArray<HistoryDate>> => {
	const queryString = qs.stringify(historyQuery);
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
): TaskTryT<ReadonlyArray<HistoryDate>> => {
	const today = new Date();
	return getHistoryQuote({
		symbol,
		start: getHistoryStartDate(today, Time.subDays(6)),
		end: formatHistoryDate(today),
		interval: 'daily'
	});
};

// TODO double check time range here
export const getOneMonthHistory = (
	symbol: string
): TaskTryT<ReadonlyArray<HistoryDate>> => {
	const today = new Date();
	return getHistoryQuote({
		symbol,
		start: getHistoryStartDate(today, Time.subMonths(1)),
		end: formatHistoryDate(today),
		interval: 'daily'
	});
};

// TODO double check time range here
export const getThreeMonthHistory = (
	symbol: string
): TaskTryT<ReadonlyArray<HistoryDate>> => {
	const today = new Date();
	return getHistoryQuote({
		symbol,
		start: getHistoryStartDate(today, Time.subMonths(3)),
		end: formatHistoryDate(today),
		interval: 'daily'
	});
};

// TODO double check time range here
export const getOneYearHistory = (
	symbol: string
): TaskTryT<ReadonlyArray<HistoryDate>> => {
	const today = new Date();
	return getHistoryQuote({
		symbol,
		start: getHistoryStartDate(today, Time.subYears(1)),
		end: formatHistoryDate(today),
		interval: 'weekly'
	});
};

// TODO double check time range here
export const getFiveYearHistory = (
	symbol: string
): TaskTryT<ReadonlyArray<HistoryDate>> => {
	const today = new Date();
	return getHistoryQuote({
		symbol,
		start: getHistoryStartDate(today, Time.subYears(5)),
		end: formatHistoryDate(today),
		interval: 'monthly'
	});
};
