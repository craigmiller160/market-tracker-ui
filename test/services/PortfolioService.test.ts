import { getDateRangeForMarketTime } from '../../src/services/PortfolioService';
import { MarketTime } from '../../src/types/MarketTime';
import {
	formatHistoryDate,
	getFiveYearHistoryStartDate,
	getOneMonthHistoryStartDate,
	getOneWeekHistoryStartDate,
	getOneYearHistoryStartDate,
	getThreeMonthHistoryStartDate,
	getTodayEndString,
	getTodayStartString
} from '../../src/utils/timeUtils';

describe('PortfolioService', () => {
	describe('getDateRangeForMarketTime', () => {
		it('today', () => {
			const [start, end] = getDateRangeForMarketTime(MarketTime.ONE_DAY);
			expect(start).toEqual(getTodayStartString()); // TODO wrong
			expect(end).toEqual(getTodayEndString());
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
});
