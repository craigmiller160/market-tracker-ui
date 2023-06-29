import { getDateRangeForMarketTime } from '../../src/services/PortfolioService';
import { MarketTime } from '../../src/types/MarketTime';
import {
	getTodayEndString,
	getTodayStartString
} from '../../src/utils/timeUtils';

describe('PortfolioService', () => {
	describe('getDateRangeForMarketTime', () => {
		it('today', () => {
			const [start, end] = getDateRangeForMarketTime(MarketTime.ONE_DAY);
			expect(start).toEqual(getTodayStartString());
			expect(end).toEqual(getTodayEndString());
		});

		it('one week', () => {
			throw new Error();
		});

		it('one month', () => {
			throw new Error();
		});

		it('three months', () => {
			throw new Error();
		});

		it('one year', () => {
			throw new Error();
		});

		it('five years', () => {
			throw new Error();
		});
	});
});
