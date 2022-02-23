import {
	getHistoryFn,
	getQuoteFn
} from '../../src/services/MarketInvestmentService';
import { MarketTime } from '../../src/types/MarketTime';
import { MarketInvestmentType } from '../../src/types/data/MarketInvestmentType';
import * as tradierService from '../../src/services/TradierService';
import * as coinGeckoService from '../../src/services/CoinGeckoService';

// TODO take the API setup stuff for the regexes in Markets.test and make it re-usable

describe('MarketInvestmentService', () => {
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
		it('gets investment data for past history', async () => {
			throw new Error();
		});

		it('gets investment data for today', async () => {
			throw new Error();
		});

		it('gets investment data for today when most recent history record is later than now', async () => {
			throw new Error();
		});

		it('gets investment data for past history, no quote available', async () => {
			throw new Error();
		});

		it('gets investment data for past history, no quote or history available', async () => {
			throw new Error();
		});

		it('what is going on with previousClose in my logic???', async () => {
			// Probably the source of some bugs
			throw new Error();
		});
	});
});
