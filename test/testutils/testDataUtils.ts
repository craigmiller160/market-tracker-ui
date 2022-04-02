import { MarketTime } from '../../src/types/MarketTime';
import { match } from 'ts-pattern';
import {
	getFiveYearStartDate,
	getOneMonthStartDate,
	getOneWeekStartDate,
	getOneYearStartDate,
	getThreeMonthStartDate,
	getTodayStart
} from '../../src/utils/timeUtils';

export const getTradierInterval = (time: MarketTime): string =>
	match(time)
		.with(MarketTime.ONE_WEEK, () => 'daily')
		.with(MarketTime.ONE_MONTH, () => 'daily')
		.with(MarketTime.THREE_MONTHS, () => 'daily')
		.with(MarketTime.ONE_YEAR, () => 'weekly')
		.with(MarketTime.FIVE_YEARS, () => 'monthly')
		.run();

export const getHistoryStart = (time: MarketTime): Date =>
	match(time)
		.with(MarketTime.ONE_DAY, getTodayStart)
		.with(MarketTime.ONE_WEEK, getOneWeekStartDate)
		.with(MarketTime.ONE_MONTH, getOneMonthStartDate)
		.with(MarketTime.THREE_MONTHS, getThreeMonthStartDate)
		.with(MarketTime.ONE_YEAR, getOneYearStartDate)
		.with(MarketTime.FIVE_YEARS, getFiveYearStartDate)
		.run();
