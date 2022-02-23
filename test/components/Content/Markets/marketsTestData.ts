import { TradierQuotes } from '../../../../src/types/tradier/quotes';
import { TradierHistory } from '../../../../src/types/tradier/history';
import { TradierSeries } from '../../../../src/types/tradier/timesales';
import MockAdapter from 'axios-mock-adapter';
import * as Time from '@craigmiller160/ts-functions/es/Time';
import {
	formatHistoryDate,
	formatTimesalesDate,
	getTodayEnd,
	getTodayStart
} from '../../../../src/utils/timeUtils';
import {
	TradierCalendar,
	TradierCalendarStatus
} from '../../../../src/types/tradier/calendar';
import { CoinGeckoPrice } from '../../../../src/types/coingecko/price';
import { CoinGeckoMarketChart } from '../../../../src/types/coingecko/marketchart';
import {
	isCrypto,
	isStock,
	MarketInvestmentType
} from '../../../../src/types/data/MarketInvestmentType';

const today = new Date();
const todayFormatted = formatHistoryDate(today);
const timesalesStart = getTodayStart();
const timesalesEnd = getTodayEnd();

export interface TestDataSetting {
	readonly symbol: string;
	readonly quotePrice: number;
	readonly historyPrice: number;
	readonly timesalePrice1: number;
	readonly timesalePrice2: number;
	readonly type: MarketInvestmentType;
	readonly prevClosePrice: number;
	readonly id?: string;
}

export const testDataSettings: ReadonlyArray<TestDataSetting> = [
	{
		symbol: 'VTI',
		quotePrice: 100,
		historyPrice: 50,
		timesalePrice1: 40,
		timesalePrice2: 45,
		prevClosePrice: 30,
		type: MarketInvestmentType.USA_ETF
	},
	{
		symbol: 'VOO',
		quotePrice: 101,
		historyPrice: 51,
		timesalePrice1: 41,
		timesalePrice2: 46,
		prevClosePrice: 31,
		type: MarketInvestmentType.USA_ETF
	},
	{
		symbol: 'DIA',
		quotePrice: 102,
		historyPrice: 52,
		timesalePrice1: 42,
		timesalePrice2: 47,
		prevClosePrice: 32,
		type: MarketInvestmentType.USA_ETF
	},
	{
		symbol: 'QQQ',
		quotePrice: 103,
		historyPrice: 53,
		timesalePrice1: 43,
		timesalePrice2: 48,
		prevClosePrice: 33,
		type: MarketInvestmentType.USA_ETF
	},
	{
		symbol: 'EWU',
		quotePrice: 104,
		historyPrice: 54,
		timesalePrice1: 44,
		timesalePrice2: 49,
		prevClosePrice: 34,
		type: MarketInvestmentType.INTERNATIONAL_ETF
	},
	{
		symbol: 'SPEU',
		quotePrice: 107,
		historyPrice: 57,
		timesalePrice1: 47,
		timesalePrice2: 52,
		prevClosePrice: 35,
		type: MarketInvestmentType.INTERNATIONAL_ETF
	},
	{
		symbol: 'EWJ',
		quotePrice: 105,
		historyPrice: 55,
		timesalePrice1: 45,
		timesalePrice2: 50,
		prevClosePrice: 36,
		type: MarketInvestmentType.INTERNATIONAL_ETF
	},
	{
		symbol: 'MCHI',
		quotePrice: 106,
		historyPrice: 56,
		timesalePrice1: 46,
		timesalePrice2: 51,
		prevClosePrice: 37,
		type: MarketInvestmentType.INTERNATIONAL_ETF
	},
	{
		symbol: 'BTC',
		quotePrice: 108,
		historyPrice: 58,
		timesalePrice1: 48,
		timesalePrice2: 52,
		prevClosePrice: 0,
		type: MarketInvestmentType.CRYPTO,
		id: 'bitcoin'
	},
	{
		symbol: 'ETH',
		quotePrice: 109,
		historyPrice: 59,
		timesalePrice1: 49,
		timesalePrice2: 53,
		prevClosePrice: 0,
		type: MarketInvestmentType.CRYPTO,
		id: 'ethereum'
	}
];

export const createCoinGeckoHistory = (
	setting: TestDataSetting
): CoinGeckoMarketChart => ({
	prices: [[new Date().getTime(), setting.historyPrice]]
});

export const createCoinGeckoTimesaleHistory = (
	setting: TestDataSetting
): CoinGeckoMarketChart => ({
	prices: [
		[new Date().getTime(), setting.timesalePrice1],
		[Time.addHours(1)(new Date()).getTime(), setting.timesalePrice2]
	]
});

export const createTradierQuote = (
	setting: TestDataSetting
): TradierQuotes => ({
	quotes: {
		quote: {
			symbol: setting.symbol,
			description: '',
			open: 0,
			high: 0,
			low: 0,
			bid: 0,
			ask: 0,
			close: 0,
			last: setting.quotePrice,
			prevclose: setting.prevClosePrice
		}
	}
});

export const createTradierQuotes = (
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
			last: setting.quotePrice,
			prevclose: setting.prevClosePrice
		}))
	}
});

export const createTradierHistory = (
	setting: TestDataSetting
): TradierHistory => ({
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

const bitcoinPrice: CoinGeckoPrice = {
	bitcoin: {
		usd: 108
	}
};

const ethereumQuote: CoinGeckoPrice = {
	ethereum: {
		usd: 109
	}
};

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
	readonly start?: Date;
	readonly tradierInterval?: string;
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
		const { start, tradierInterval, timesaleTimestamp, isMarketClosed } =
			config;

		const calendarToday = new Date();
		const calendarDate = Time.format('yyyy-MM-dd')(calendarToday);
		const month = Time.format('MM')(calendarToday);
		const year = Time.format('yyyy')(calendarToday);
		const status = isMarketClosed ?? false ? 'closed' : 'open';
		mockApi
			.onGet(`/tradier/markets/calendar?year=${year}&month=${month}`)
			.reply(200, createMockCalendar(calendarDate, status));

		const tradierSettings = testDataSettings.filter((setting) =>
			isStock(setting.type)
		);
		const coinGeckoSettings = testDataSettings.filter((setting) =>
			isCrypto(setting.type)
		);
		const realStart = start ?? Time.subDays(1)(new Date());
		const startFormatted = formatHistoryDate(realStart);
		const timesaleStartFormatted = formatTimesalesDate(timesalesStart);
		const timesaleEndFormatted = formatTimesalesDate(timesalesEnd);

		tradierSettings.forEach((setting) => {
			mockApi
				.onGet(`/tradier/markets/quotes?symbols=${setting.symbol}`)
				.reply(200, createTradierQuote(setting));
			mockApi
				.onGet(
					`/tradier/markets/history?symbol=${setting.symbol}&start=${startFormatted}&end=${todayFormatted}&interval=${tradierInterval}`
				)
				.reply(200, createTradierHistory(setting));
			mockApi
				.onGet(
					`/tradier/markets/timesales?symbol=${setting.symbol}&start=${timesaleStartFormatted}&end=${timesaleEndFormatted}&interval=1min`
				)
				.reply(200, createTimesale(timesaleTimestamp, setting));
		});

		mockApi
			.onGet('/coingecko/simple/price?ids=bitcoin&vs_currencies=usd')
			.reply(200, bitcoinPrice);
		mockApi
			.onGet('/coingecko/simple/price?ids=ethereum&vs_currencies=usd')
			.reply(200, ethereumQuote);

		coinGeckoSettings.forEach((setting) => {
			const todayStartMillis = Math.floor(
				timesalesStart.getTime() / 1000
			).toString();
			const todayEndMillis = Math.floor(
				today.getTime() / 1000
			).toString();
			const todayStartPattern = `${todayStartMillis.substring(0, 9)}\\d`;
			const todayEndPattern = `${todayEndMillis.substring(0, 9)}\\d`;
			const todayUrlPattern = RegExp(
				`\\/coingecko\\/coins\\/${setting.id}\\/market_chart\\/range\\?vs_currency=usd&from=${todayStartPattern}&to=${todayEndPattern}`
			);

			mockApi
				.onGet(todayUrlPattern)
				.reply(200, createCoinGeckoTimesaleHistory(setting));
			if (start !== undefined) {
				const actualStart = Math.floor(
					start.getTime() / 1000
				).toString();
				const actualStartPattern = `${actualStart.substring(0, 9)}\\d`;
				const actualUrlPattern = RegExp(
					`\\/coingecko\\/coins\\/${setting.id}\\/market_chart\\/range\\?vs_currency=usd&from=${actualStartPattern}&to=${todayEndPattern}`
				);
				mockApi
					.onGet(actualUrlPattern)
					.reply(200, createCoinGeckoHistory(setting));
			}
		});
	};
