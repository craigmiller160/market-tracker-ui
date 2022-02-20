import { CoinGeckoPrice } from '../../src/types/coingecko/price';
import { ajaxApi } from '../../src/services/AjaxApi';
import MockAdapter from 'axios-mock-adapter';
import '@relmify/jest-fp-ts';
import {
	getDays,
	getFiveYearHistory,
	getOneMonthHistory,
	getOneWeekHistory,
	getOneYearHistory,
	getQuotes,
	getThreeMonthHistory,
	getTodayHistory
} from '../../src/services/CoinGeckoService';
import { CoinGeckoMarketChart } from '../../src/types/coingecko/marketchart';
import * as Time from '@craigmiller160/ts-functions/es/Time';
import { HistoryRecord } from '../../src/types/history';
import {
	getFiveYearHistoryStartDate,
	getOneMonthHistoryStartDate,
	getOneWeekHistoryStartDate,
	getOneYearHistoryStartDate,
	getThreeMonthHistoryStartDate
} from '../../src/utils/timeUtils';

const ids: ReadonlyArray<string> = ['bitcoin', 'ethereum'];
const symbols: ReadonlyArray<string> = ['BTC', 'ETH'];

const price: CoinGeckoPrice = {
	bitcoin: {
		usd: 100.5
	},
	ethereum: {
		usd: 50.75
	}
};

const date1 = new Date();
const date2 = Time.addHours(1)(new Date());

const chart: CoinGeckoMarketChart = {
	prices: [
		[date1.getTime(), 100],
		[date2.getTime(), 200]
	]
};

const history: ReadonlyArray<HistoryRecord> = [
	{
		date: Time.format('yyyy-MM-dd')(date1),
		marketSettings: Time.format('HH:mm:ss')(date1),
		unixTimestampMillis: date1.getTime(),
		price: 100
	},
	{
		date: Time.format('yyyy-MM-dd')(date2),
		marketSettings: Time.format('HH:mm:ss')(date2),
		unixTimestampMillis: date2.getTime(),
		price: 200
	}
];

const mockApi = new MockAdapter(ajaxApi.instance);

describe('CoinGeckoService', () => {
	beforeEach(() => {
		mockApi.reset();
	});

	it('gets quotes for currencies', async () => {
		mockApi
			.onGet(
				`/coingecko/simple/price?ids=${ids.join(',')}&vs_currencies=usd`
			)
			.reply(200, price);

		const result = await getQuotes(symbols)();
		expect(result).toEqualRight([
			{
				symbol: 'BTC',
				price: 100.5
			},
			{
				symbol: 'ETH',
				price: 50.75
			}
		]);
	});

	it('gets history for today', async () => {
		mockApi
			.onGet(
				'/coingecko/coins/bitcoin/market_chart?vs_currency=usd&days=1&interval=minutely'
			)
			.reply(200, chart);
		const result = await getTodayHistory('BTC')();
		expect(result).toEqualRight(history);
	});

	it('gets 1 week history', async () => {
		const days = getDays(getOneWeekHistoryStartDate());
		mockApi
			.onGet(
				`/coingecko/coins/bitcoin/market_chart?vs_currency=usd&days=${days}&interval=daily`
			)
			.reply(200, chart);
		const result = await getOneWeekHistory('BTC')();
		expect(result).toEqualRight(history);
	});

	it('gets 1 month history', async () => {
		const days = getDays(getOneMonthHistoryStartDate());
		mockApi
			.onGet(
				`/coingecko/coins/bitcoin/market_chart?vs_currency=usd&days=${days}&interval=daily`
			)
			.reply(200, chart);
		const result = await getOneMonthHistory('BTC')();
		expect(result).toEqualRight(history);
	});

	it('gets 3 months history', async () => {
		const days = getDays(getThreeMonthHistoryStartDate());
		mockApi
			.onGet(
				`/coingecko/coins/bitcoin/market_chart?vs_currency=usd&days=${days}&interval=daily`
			)
			.reply(200, chart);
		const result = await getThreeMonthHistory('BTC')();
		expect(result).toEqualRight(history);
	});

	it('gets 1 year history', async () => {
		const days = getDays(getOneYearHistoryStartDate());
		mockApi
			.onGet(
				`/coingecko/coins/bitcoin/market_chart?vs_currency=usd&days=${days}&interval=daily`
			)
			.reply(200, chart);
		const result = await getOneYearHistory('BTC')();
		expect(result).toEqualRight(history);
	});

	it('gets 5 years history', async () => {
		const days = getDays(getFiveYearHistoryStartDate());
		mockApi
			.onGet(
				`/coingecko/coins/bitcoin/market_chart?vs_currency=usd&days=${days}&interval=daily`
			)
			.reply(200, chart);
		const result = await getFiveYearHistory('BTC')();
		expect(result).toEqualRight(history);
	});
});
