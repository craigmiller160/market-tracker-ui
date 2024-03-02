import { MarketTime } from '../../src/types/MarketTime';
import { match } from 'ts-pattern';
import {
	getFiveYearStartDate,
	getOneMonthStartDate,
	getOneWeekStartDate,
	getOneYearStartDate,
	getThreeMonthStartDate,
	getTodayEndString,
	getTodayStart,
	getTodayStartString
} from '../../src/utils/timeUtils';
import { type TradierQuotes } from '../../src/types/tradier/quotes';
import { type TradierHistory } from '../../src/types/tradier/history';
import { type TradierSeries } from '../../src/types/tradier/timesales';
import * as Time from '@craigmiller160/ts-functions/Time';
import {
	type TradierCalendar,
	type TradierCalendarStatus
} from '../../src/types/tradier/calendar';
import MockAdapter from 'axios-mock-adapter';
import { pipe } from 'fp-ts/function';

const TIMESTAMP_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";
export const BASE_LAST_PRICE = 100;
export const BASE_PREV_CLOSE_PRICE = 30;
export const BASE_HISTORY_1_PRICE = 50;
export const BASE_HISTORY_2_PRICE = 60;
const formatTimestamp = Time.format(TIMESTAMP_FORMAT);
const CALENDAR_MONTH_FORMAT = 'MM';
const CALENDAR_YEAR_FORMAT = 'yyyy';
const formatCalendarMonth = Time.format(CALENDAR_MONTH_FORMAT);
const formatCalendarYear = Time.format(CALENDAR_YEAR_FORMAT);
const DATE_FORMAT = 'yyyy-MM-dd';
const formatDate = Time.format(DATE_FORMAT);

export const createMockCalendar = (
	date: string,
	status: TradierCalendarStatus
): TradierCalendar => ({
	calendar: {
		month: 0,
		year: 0,
		days: {
			day: [
				{
					date,
					status
				}
			]
		}
	}
});

export const getTradierInterval = (time: MarketTime): string =>
	match(time)
		.with(MarketTime.ONE_WEEK, () => 'daily')
		.with(MarketTime.ONE_MONTH, () => 'daily')
		.with(MarketTime.THREE_MONTHS, () => 'daily')
		.with(MarketTime.ONE_YEAR, () => 'weekly')
		.with(MarketTime.FIVE_YEARS, () => 'monthly')
		.run();

export const getHistoryStart = (time: MarketTime): Date =>
	match(time)
		.with(MarketTime.ONE_DAY, getTodayStart)
		.with(MarketTime.ONE_WEEK, getOneWeekStartDate)
		.with(MarketTime.ONE_MONTH, getOneMonthStartDate)
		.with(MarketTime.THREE_MONTHS, getThreeMonthStartDate)
		.with(MarketTime.ONE_YEAR, getOneYearStartDate)
		.with(MarketTime.FIVE_YEARS, getFiveYearStartDate)
		.run();

export const createTradierQuote = (
	symbol: string,
	modifier: number
): TradierQuotes => ({
	quotes: {
		quote: {
			symbol,
			description: 'My Stock',
			open: 0,
			high: 0,
			low: 0,
			bid: 0,
			ask: 0,
			close: 0,
			last: BASE_LAST_PRICE + modifier,
			prevclose: BASE_PREV_CLOSE_PRICE + modifier
		},
		unmatched_symbols: undefined
	}
});

export const createTradierQuoteNotFound = (symbol: string): TradierQuotes => ({
	quotes: {
		quote: undefined,
		unmatched_symbols: {
			symbol
		}
	}
});

export const createTradierHistory = (modifier: number): TradierHistory => ({
	history: {
		day: [
			{
				date: '2022-01-01',
				open: BASE_HISTORY_1_PRICE + modifier,
				high: 0,
				low: 0,
				close: BASE_HISTORY_2_PRICE + modifier
			}
		]
	}
});

export const createTradierTimesale = (
	modifier: number,
	timestampMillis: number = new Date().getTime() - 120_000
): TradierSeries => {
	const secondTimestampMillis = timestampMillis + 60_000;
	const firstTime = formatTimestamp(new Date(timestampMillis));
	const secondTime = formatTimestamp(new Date(secondTimestampMillis));
	return {
		series: {
			data: [
				{
					time: firstTime,
					timestamp: Math.floor(timestampMillis / 1000),
					price: BASE_HISTORY_1_PRICE + modifier,
					open: 0,
					high: 0,
					low: 0,
					close: 0,
					volume: 0,
					vwap: 0
				},
				{
					time: secondTime,
					timestamp: Math.floor(secondTimestampMillis / 1000),
					price: BASE_HISTORY_2_PRICE + modifier,
					open: 0,
					high: 0,
					low: 0,
					close: 0,
					volume: 0,
					vwap: 0
				}
			]
		}
	};
};

export const mockCalenderRequest = (
	mockApi: MockAdapter,
	status?: TradierCalendarStatus
) => {
	const theStatus = status ?? 'open';
	const date = new Date();
	const formattedDate = formatDate(date);
	const year = formatCalendarYear(date);
	const month = formatCalendarMonth(date);

	mockApi
		.onGet(`/tradier/markets/calendar?year=${year}&month=${month}`)
		.reply(200, createMockCalendar(formattedDate, theStatus));
};

export const mockTradierQuoteRequest = (
	mockApi: MockAdapter,
	symbol: string,
	modifier: number
) => {
	mockApi
		.onGet(`/tradier/markets/quotes?symbols=${symbol}`)
		.reply(200, createTradierQuote(symbol, modifier));
};

export const mockTradierQuoteNotFound = (
	mockApi: MockAdapter,
	symbol: string
) =>
	mockApi
		.onGet(`/tradier/markets/quotes?symbols=${symbol}`)
		.reply(200, createTradierQuoteNotFound(symbol));

export const mockTradierTimesaleRequest = (
	mockApi: MockAdapter,
	symbol: string,
	modifier: number,
	timestampMillis?: number
) => {
	const start = getTodayStartString();
	const end = getTodayEndString();
	mockApi
		.onGet(
			`/tradier/markets/timesales?symbol=${symbol}&start=${start}&end=${end}&interval=1min`
		)
		.reply(200, createTradierTimesale(modifier, timestampMillis));
};

export const mockTradierHistoryRequest = (
	mockApi: MockAdapter,
	symbol: string,
	time: MarketTime,
	modifier: number
) => {
	const start = pipe(getHistoryStart(time), formatDate);
	const end = formatDate(new Date());
	const interval = getTradierInterval(time);
	mockApi
		.onGet(
			`/tradier/markets/history?symbol=${symbol}&start=${start}&end=${end}&interval=${interval}`
		)
		.reply(200, createTradierHistory(modifier));
};
