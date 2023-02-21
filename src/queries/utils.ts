import { MarketTime } from '../types/MarketTime';
import { HistoryRecord } from '../types/history';
import { match, P } from 'ts-pattern';
import * as tradierService from '../services/TradierService';
import {
	InvestmentType,
	isCrypto,
	isStock
} from '../types/data/InvestmentType';
import * as coinGeckoService from '../services/CoinGeckoService';

// TODO make sure refetch works after implementation
export const TODAY_REFETCH_INTERVAL = 300_000;

export const getRefetchInterval = (time: MarketTime): number =>
	time === MarketTime.ONE_DAY ? TODAY_REFETCH_INTERVAL : 0;

export type GetHistoryQueryKey = [string, MarketTime, string];

type HistoryFn = (symbol: string) => Promise<ReadonlyArray<HistoryRecord>>;
export const getHistoryFn = (
	time: MarketTime,
	type: InvestmentType
): HistoryFn =>
	match({ time, type })
		.with(
			{ time: MarketTime.ONE_DAY, type: P.when(isStock) },
			() => tradierService.getTimesales
		)
		.with(
			{ time: MarketTime.ONE_DAY, type: P.when(isCrypto) },
			() => coinGeckoService.getTodayHistory
		)
		.with(
			{ time: MarketTime.ONE_WEEK, type: P.when(isStock) },
			() => tradierService.getOneWeekHistory
		)
		.with(
			{ time: MarketTime.ONE_WEEK, type: P.when(isCrypto) },
			() => coinGeckoService.getOneWeekHistory
		)
		.with(
			{ time: MarketTime.ONE_MONTH, type: P.when(isStock) },
			() => tradierService.getOneMonthHistory
		)
		.with(
			{ time: MarketTime.ONE_MONTH, type: P.when(isCrypto) },
			() => coinGeckoService.getOneMonthHistory
		)
		.with(
			{ time: MarketTime.THREE_MONTHS, type: P.when(isStock) },
			() => tradierService.getThreeMonthHistory
		)
		.with(
			{ time: MarketTime.THREE_MONTHS, type: P.when(isCrypto) },
			() => coinGeckoService.getThreeMonthHistory
		)
		.with(
			{ time: MarketTime.ONE_YEAR, type: P.when(isStock) },
			() => tradierService.getOneYearHistory
		)
		.with(
			{ time: MarketTime.ONE_YEAR, type: P.when(isCrypto) },
			() => coinGeckoService.getOneYearHistory
		)
		.with(
			{ time: MarketTime.FIVE_YEARS, type: P.when(isStock) },
			() => tradierService.getFiveYearHistory
		)
		.with(
			{ time: MarketTime.FIVE_YEARS, type: P.when(isCrypto) },
			() => coinGeckoService.getFiveYearHistory
		)
		.run();
