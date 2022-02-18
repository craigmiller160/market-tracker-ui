import { MarketTime } from '../types/MarketTime';
import { TaskTryT } from '@craigmiller160/ts-functions/es/types';
import { MarketStatus } from '../types/MarketStatus';
import { match, when } from 'ts-pattern';
import * as tradierService from './TradierService';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import * as coinGeckoService from './CoinGeckoService';
import {
	MarketInvestmentType,
	isStock,
	isCrypto
} from '../types/data/MarketInvestmentType';
import { HistoryRecord } from '../types/history';

type HistoryFn = (s: string) => TaskTryT<ReadonlyArray<HistoryRecord>>;

export interface InvestmentData {}

const getHistoryFn = (
	time: MarketTime,
	type: MarketInvestmentType
): HistoryFn =>
	match({ time, type })
		.with(
			{ time: MarketTime.ONE_DAY, type: when(isStock) },
			() => tradierService.getTimesales
		)
		.with(
			{ time: MarketTime.ONE_DAY, type: when(isCrypto) },
			() => coinGeckoService.getTodayHistory
		)
		.with(
			{ time: MarketTime.ONE_WEEK, type: when(isStock) },
			() => tradierService.getOneWeekHistory
		)
		.with(
			{ time: MarketTime.ONE_WEEK, type: when(isCrypto) },
			() => coinGeckoService.getOneWeekHistory
		)
		.with(
			{ time: MarketTime.ONE_MONTH, type: when(isStock) },
			() => tradierService.getOneMonthHistory
		)
		.with(
			{ time: MarketTime.ONE_MONTH, type: when(isCrypto) },
			() => coinGeckoService.getOneMonthHistory
		)
		.with(
			{ time: MarketTime.THREE_MONTHS, type: when(isStock) },
			() => tradierService.getThreeMonthHistory
		)
		.with(
			{ time: MarketTime.THREE_MONTHS, type: when(isCrypto) },
			() => coinGeckoService.getThreeMonthHistory
		)
		.with(
			{ time: MarketTime.ONE_YEAR, type: when(isStock) },
			() => tradierService.getOneYearHistory
		)
		.with(
			{ time: MarketTime.ONE_YEAR, type: when(isCrypto) },
			() => coinGeckoService.getOneYearHistory
		)
		.with(
			{ time: MarketTime.FIVE_YEARS, type: when(isStock) },
			() => tradierService.getFiveYearHistory
		)
		.with(
			{ time: MarketTime.FIVE_YEARS, type: when(isCrypto) },
			() => coinGeckoService.getFiveYearHistory
		)
		.run();

export const checkMarketStatus = (
	timeValue: MarketTime
): TaskTryT<MarketStatus> =>
	match(timeValue)
		.with(MarketTime.ONE_DAY, () => tradierService.getMarketStatus())
		.otherwise(() => TaskEither.right(MarketStatus.OPEN));

export const getInvestmentData = () => {};
