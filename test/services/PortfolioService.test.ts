import { describe, it, expect } from 'vitest';
import {
    getDateRangeForMarketTime,
    getIntervalForMarketTime,
    mondayAfterDate,
    mondayBeforeDate,
    monthStartAfterDate,
    monthStartBeforeDate
} from '../../src/services/PortfolioService';
import { MarketTime } from '../../src/types/MarketTime';
import {
    formatHistoryDate,
    getFiveYearStartDate,
    getOneMonthHistoryStartDate,
    getOneWeekHistoryStartDate,
    getOneYearStartDate,
    getThreeMonthHistoryStartDate
} from '../../src/utils/timeUtils';
import { pipe } from 'fp-ts/function';

describe('PortfolioService', () => {
    describe('getDateRangeForMarketTime', () => {
        it('today', () => {
            const [start, end] = getDateRangeForMarketTime(MarketTime.ONE_DAY);
            expect(start).toEqual(formatHistoryDate(new Date()));
            expect(end).toEqual(pipe(new Date(), formatHistoryDate));
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
            expect(start).toEqual(mondayAfterDate(getOneYearStartDate()));
            expect(end).toEqual(mondayBeforeDate(new Date()));
        });

        it('five years', () => {
            const [start, end] = getDateRangeForMarketTime(
                MarketTime.FIVE_YEARS
            );
            expect(start).toEqual(monthStartAfterDate(getFiveYearStartDate()));
            expect(end).toEqual(monthStartBeforeDate(new Date()));
        });
    });

    describe('getIntervalForMarketTime', () => {
        it('today', () => {
            const interval = getIntervalForMarketTime(MarketTime.ONE_DAY);
            expect(interval).toEqual('SINGLE');
        });

        it('one week', () => {
            const interval = getIntervalForMarketTime(MarketTime.ONE_WEEK);
            expect(interval).toEqual('DAILY');
        });

        it('one month', () => {
            const interval = getIntervalForMarketTime(MarketTime.ONE_MONTH);
            expect(interval).toEqual('DAILY');
        });

        it('three months', () => {
            const interval = getIntervalForMarketTime(MarketTime.THREE_MONTHS);
            expect(interval).toEqual('DAILY');
        });

        it('one year', () => {
            const interval = getIntervalForMarketTime(MarketTime.ONE_YEAR);
            expect(interval).toEqual('WEEKLY');
        });

        it('five years', () => {
            const interval = getIntervalForMarketTime(MarketTime.FIVE_YEARS);
            expect(interval).toEqual('MONTHLY');
        });
    });
});
