/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ajaxApiFpTs } from '../../src/services/AjaxApi';
import MockAdapter from 'axios-mock-adapter';
import { TradierQuote } from '../../src/types/tradier/quotes';
import {
	getFiveYearHistory,
	getMarketStatus,
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
import { TradierHistory } from '../../src/types/tradier/history';
import { HistoryRecord } from '../../src/types/history';
import {
	getFiveYearHistoryStartDate,
	getOneMonthHistoryStartDate,
	getOneWeekHistoryStartDate,
	getOneYearHistoryStartDate,
	getThreeMonthHistoryStartDate,
	getTodayEndString,
	getTodayStartString
} from '../../src/utils/timeUtils';
import { TradierSeries } from '../../src/types/tradier/timesales';
import { MarketStatus } from '../../src/types/MarketStatus';
import { TradierCalendar } from '../../src/types/tradier/calendar';

const formatCalendarYear = Time.format('yyyy');
const formatCalendarMonth = Time.format('MM');
const formatCalendarDate = Time.format('yyyy-MM-dd');

const mockApi = new MockAdapter(ajaxApiFpTs.instance);

const createTradierQuote = (symbol: string): TradierQuote => ({
	symbol,
	description: '',
	open: 0,
	high: 1,
	low: 2,
	bid: 3,
	ask: 4,
	close: 5,
	last: 6,
	prevclose: 7
});

const createQuote = (symbol: string): Quote => ({
	name: '',
	symbol,
	price: 6,
	previousClose: 7
});

const createTradierHistory = (): TradierHistory => ({
	history: {
		day: [
			{
				date: '2022-01-01',
				open: 2,
				high: 3,
				low: 4,
				close: 5
			},
			{
				date: '2022-01-02',
				open: 6,
				high: 7,
				low: 8,
				close: 9
			}
		]
	}
});

const unix1 = Math.floor(new Date().getTime() / 1000);
const unix2 = unix1 + 10;

const createTimesale = (): TradierSeries => ({
	series: {
		data: [
			{
				time: '2022-01-01T01:01:01',
				timestamp: unix1,
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
				timestamp: unix2,
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
		date: '2022-01-01',
		time: '00:00:00',
		unixTimestampMillis: 1641013200000,
		price: 2
	},
	{
		date: '2022-01-01',
		time: '23:59:59',
		unixTimestampMillis: 1641099599000,
		price: 5
	},
	{
		date: '2022-01-02',
		time: '00:00:00',
		unixTimestampMillis: 1641099600000,
		price: 6
	},
	{
		date: '2022-01-02',
		time: '23:59:59',
		unixTimestampMillis: 1641185999000,
		price: 9
	}
];

const createTimesaleHistory = (): ReadonlyArray<HistoryRecord> => [
	{
		date: '2022-01-01',
		time: '01:01:01',
		unixTimestampMillis: unix1 * 1000,
		price: 2
	},
	{
		date: '2022-01-01',
		time: '02:02:02',
		unixTimestampMillis: unix2 * 1000,
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
		const result = await getQuotes(['VTI']);
		expect(result).toEqual([createQuote('VTI')]);
	});

	it('get multiple quotes', async () => {
		mockApi.onGet('/tradier/markets/quotes?symbols=VTI,VOO').reply(200, {
			quotes: {
				quote: [createTradierQuote('VTI'), createTradierQuote('VOO')]
			}
		});
		const result = await getQuotes(['VTI', 'VOO']);
		expect(result).toEqual([createQuote('VTI'), createQuote('VOO')]);
	});

	describe('NaN', () => {
		it('get 1 week history, with NaN open', async () => {
			const history: TradierHistory = {
				history: {
					day: [
						createTradierHistory().history!.day[0],
						{
							...createTradierHistory().history!.day[1],
							open: 'NaN'
						}
					]
				}
			};
			const today = new Date();
			const historyQuery: HistoryQuery = {
				symbol: 'VTI',
				start: getOneWeekHistoryStartDate(),
				end: formatDate(today),
				interval: 'daily'
			};
			const queryString = qs.stringify(historyQuery);
			mockApi
				.onGet(`/tradier/markets/history?${queryString}`)
				.reply(200, history);

			const result = await getOneWeekHistory('VTI');
			expect(result).toEqual([
				createHistory()[0],
				createHistory()[1],
				createHistory()[3]
			]);
		});

		it('get 1 week history, with NaN close', async () => {
			const history: TradierHistory = {
				history: {
					day: [
						createTradierHistory().history!.day[0],
						{
							...createTradierHistory().history!.day[1],
							close: 'NaN'
						}
					]
				}
			};
			const today = new Date();
			const historyQuery: HistoryQuery = {
				symbol: 'VTI',
				start: getOneWeekHistoryStartDate(),
				end: formatDate(today),
				interval: 'daily'
			};
			const queryString = qs.stringify(historyQuery);
			mockApi
				.onGet(`/tradier/markets/history?${queryString}`)
				.reply(200, history);

			const result = await getOneWeekHistory('VTI');
			expect(result).toEqual([
				createHistory()[0],
				createHistory()[1],
				createHistory()[2]
			]);
		});

		it('get 1 week history, with NaN open and close', async () => {
			const history: TradierHistory = {
				history: {
					day: [
						createTradierHistory().history!.day[0],
						{
							...createTradierHistory().history!.day[1],
							open: 'NaN',
							close: 'NaN'
						}
					]
				}
			};
			const today = new Date();
			const historyQuery: HistoryQuery = {
				symbol: 'VTI',
				start: getOneWeekHistoryStartDate(),
				end: formatDate(today),
				interval: 'daily'
			};
			const queryString = qs.stringify(historyQuery);
			mockApi
				.onGet(`/tradier/markets/history?${queryString}`)
				.reply(200, history);

			const result = await getOneWeekHistory('VTI');
			expect(result).toEqual([createHistory()[0], createHistory()[1]]);
		});
	});

	it('get 1 week history', async () => {
		const today = new Date();
		const historyQuery: HistoryQuery = {
			symbol: 'VTI',
			start: getOneWeekHistoryStartDate(),
			end: formatDate(today),
			interval: 'daily'
		};
		const queryString = qs.stringify(historyQuery);
		mockApi
			.onGet(`/tradier/markets/history?${queryString}`)
			.reply(200, createTradierHistory());

		const result = await getOneWeekHistory('VTI');
		expect(result).toEqual(createHistory());
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

		const result = await getOneMonthHistory('VTI');
		expect(result).toEqual(createHistory());
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

		const result = await getThreeMonthHistory('VTI');
		expect(result).toEqual(createHistory());
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

		const result = await getOneYearHistory('VTI');
		expect(result).toEqual(createHistory());
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

		const result = await getFiveYearHistory('VTI');
		expect(result).toEqual(createHistory());
	});

	it('gets timesales for today', async () => {
		const start = getTodayStartString();
		const end = getTodayEndString();
		mockApi
			.onGet(
				`/tradier/markets/timesales?symbol=VTI&start=${start}&end=${end}&interval=1min`
			)
			.reply(200, createTimesale());

		const result = await getTimesales('VTI');
		expect(result).toEqual(createTimesaleHistory());
	});

	it('gets timesales for today with null response', async () => {
		const start = getTodayStartString();
		const end = getTodayEndString();
		mockApi
			.onGet(
				`/tradier/markets/timesales?symbol=VTI&start=${start}&end=${end}&interval=1min`
			)
			.reply(200, {
				series: null
			});

		const result = await getTimesales('VTI');
		expect(result).toEqual([]);
	});

	describe('getMarketStatus', () => {
		const today = new Date();
		const year = formatCalendarYear(today);
		const month = formatCalendarMonth(today);
		const dateString = formatCalendarDate(today);

		it('is closed', async () => {
			const calendar: TradierCalendar = {
				calendar: {
					month: 1,
					year: 2022,
					days: {
						day: [
							{
								date: dateString,
								status: 'closed'
							}
						]
					}
				}
			};
			mockApi
				.onGet(`/tradier/markets/calendar?year=${year}&month=${month}`)
				.reply(200, calendar);
			const result = await getMarketStatus();
			expect(result).toEqual(MarketStatus.CLOSED);
		});

		it('is not closed', async () => {
			const calendar: TradierCalendar = {
				calendar: {
					month: 1,
					year: 2022,
					days: {
						day: [
							{
								date: dateString,
								status: 'open'
							}
						]
					}
				}
			};
			mockApi
				.onGet(`/tradier/markets/calendar?year=${year}&month=${month}`)
				.reply(200, calendar);
			const result = await getMarketStatus();
			expect(result).toEqual(MarketStatus.OPEN);
		});

		it('no matching date', async () => {
			const calendar: TradierCalendar = {
				calendar: {
					month: 1,
					year: 2022,
					days: {
						day: [
							{
								date: '2000-01-01',
								status: 'open'
							}
						]
					}
				}
			};
			mockApi
				.onGet(`/tradier/markets/calendar?year=${year}&month=${month}`)
				.reply(200, calendar);
			const result = await getMarketStatus();
			expect(result).toEqual(MarketStatus.CLOSED);
		});
	});
});
