import { describe, it, expect } from 'vitest';
import { MarketTime } from '../../src/types/MarketTime';
import { InvestmentType } from '../../src/types/data/InvestmentType';
import * as tradierService from '../../src/services/TradierService';
import * as coinGeckoService from '../../src/services/CoinGeckoService';
import { getHistoryFn, getQuoteFn } from '../../src/services/ServiceSelectors';

describe('InvestmentQueries', () => {
	describe('getHistoryFn', () => {
		it('Tradier One Day', () => {
			const stockResult = getHistoryFn(
				MarketTime.ONE_DAY,
				InvestmentType.STOCK
			);
			expect(stockResult).toEqual(tradierService.getTimesales);
		});

		it('CoinGecko One Day', () => {
			const result = getHistoryFn(
				MarketTime.ONE_DAY,
				InvestmentType.CRYPTO
			);
			expect(result).toEqual(coinGeckoService.getTodayHistory);
		});

		it('Tradier One Week', () => {
			const stockResult = getHistoryFn(
				MarketTime.ONE_WEEK,
				InvestmentType.STOCK
			);
			expect(stockResult).toEqual(tradierService.getOneWeekHistory);
		});

		it('CoinGecko One Week', () => {
			const result = getHistoryFn(
				MarketTime.ONE_WEEK,
				InvestmentType.CRYPTO
			);
			expect(result).toEqual(coinGeckoService.getOneWeekHistory);
		});

		it('Tradier One Month', () => {
			const stockResult = getHistoryFn(
				MarketTime.ONE_MONTH,
				InvestmentType.STOCK
			);
			expect(stockResult).toEqual(tradierService.getOneMonthHistory);
		});

		it('CoinGecko One Month', () => {
			const result = getHistoryFn(
				MarketTime.ONE_MONTH,
				InvestmentType.CRYPTO
			);
			expect(result).toEqual(coinGeckoService.getOneMonthHistory);
		});

		it('Tradier Three Months', () => {
			const stockResult = getHistoryFn(
				MarketTime.THREE_MONTHS,
				InvestmentType.STOCK
			);
			expect(stockResult).toEqual(tradierService.getThreeMonthHistory);
		});

		it('CoinGecko Three Months', () => {
			const result = getHistoryFn(
				MarketTime.THREE_MONTHS,
				InvestmentType.CRYPTO
			);
			expect(result).toEqual(coinGeckoService.getThreeMonthHistory);
		});

		it('Tradier One Year', () => {
			const stockResult = getHistoryFn(
				MarketTime.ONE_YEAR,
				InvestmentType.STOCK
			);
			expect(stockResult).toEqual(tradierService.getOneYearHistory);
		});

		it('CoinGecko One Year', () => {
			const result = getHistoryFn(
				MarketTime.ONE_YEAR,
				InvestmentType.CRYPTO
			);
			expect(result).toEqual(coinGeckoService.getOneYearHistory);
		});

		it('Tradier Five Years', () => {
			const stockResult = getHistoryFn(
				MarketTime.FIVE_YEARS,
				InvestmentType.STOCK
			);
			expect(stockResult).toEqual(tradierService.getFiveYearHistory);
		});

		it('CoinGecko Five Years', () => {
			const result = getHistoryFn(
				MarketTime.FIVE_YEARS,
				InvestmentType.CRYPTO
			);
			expect(result).toEqual(coinGeckoService.getFiveYearHistory);
		});
	});

	describe('getQuoteFn', () => {
		it('Tradier Quote', () => {
			const stockResult = getQuoteFn(InvestmentType.STOCK);
			expect(stockResult).toEqual(tradierService.getQuotes);
		});

		it('CoinGecko Quote', () => {
			const result = getQuoteFn(InvestmentType.CRYPTO);
			expect(result).toEqual(coinGeckoService.getQuotes);
		});
	});
});
