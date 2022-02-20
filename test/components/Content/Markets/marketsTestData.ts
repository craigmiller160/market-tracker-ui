import { TradierQuotes } from '../../../../src/types/tradier/quotes';
import { TradierHistory } from '../../../../src/types/tradier/history';
import { TradierSeries } from '../../../../src/types/tradier/timesales';
import MockAdapter from 'axios-mock-adapter';
import * as Time from '@craigmiller160/ts-functions/es/Time';
import * as Option from 'fp-ts/es6/Option';
import {
	getTimesalesEnd,
	getTimesalesStart
} from '../../../../src/utils/timeUtils';
import {
	TradierCalendar,
	TradierCalendarStatus
} from '../../../../src/types/tradier/calendar';
import { CoinGeckoPrice } from '../../../../src/types/coingecko/price';
import { CoinGeckoMarketChart } from '../../../../src/types/coingecko/marketchart';
import { pipe } from 'fp-ts/es6/function';
import {
	isCrypto,
	isStock,
	MarketInvestmentType
} from '../../../../src/types/data/MarketInvestmentType';

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
	readonly type: MarketInvestmentType;
	readonly id?: string;
}

export const testDataSettings: ReadonlyArray<TestDataSetting> = [
	{
		symbol: 'VTI',
		quotePrice: 100,
		historyPrice: 50,
		timesalePrice1: 40,
		timesalePrice2: 45,
		type: MarketInvestmentType.USA_ETF
	},
	{
		symbol: 'VOO',
		quotePrice: 101,
		historyPrice: 51,
		timesalePrice1: 41,
		timesalePrice2: 46,
		type: MarketInvestmentType.USA_ETF
	},
	{
		symbol: 'DIA',
		quotePrice: 102,
		historyPrice: 52,
		timesalePrice1: 42,
		timesalePrice2: 47,
		type: MarketInvestmentType.USA_ETF
	},
	{
		symbol: 'QQQ',
		quotePrice: 103,
		historyPrice: 53,
		timesalePrice1: 43,
		timesalePrice2: 48,
		type: MarketInvestmentType.USA_ETF
	},
	{
		symbol: 'EWU',
		quotePrice: 104,
		historyPrice: 54,
		timesalePrice1: 44,
		timesalePrice2: 49,
		type: MarketInvestmentType.INTERNATIONAL_ETF
	},
	{
		symbol: 'SPEU',
		quotePrice: 107,
		historyPrice: 57,
		timesalePrice1: 47,
		timesalePrice2: 52,
		type: MarketInvestmentType.INTERNATIONAL_ETF
	},
	{
		symbol: 'EWJ',
		quotePrice: 105,
		historyPrice: 55,
		timesalePrice1: 45,
		timesalePrice2: 50,
		type: MarketInvestmentType.INTERNATIONAL_ETF
	},
	{
		symbol: 'MCHI',
		quotePrice: 106,
		historyPrice: 56,
		timesalePrice1: 46,
		timesalePrice2: 51,
		type: MarketInvestmentType.INTERNATIONAL_ETF
	},
	{
		symbol: 'BTC',
		quotePrice: 108,
		historyPrice: 58,
		timesalePrice1: 48,
		timesalePrice2: 52,
		type: MarketInvestmentType.CRYPTO,
		id: 'bitcoin'
	},
	{
		symbol: 'ETH',
		quotePrice: 109,
		historyPrice: 59,
		timesalePrice1: 49,
		timesalePrice2: 53,
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
			last: setting.quotePrice
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
			last: setting.quotePrice
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
				marketSettings: '2022-01-01T01:00:00',
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
				marketSettings: '2022-01-01T01:01:01',
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
	readonly tradierInterval?: string;
	readonly timesaleTimestamp?: number;
	readonly isMarketClosed?: boolean;
	readonly coinGeckoInterval?: string;
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

const getCoinGeckoDays = (start: string | undefined): number =>
	pipe(
		Option.fromNullable(start),
		Option.map(Time.parse('yyyy-MM-dd')),
		Option.map(Time.differenceInDays(new Date())),
		Option.getOrElse(() => 1)
	);

export const createMockQueries =
	(mockApi: MockAdapter) =>
	(config: MockQueriesConfig = {}) => {
		const {
			start,
			tradierInterval,
			timesaleTimestamp,
			isMarketClosed,
			coinGeckoInterval
		} = config;

		const coinGeckoDays = getCoinGeckoDays(start);
		const realCoinGeckoInverval = coinGeckoInterval ?? 'daily';
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

		tradierSettings.forEach((setting) => {
			mockApi
				.onGet(`/tradier/markets/quotes?symbols=${setting.symbol}`)
				.reply(200, createTradierQuote(setting));
			mockApi
				.onGet(
					`/tradier/markets/history?symbol=${setting.symbol}&start=${start}&end=${today}&interval=${tradierInterval}`
				)
				.reply(200, createTradierHistory(setting));
			mockApi
				.onGet(
					`/tradier/markets/timesales?symbol=${setting.symbol}&start=${timesalesStart}&end=${timesalesEnd}&interval=1min`
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
			const response =
				coinGeckoDays === 1
					? createCoinGeckoTimesaleHistory(setting)
					: createCoinGeckoHistory(setting);

			mockApi
				.onGet(
					`/coingecko/coins/${setting.id}/market_chart?vs_currency=usd&days=1&interval=minutely`
				)
				.reply(200, createCoinGeckoTimesaleHistory(setting));
			mockApi
				.onGet(
					`/coingecko/coins/${setting.id}/market_chart?vs_currency=usd&days=${coinGeckoDays}&interval=${realCoinGeckoInverval}`
				)
				.reply(200, response);
		});
	};
