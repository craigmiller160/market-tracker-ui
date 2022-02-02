import { ajaxApi } from '../../src/services/AjaxApi';
import MockAdapter from 'axios-mock-adapter';
import { TradierQuote } from '../../src/types/tradier/quotes';
import {
	getFiveYearHistory,
	getOneMonthHistory,
	getOneWeekHistory,
	getOneYearHistory,
	getQuotes,
	getThreeMonthHistory,
	getTimesales,
	HistoryQuery
} from '../../src/services/TradierService';
import '@relmify/jest-fp-ts';
import { Quote } from '../../src/types/quote';
import qs from 'qs';
import * as Time from '@craigmiller160/ts-functions/es/Time';
import { pipe } from 'fp-ts/es6/function';
import { TradierHistory } from '../../src/types/tradier/history';
import { HistoryRecord } from '../../src/types/history';
import {
	getFiveYearHistoryStartDate,
	getOneMonthHistoryStartDate,
	getOneYearHistoryStartDate,
	getThreeMonthHistoryStartDate,
	getTodayTimesalesDate,
	getTomorrowTimesalesDate
} from '../../src/utils/timeUtils';
import { TradierSeries } from '../../src/types/tradier/timesales';

const mockApi = new MockAdapter(ajaxApi.instance);

const createTradierQuote = (symbol: string): TradierQuote => ({
	symbol,
	description: '',
	open: 0,
	high: 1,
	low: 2,
	bid: 3,
	ask: 4,
	close: 5,
	last: 6
});

const createQuote = (symbol: string): Quote => ({
	symbol,
	price: 6
});

const createTradierHistory = (): TradierHistory => ({
	history: {
		day: [
			{
				date: '1',
				open: 2,
				high: 3,
				low: 4,
				close: 5
			},
			{
				date: '2',
				open: 6,
				high: 7,
				low: 8,
				close: 9
			}
		]
	}
});

const createTimesale = (): TradierSeries => ({
	series: {
		data: [
			{
				time: '2022-01-01T01:01:01',
				timestamp: 0,
				price: 2,
				open: 0,
				high: 0,
				low: 0,
				close: 0,
				volume: 0,
				vwap: 0
			},
			{
				time: '2022-01-01T02:02:02',
				timestamp: 0,
				price: 5,
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

const createHistory = (): ReadonlyArray<HistoryRecord> => [
	{
		date: '1',
		time: '00:00:00',
		price: 2
	},
	{
		date: '1',
		time: '23:59:59',
		price: 5
	},
	{
		date: '2',
		time: '00:00:00',
		price: 6
	},
	{
		date: '2',
		time: '23:59:59',
		price: 9
	}
];

const createTimesaleHistory = (): ReadonlyArray<HistoryRecord> => [
	{
		date: '2022-01-01',
		time: '01:01:01',
		price: 2
	},
	{
		date: '2022-01-01',
		time: '02:02:02',
		price: 5
	}
];

const formatDate = Time.format('yyyy-MM-dd');

describe('TradierService', () => {
	beforeEach(() => {
		mockApi.reset();
	});

	it('get single quote', async () => {
		mockApi.onGet('/tradier/markets/quotes?symbols=VTI').reply(200, {
			quotes: {
				quote: createTradierQuote('VTI')
			}
		});
		const result = await getQuotes(['VTI'])();
		expect(result).toEqualRight([createQuote('VTI')]);
	});

	it('get multiple quotes', async () => {
		mockApi.onGet('/tradier/markets/quotes?symbols=VTI,VOO').reply(200, {
			quotes: {
				quote: [createTradierQuote('VTI'), createTradierQuote('VOO')]
			}
		});
		const result = await getQuotes(['VTI', 'VOO'])();
		expect(result).toEqualRight([createQuote('VTI'), createQuote('VOO')]);
	});

	it('get 1 week history', async () => {
		const today = new Date();
		const historyQuery: HistoryQuery = {
			symbol: 'VTI',
			start: pipe(today, Time.subDays(6), formatDate),
			end: formatDate(today),
			interval: 'daily'
		};
		const queryString = qs.stringify(historyQuery);
		mockApi
			.onGet(`/tradier/markets/history?${queryString}`)
			.reply(200, createTradierHistory());

		const result = await getOneWeekHistory('VTI')();
		expect(result).toEqualRight(createHistory());
	});

	it('get 1 month history', async () => {
		const today = new Date();
		const historyQuery: HistoryQuery = {
			symbol: 'VTI',
			start: getOneMonthHistoryStartDate(),
			end: formatDate(today),
			interval: 'daily'
		};
		const queryString = qs.stringify(historyQuery);
		mockApi
			.onGet(`/tradier/markets/history?${queryString}`)
			.reply(200, createTradierHistory());

		const result = await getOneMonthHistory('VTI')();
		expect(result).toEqualRight(createHistory());
	});

	it('get 3 months history', async () => {
		const today = new Date();
		const historyQuery: HistoryQuery = {
			symbol: 'VTI',
			start: getThreeMonthHistoryStartDate(),
			end: formatDate(today),
			interval: 'daily'
		};
		const queryString = qs.stringify(historyQuery);
		mockApi
			.onGet(`/tradier/markets/history?${queryString}`)
			.reply(200, createTradierHistory());

		const result = await getThreeMonthHistory('VTI')();
		expect(result).toEqualRight(createHistory());
	});

	it('get 1 year history', async () => {
		const today = new Date();
		const historyQuery: HistoryQuery = {
			symbol: 'VTI',
			start: getOneYearHistoryStartDate(),
			end: formatDate(today),
			interval: 'weekly'
		};
		const queryString = qs.stringify(historyQuery);
		mockApi
			.onGet(`/tradier/markets/history?${queryString}`)
			.reply(200, createTradierHistory());

		const result = await getOneYearHistory('VTI')();
		expect(result).toEqualRight(createHistory());
	});

	it('get 5 years history', async () => {
		const today = new Date();
		const historyQuery: HistoryQuery = {
			symbol: 'VTI',
			start: getFiveYearHistoryStartDate(),
			end: formatDate(today),
			interval: 'monthly'
		};
		const queryString = qs.stringify(historyQuery);
		mockApi
			.onGet(`/tradier/markets/history?${queryString}`)
			.reply(200, createTradierHistory());

		const result = await getFiveYearHistory('VTI')();
		expect(result).toEqualRight(createHistory());
	});

	it('gets timesales for today', async () => {
		const start = getTodayTimesalesDate();
		const end = getTomorrowTimesalesDate();
		mockApi
			.onGet(
				`/tradier/markets/timesales?symbol=VTI&start=${start}&end=${end}&interval=5min`
			)
			.reply(200, createTimesale());

		const result = await getTimesales('VTI')();
		expect(result).toEqualRight(createTimesaleHistory());
	});

	it('gets timesales for today with null response', async () => {
		const start = getTodayTimesalesDate();
		const end = getTomorrowTimesalesDate();
		mockApi
			.onGet(
				`/tradier/markets/timesales?symbol=VTI&start=${start}&end=${end}&interval=5min`
			)
			.reply(200, {
				series: null
			});

		const result = await getTimesales('VTI')();
		expect(result).toEqualRight([]);
	});
});
