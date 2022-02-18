import { TaskTryT, TryT } from '@craigmiller160/ts-functions/es/types';
import { ajaxApi, getResponseData } from './AjaxApi';
import { flow, pipe } from 'fp-ts/es6/function';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import qs from 'qs';
import { TradierHistory, TradierHistoryDay } from '../types/tradier/history';
import {
	TradierQuote,
	TradierQuotes,
	tradierQuotesV
} from '../types/tradier/quotes';
import { instanceOf, match } from 'ts-pattern';
import * as RArray from 'fp-ts/es6/ReadonlyArray';
import * as Option from 'fp-ts/es6/Option';
import { Quote } from '../types/quote';
import { HistoryRecord } from '../types/history';
import {
	formatHistoryDate,
	getFiveYearHistoryStartDate,
	getOneMonthHistoryStartDate,
	getOneWeekHistoryStartDate,
	getOneYearHistoryStartDate,
	getThreeMonthHistoryStartDate,
	getTimesalesEnd,
	getTimesalesStart
} from '../utils/timeUtils';
import { TradierSeries, TradierSeriesData } from '../types/tradier/timesales';
import * as Time from '@craigmiller160/ts-functions/es/Time';
import { MarketStatus } from '../types/MarketStatus';
import {
	toMarketStatus,
	TradierCalendar,
	TradierCalendarStatus
} from '../types/tradier/calendar';
import * as TypeValidation from '@craigmiller160/ts-functions/es/TypeValidation';

const formatCalendarYear = Time.format('yyyy');
const formatCalendarMonth = Time.format('MM');
const formatCalendarDate = Time.format('yyyy-MM-dd');

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
): ReadonlyArray<HistoryRecord> =>
	pipe(
		history.history.day,
		RArray.chain(
			(_: TradierHistoryDay): ReadonlyArray<HistoryRecord> => [
				{
					date: _.date,
					time: '00:00:00',
					unixTimestampMillis: 0,
					price: _.open
				},
				{
					date: _.date,
					time: '23:59:59',
					unixTimestampMillis: 0,
					price: _.close
				}
			]
		)
	);

const parseTimesaleTimestamp = Time.parse("yyyy-MM-dd'T'HH:mm:ss");

const getTimesaleDate: (timestamp: string) => string = flow(
	parseTimesaleTimestamp,
	Time.format('yyyy-MM-dd')
);

const getTimesaleTime: (timestamp: string) => string = flow(
	parseTimesaleTimestamp,
	Time.format('HH:mm:ss')
);

const formatTimesales = (
	timesales: TradierSeries
): ReadonlyArray<HistoryRecord> =>
	pipe(
		Option.fromNullable(timesales.series),
		Option.map((_) => _.data),
		Option.map(
			RArray.map(
				(_: TradierSeriesData): HistoryRecord => ({
					date: getTimesaleDate(_.time),
					time: getTimesaleTime(_.time),
					unixTimestampMillis: _.timestamp * 1000,
					price: _.price
				})
			)
		),
		Option.getOrElse((): ReadonlyArray<HistoryRecord> => [])
	);

export const getTimesales = (
	symbol: string
): TaskTryT<ReadonlyArray<HistoryRecord>> => {
	const start = getTimesalesStart();
	const end = getTimesalesEnd();
	return pipe(
		ajaxApi.get<TradierSeries>({
			uri: `/tradier/markets/timesales?symbol=${symbol}&start=${start}&end=${end}&interval=1min`
		}),
		TaskEither.map(getResponseData),
		TaskEither.map(formatTimesales)
	);
};

// TODO move to ts-functions
const validateQuotes = (data: TradierQuotes): TryT<TradierQuotes> =>
	pipe(tradierQuotesV.decode(data), TypeValidation.handleResult);

export const getQuotes = (
	symbols: ReadonlyArray<string>
): TaskTryT<ReadonlyArray<Quote>> =>
	pipe(
		ajaxApi.get<TradierQuotes>({
			uri: `/tradier/markets/quotes?symbols=${symbols.join(',')}`
		}),
		TaskEither.map(getResponseData),
		TaskEither.chainEitherK(validateQuotes),
		TaskEither.map(formatTradierQuotes)
	);

const getHistoryQuote = (
	historyQuery: HistoryQuery
): TaskTryT<ReadonlyArray<HistoryRecord>> => {
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
): TaskTryT<ReadonlyArray<HistoryRecord>> => {
	const today = new Date();
	return getHistoryQuote({
		symbol,
		start: getOneWeekHistoryStartDate(),
		end: formatHistoryDate(today),
		interval: 'daily'
	});
};

export const getOneMonthHistory = (
	symbol: string
): TaskTryT<ReadonlyArray<HistoryRecord>> => {
	const today = new Date();
	return getHistoryQuote({
		symbol,
		start: getOneMonthHistoryStartDate(),
		end: formatHistoryDate(today),
		interval: 'daily'
	});
};

export const getThreeMonthHistory = (
	symbol: string
): TaskTryT<ReadonlyArray<HistoryRecord>> => {
	const today = new Date();
	return getHistoryQuote({
		symbol,
		start: getThreeMonthHistoryStartDate(),
		end: formatHistoryDate(today),
		interval: 'daily'
	});
};

export const getOneYearHistory = (
	symbol: string
): TaskTryT<ReadonlyArray<HistoryRecord>> => {
	const today = new Date();
	return getHistoryQuote({
		symbol,
		start: getOneYearHistoryStartDate(),
		end: formatHistoryDate(today),
		interval: 'weekly'
	});
};

export const getFiveYearHistory = (
	symbol: string
): TaskTryT<ReadonlyArray<HistoryRecord>> => {
	const today = new Date();
	return getHistoryQuote({
		symbol,
		start: getFiveYearHistoryStartDate(),
		end: formatHistoryDate(today),
		interval: 'monthly'
	});
};

export const getMarketStatus = (): TaskTryT<MarketStatus> => {
	const today = new Date();
	const year = formatCalendarYear(today);
	const month = formatCalendarMonth(today);
	const calendarDate = formatCalendarDate(today);
	return pipe(
		ajaxApi.get<TradierCalendar>({
			uri: `/tradier/markets/calendar?year=${year}&month=${month}`
		}),
		TaskEither.map(getResponseData),
		TaskEither.map((_) => _.calendar.days.day),
		TaskEither.map(
			flow(
				RArray.findFirst((_) => _.date === calendarDate),
				Option.map((_) => _.status),
				Option.getOrElse((): TradierCalendarStatus => {
					console.error('Could not find matching calendar date');
					return 'closed';
				})
			)
		),
		TaskEither.map(toMarketStatus)
	);
};
