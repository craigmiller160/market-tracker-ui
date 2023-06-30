import {getDateRangeForMarketTime, getIntervalForMarketTime} from '../../src/services/PortfolioService';
import { MarketTime } from '../../src/types/MarketTime';
import {
	formatHistoryDate,
	getFiveYearHistoryStartDate,
	getOneMonthHistoryStartDate,
	getOneWeekHistoryStartDate,
	getOneYearHistoryStartDate,
	getThreeMonthHistoryStartDate
} from '../../src/utils/timeUtils';
import { pipe } from 'fp-ts/es6/function';
import { addDays } from 'date-fns/fp';

describe('PortfolioService', () => {
	describe('getDateRangeForMarketTime', () => {
		it('today', () => {
			const [start, end] = getDateRangeForMarketTime(MarketTime.ONE_DAY);
			expect(start).toEqual(formatHistoryDate(new Date()));
			expect(end).toEqual(
				pipe(new Date(), addDays(1), formatHistoryDate)
			);
		});

		it('one week', () => {
			const [start, end] = getDateRangeForMarketTime(MarketTime.ONE_WEEK);
			expect(start).toEqual(getOneWeekHistoryStartDate());
			expect(end).toEqual(formatHistoryDate(new Date()));
		});

		it('one month', () => {
			const [start, end] = getDateRangeForMarketTime(
				MarketTime.ONE_MONTH
			);
			expect(start).toEqual(getOneMonthHistoryStartDate());
			expect(end).toEqual(formatHistoryDate(new Date()));
		});

		it('three months', () => {
			const [start, end] = getDateRangeForMarketTime(
				MarketTime.THREE_MONTHS
			);
			expect(start).toEqual(getThreeMonthHistoryStartDate());
			expect(end).toEqual(formatHistoryDate(new Date()));
		});

		it('one year', () => {
			const [start, end] = getDateRangeForMarketTime(MarketTime.ONE_YEAR);
			expect(start).toEqual(getOneYearHistoryStartDate());
			expect(end).toEqual(formatHistoryDate(new Date()));
		});

		it('five years', () => {
			const [start, end] = getDateRangeForMarketTime(
				MarketTime.FIVE_YEARS
			);
			expect(start).toEqual(getFiveYearHistoryStartDate());
			expect(end).toEqual(formatHistoryDate(new Date()));
		});
	});

	describe('getIntervalForMarketTime', () => {
		it('today', () => {
			const interval = getIntervalForMarketTime(MarketTime.ONE_DAY);
			throw new Error();
		});

		it('one week', () => {
			const interval = getIntervalForMarketTime(MarketTime.ONE_WEEK);
			throw new Error();
		});

		it('one month', () => {
			const interval = getIntervalForMarketTime(
				MarketTime.ONE_MONTH
			);
			throw new Error();
		});

		it('three months', () => {
			const interval = getIntervalForMarketTime(
				MarketTime.THREE_MONTHS
			);
			throw new Error();
		});

		it('one year', () => {
			const interval = getIntervalForMarketTime(MarketTime.ONE_YEAR);
			throw new Error();
		});

		it('five years', () => {
			const interval = getIntervalForMarketTime(
				MarketTime.FIVE_YEARS
			);
			throw new Error();
		});
	});
});
