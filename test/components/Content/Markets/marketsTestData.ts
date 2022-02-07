import { TradierQuotes } from '../../../../src/types/tradier/quotes';
import { TradierHistory } from '../../../../src/types/tradier/history';
import { TradierSeries } from '../../../../src/types/tradier/timesales';
import MockAdapter from 'axios-mock-adapter';
import * as Time from '@craigmiller160/ts-functions/es/Time';
import {
	getTimesalesEnd,
	getTimesalesStart
} from '../../../../src/utils/timeUtils';
import {
	TradierCalendar,
	TradierCalendarStatus
} from '../../../../src/types/tradier/calendar';

const formatDate = Time.format('yyyy-MM-dd');
const today = formatDate(new Date());
const timesalesStart = getTimesalesStart();
const timesalesEnd = getTimesalesEnd();

export interface TestDataSetting {
	readonly symbol: string;
	readonly quotePrice: number;
	readonly historyPrice: number;
	readonly timesalePrice1: number;
	readonly timesalePrice2: number;
}

export const testDataSettings: ReadonlyArray<TestDataSetting> = [
	{
		symbol: 'VTI',
		quotePrice: 100,
		historyPrice: 50,
		timesalePrice1: 40,
		timesalePrice2: 45
	},
	{
		symbol: 'VOO',
		quotePrice: 101,
		historyPrice: 51,
		timesalePrice1: 41,
		timesalePrice2: 46
	},
	{
		symbol: 'DIA',
		quotePrice: 102,
		historyPrice: 52,
		timesalePrice1: 42,
		timesalePrice2: 47
	},
	{
		symbol: 'QQQ',
		quotePrice: 103,
		historyPrice: 53,
		timesalePrice1: 43,
		timesalePrice2: 48
	},
	{
		symbol: 'EWU',
		quotePrice: 104,
		historyPrice: 54,
		timesalePrice1: 44,
		timesalePrice2: 49
	},
	{
		symbol: 'EWJ',
		quotePrice: 105,
		historyPrice: 55,
		timesalePrice1: 45,
		timesalePrice2: 50
	},
	{
		symbol: 'MCHI',
		quotePrice: 106,
		historyPrice: 56,
		timesalePrice1: 46,
		timesalePrice2: 51
	}
];

export const createQuotes = (
	settings: ReadonlyArray<TestDataSetting>
): TradierQuotes => ({
	quotes: {
		quote: settings.map((setting) => ({
			symbol: setting.symbol,
			description: '',
			open: 0,
			high: 0,
			low: 0,
			bid: 0,
			ask: 0,
			close: 0,
			last: setting.quotePrice
		}))
	}
});

export const createHistory = (setting: TestDataSetting): TradierHistory => ({
	history: {
		day: [
			{
				date: '2022-01-01',
				open: setting.historyPrice,
				high: 0,
				low: 0,
				close: 0
			}
		]
	}
});

export const createTimesale = (
	timestamp = 0,
	setting: TestDataSetting
): TradierSeries => ({
	series: {
		data: [
			{
				time: '2022-01-01T01:00:00',
				timestamp: timestamp > 0 ? timestamp - 100 : timestamp,
				price: setting.timesalePrice1,
				open: 0,
				high: 0,
				low: 0,
				close: 0,
				volume: 0,
				vwap: 0
			},
			{
				time: '2022-01-01T01:01:01',
				timestamp: timestamp > 0 ? timestamp - 100 : timestamp,
				price: setting.timesalePrice2,
				open: 0,
				high: 0,
				low: 0,
				close: 0,
				volume: 0,
				vwap: 0
			}
		]
	}
});

export interface MockQueriesConfig {
	readonly start?: string;
	readonly interval?: string;
	readonly timesaleTimestamp?: number;
	readonly isMarketClosed?: boolean;
}

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

export const createMockQueries =
	(mockApi: MockAdapter) =>
	(config: MockQueriesConfig = {}) => {
		const { start, interval, timesaleTimestamp, isMarketClosed } = config;

		const calendarToday = new Date();
		const calendarDate = Time.format('yyyy-MM-dd')(calendarToday);
		const month = Time.format('MM')(calendarToday);
		const year = Time.format('yyyy')(calendarToday);
		const status = isMarketClosed ?? false ? 'closed' : 'open';
		mockApi
			.onGet(`/tradier/markets/calendar?year=${year}&month=${month}`)
			.reply(200, createMockCalendar(calendarDate, status));

		const symbols = testDataSettings
			.map((setting) => setting.symbol)
			.join(',');
		mockApi
			.onGet(`/tradier/markets/quotes?symbols=${symbols}`)
			.reply(200, createQuotes(testDataSettings));

		testDataSettings.forEach((setting) => {
			mockApi
				.onGet(
					`/tradier/markets/history?symbol=${setting.symbol}&start=${start}&end=${today}&interval=${interval}`
				)
				.reply(200, createHistory(setting));
			mockApi
				.onGet(
					`/tradier/markets/timesales?symbol=${setting.symbol}&start=${timesalesStart}&end=${timesalesEnd}&interval=5min`
				)
				.reply(200, createTimesale(timesaleTimestamp, setting));
		});
	};
