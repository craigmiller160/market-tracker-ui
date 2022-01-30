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
	HistoryQuery
} from '../../src/services/TradierService';
import '@relmify/jest-fp-ts';
import { Quote } from '../../src/types/quote';
import qs from 'qs';
import * as Time from '@craigmiller160/ts-functions/es/Time';
import { pipe } from 'fp-ts/es6/function';
import { TradierHistory } from '../../src/types/tradier/history';
import { HistoryDate } from '../../src/types/history';

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
			}
		]
	}
});

const createHistory = (): ReadonlyArray<HistoryDate> => [
	{
		date: '1',
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
			start: pipe(today, Time.subWeeks(1), formatDate),
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
			start: pipe(today, Time.subMonths(1), formatDate),
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
			start: pipe(today, Time.subMonths(3), formatDate),
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
			start: pipe(today, Time.subYears(1), formatDate),
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
			start: pipe(today, Time.subYears(5), formatDate),
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
});
