import {
	getHistoryFn,
	getInvestmentData,
	getQuoteFn
} from '../../src/services/MarketInvestmentService';
import { MarketTime } from '../../src/types/MarketTime';
import { MarketInvestmentType } from '../../src/types/data/MarketInvestmentType';
import * as tradierService from '../../src/services/TradierService';
import * as coinGeckoService from '../../src/services/CoinGeckoService';
import { MarketInvestmentInfo } from '../../src/types/data/MarketInvestmentInfo';
import { ajaxApi } from '../../src/services/AjaxApi';
import MockAdapter from 'axios-mock-adapter';
import '@relmify/jest-fp-ts';
import {
	getOneWeekHistoryStartDate,
	getTodayEndString,
	getTodayHistoryDate,
	getTodayStartString
} from '../../src/utils/timeUtils';
import { TradierHistory } from '../../src/types/tradier/history';
import {
	TradierSeries,
	TradierSeriesData
} from '../../src/types/tradier/timesales';
import { TradierQuotes } from '../../src/types/tradier/quotes';
import * as Time from '@craigmiller160/ts-functions/es/Time';
import { pipe } from 'fp-ts/es6/function';

const parseTimesaleTime: (time: string) => Date = Time.parse(
	"yyyy-MM-dd'T'HH:mm:ss"
);

const mockApi = new MockAdapter(ajaxApi.instance);

const tradierHistory: TradierHistory = {
	history: {
		day: [
			{
				date: '2022-01-01',
				open: 50,
				high: 0,
				low: 0,
				close: 70
			}
		]
	}
};

const tradierQuote: TradierQuotes = {
	quotes: {
		quote: {
			symbol: 'VTI',
			description: '',
			open: 0,
			high: 0,
			low: 0,
			bid: 0,
			ask: 0,
			close: 0,
			last: 100,
			prevclose: 60
		}
	}
};

const getMillisFromDateTime = (d: string): number =>
	Time.parse('yyyy-MM-dd HH:mm:ss')(d).getTime();

const tradierTimesale: TradierSeries = {
	series: {
		data: [
			{
				time: '2022-01-01T01:00:00',
				timestamp:
					parseTimesaleTime('2022-01-01T01:00:00').getTime() / 1000,
				price: 20,
				open: 0,
				high: 0,
				low: 0,
				close: 0,
				volume: 0,
				vwap: 0
			},
			{
				time: '2022-01-01T01:01:01',
				timestamp:
					parseTimesaleTime('2022-01-01T01:01:01').getTime() / 1000,
				price: 30,
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

const timesaleArray: ReadonlyArray<TradierSeriesData> = tradierTimesale.series
	?.data as ReadonlyArray<TradierSeriesData>;
const formatHistoryDate: (date: Date) => string = Time.format('yyyy-MM-dd');
const formatHistoryTime: (date: Date) => string = Time.format('HH:mm:ss');

describe('MarketInvestmentService', () => {
	beforeEach(() => {
		mockApi.reset();
	});

	describe('getHistoryFn', () => {
		it('Tradier One Day', () => {
			const usResult = getHistoryFn(
				MarketTime.ONE_DAY,
				MarketInvestmentType.USA_ETF
			);
			const intResult = getHistoryFn(
				MarketTime.ONE_DAY,
				MarketInvestmentType.INTERNATIONAL_ETF
			);
			expect(usResult).toEqual(tradierService.getTimesales);
			expect(intResult).toEqual(tradierService.getTimesales);
		});

		it('CoinGecko One Day', () => {
			const result = getHistoryFn(
				MarketTime.ONE_DAY,
				MarketInvestmentType.CRYPTO
			);
			expect(result).toEqual(coinGeckoService.getTodayHistory);
		});

		it('Tradier One Week', () => {
			const usResult = getHistoryFn(
				MarketTime.ONE_WEEK,
				MarketInvestmentType.USA_ETF
			);
			const intResult = getHistoryFn(
				MarketTime.ONE_WEEK,
				MarketInvestmentType.INTERNATIONAL_ETF
			);
			expect(usResult).toEqual(tradierService.getOneWeekHistory);
			expect(intResult).toEqual(tradierService.getOneWeekHistory);
		});

		it('CoinGecko One Week', () => {
			const result = getHistoryFn(
				MarketTime.ONE_WEEK,
				MarketInvestmentType.CRYPTO
			);
			expect(result).toEqual(coinGeckoService.getOneWeekHistory);
		});

		it('Tradier One Month', () => {
			const usResult = getHistoryFn(
				MarketTime.ONE_MONTH,
				MarketInvestmentType.USA_ETF
			);
			const intResult = getHistoryFn(
				MarketTime.ONE_MONTH,
				MarketInvestmentType.INTERNATIONAL_ETF
			);
			expect(usResult).toEqual(tradierService.getOneMonthHistory);
			expect(intResult).toEqual(tradierService.getOneMonthHistory);
		});

		it('CoinGecko One Month', () => {
			const result = getHistoryFn(
				MarketTime.ONE_MONTH,
				MarketInvestmentType.CRYPTO
			);
			expect(result).toEqual(coinGeckoService.getOneMonthHistory);
		});

		it('Tradier Three Months', () => {
			const usResult = getHistoryFn(
				MarketTime.THREE_MONTHS,
				MarketInvestmentType.USA_ETF
			);
			const intResult = getHistoryFn(
				MarketTime.THREE_MONTHS,
				MarketInvestmentType.INTERNATIONAL_ETF
			);
			expect(usResult).toEqual(tradierService.getThreeMonthHistory);
			expect(intResult).toEqual(tradierService.getThreeMonthHistory);
		});

		it('CoinGecko Three Months', () => {
			const result = getHistoryFn(
				MarketTime.THREE_MONTHS,
				MarketInvestmentType.CRYPTO
			);
			expect(result).toEqual(coinGeckoService.getThreeMonthHistory);
		});

		it('Tradier One Year', () => {
			const usResult = getHistoryFn(
				MarketTime.ONE_YEAR,
				MarketInvestmentType.USA_ETF
			);
			const intResult = getHistoryFn(
				MarketTime.ONE_YEAR,
				MarketInvestmentType.INTERNATIONAL_ETF
			);
			expect(usResult).toEqual(tradierService.getOneYearHistory);
			expect(intResult).toEqual(tradierService.getOneYearHistory);
		});

		it('CoinGecko One Year', () => {
			const result = getHistoryFn(
				MarketTime.ONE_YEAR,
				MarketInvestmentType.CRYPTO
			);
			expect(result).toEqual(coinGeckoService.getOneYearHistory);
		});

		it('Tradier Five Years', () => {
			const usResult = getHistoryFn(
				MarketTime.FIVE_YEARS,
				MarketInvestmentType.USA_ETF
			);
			const intResult = getHistoryFn(
				MarketTime.FIVE_YEARS,
				MarketInvestmentType.INTERNATIONAL_ETF
			);
			expect(usResult).toEqual(tradierService.getFiveYearHistory);
			expect(intResult).toEqual(tradierService.getFiveYearHistory);
		});

		it('CoinGecko Five Years', () => {
			const result = getHistoryFn(
				MarketTime.FIVE_YEARS,
				MarketInvestmentType.CRYPTO
			);
			expect(result).toEqual(coinGeckoService.getFiveYearHistory);
		});
	});

	describe('getQuoteFn', () => {
		it('Tradier Quote', () => {
			const usResult = getQuoteFn(MarketInvestmentType.USA_ETF);
			const intResult = getQuoteFn(
				MarketInvestmentType.INTERNATIONAL_ETF
			);
			expect(usResult).toEqual(tradierService.getQuotes);
			expect(intResult).toEqual(tradierService.getQuotes);
		});

		it('CoinGecko Quote', () => {
			const result = getQuoteFn(MarketInvestmentType.CRYPTO);
			expect(result).toEqual(coinGeckoService.getQuotes);
		});
	});

	describe('getInvestmentData', () => {
		const info: MarketInvestmentInfo = {
			symbol: 'VTI',
			name: 'US Total Market',
			type: MarketInvestmentType.USA_ETF
		};

		it('gets investment data for past history', async () => {
			mockApi
				.onGet('/tradier/markets/quotes?symbols=VTI')
				.reply(200, tradierQuote);
			const start = getOneWeekHistoryStartDate();
			const end = getTodayHistoryDate();
			mockApi
				.onGet(
					`/tradier/markets/history?symbol=VTI&start=${start}&end=${end}&interval=daily`
				)
				.reply(200, tradierHistory);
			const result = await getInvestmentData(MarketTime.ONE_WEEK, info)();
			expect(result).toEqualRight({
				startPrice: 60,
				currentPrice: 100,
				history: [
					{
						date: tradierHistory.history.day[0].date,
						time: '00:00:00',
						price: tradierHistory.history.day[0].open,
						unixTimestampMillis: getMillisFromDateTime(
							`${tradierHistory.history.day[0].date} 00:00:00`
						)
					},
					{
						date: tradierHistory.history.day[0].date,
						time: '23:59:59',
						price: tradierHistory.history.day[0].close,
						unixTimestampMillis: getMillisFromDateTime(
							`${tradierHistory.history.day[0].date} 23:59:59`
						)
					}
				]
			});
		});

		it('gets investment data for today', async () => {
			mockApi
				.onGet('/tradier/markets/quotes?symbols=VTI')
				.reply(200, tradierQuote);
			const start = getTodayStartString();
			const end = getTodayEndString();
			mockApi
				.onGet(
					`/tradier/markets/timesales?symbol=VTI&start=${start}&end=${end}&interval=1min`
				)
				.reply(200, tradierTimesale);
			const result = await getInvestmentData(MarketTime.ONE_DAY, info)();

			expect(result).toEqualRight({
				startPrice: 60,
				currentPrice: 100,
				history: [
					{
						date: pipe(
							parseTimesaleTime(timesaleArray[0].time),
							Time.subHours(1),
							formatHistoryDate
						),
						time: pipe(
							parseTimesaleTime(timesaleArray[0].time),
							Time.subHours(1),
							formatHistoryTime
						),
						price: 60,
						unixTimestampMillis: pipe(
							parseTimesaleTime(timesaleArray[0].time),
							Time.subHours(1)
						).getTime()
					},
					{
						date: pipe(
							parseTimesaleTime(timesaleArray[0].time),
							formatHistoryDate
						),
						time: pipe(
							parseTimesaleTime(timesaleArray[0].time),
							formatHistoryTime
						),
						price: timesaleArray[0].price,
						unixTimestampMillis: timesaleArray[0].timestamp * 1000
					},
					{
						date: pipe(
							parseTimesaleTime(timesaleArray[1].time),
							formatHistoryDate
						),
						time: pipe(
							parseTimesaleTime(timesaleArray[1].time),
							formatHistoryTime
						),
						price: timesaleArray[1].price,
						unixTimestampMillis: timesaleArray[1].timestamp * 1000
					}
				]
			});
		});

		it('gets investment data for past history without previous close for start price', async () => {
			const newQuote: TradierQuotes = {
				quotes: {
					quote: {
						...tradierQuote.quotes.quote,
						prevclose: 0
					}
				}
			};
			mockApi
				.onGet('/tradier/markets/quotes?symbols=VTI')
				.reply(200, newQuote);
			const start = getOneWeekHistoryStartDate();
			const end = getTodayHistoryDate();
			mockApi
				.onGet(
					`/tradier/markets/history?symbol=VTI&start=${start}&end=${end}&interval=daily`
				)
				.reply(200, tradierHistory);
			const result = await getInvestmentData(MarketTime.ONE_WEEK, info)();
			expect(result).toEqualRight({
				startPrice: tradierHistory.history.day[0].open,
				currentPrice: 100,
				history: [
					{
						date: tradierHistory.history.day[0].date,
						time: '00:00:00',
						price: tradierHistory.history.day[0].open,
						unixTimestampMillis: getMillisFromDateTime(
							`${tradierHistory.history.day[0].date} 00:00:00`
						)
					},
					{
						date: tradierHistory.history.day[0].date,
						time: '23:59:59',
						price: tradierHistory.history.day[0].close,
						unixTimestampMillis: getMillisFromDateTime(
							`${tradierHistory.history.day[0].date} 23:59:59`
						)
					}
				]
			});
		});

		it('gets investment data for today when most recent history record is later than now', async () => {
			mockApi
				.onGet('/tradier/markets/quotes?symbols=VTI')
				.reply(200, tradierQuote);
			const start = getTodayStartString();
			const end = getTodayEndString();
			const newTimesale: TradierSeries = {
				series: {
					data: [
						timesaleArray[0],
						{
							...timesaleArray[1],
							time: '2100-01-01T01:01:01',
							timestamp:
								parseTimesaleTime(
									'2100-01-01T01:01:01'
								).getTime() / 1000
						}
					]
				}
			};
			const newTimesaleArray: ReadonlyArray<TradierSeriesData> =
				newTimesale.series?.data as ReadonlyArray<TradierSeriesData>;
			mockApi
				.onGet(
					`/tradier/markets/timesales?symbol=VTI&start=${start}&end=${end}&interval=1min`
				)
				.reply(200, newTimesale);
			const result = await getInvestmentData(MarketTime.ONE_DAY, info)();

			expect(result).toEqualRight({
				startPrice: 20,
				currentPrice: 30,
				history: [
					{
						date: pipe(
							parseTimesaleTime(newTimesaleArray[0].time),
							formatHistoryDate
						),
						time: pipe(
							parseTimesaleTime(newTimesaleArray[0].time),
							formatHistoryTime
						),
						price: newTimesaleArray[0].price,
						unixTimestampMillis:
							newTimesaleArray[0].timestamp * 1000
					},
					{
						date: pipe(
							parseTimesaleTime(newTimesaleArray[1].time),
							formatHistoryDate
						),
						time: pipe(
							parseTimesaleTime(newTimesaleArray[1].time),
							formatHistoryTime
						),
						price: newTimesaleArray[1].price,
						unixTimestampMillis:
							newTimesaleArray[1].timestamp * 1000
					}
				]
			});
		});
	});
});
