import { useSelector } from 'react-redux';
import { timeValueSelector } from '../../../store/time/selectors';
import { MarketTime } from '../../../types/MarketTime';
import { match } from 'ts-pattern';
import * as tradierService from '../../../services/TradierService';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import { MarketStatus } from '../../../types/MarketStatus';
import { TaskTryT } from '@craigmiller160/ts-functions/es/types';
import { HistoryRecord } from '../../../types/history';
import { pipe } from 'fp-ts/es6/function';
import { MARKET_SYMBOLS } from './MarketInfo';
import * as RArray from 'fp-ts/es6/ReadonlyArray';

/*
1) Check if market open
	a) If oneDay, call calendar API
	b) Otherwise, return OPEN

2) Get History
	a) If market closed, do a no-op
	b) Otherwise, run all history APIs

3) Get Quote
	a) If market closed, do a no-op
	b) If market open and history timestamp below current timestamp, get quote
	c) If market open and history timestamp higher than current timestamp, do a no-op

 */

type HistoryFn = (s: string) => TaskTryT<ReadonlyArray<HistoryRecord>>;

const checkMarketStatus = (timeValue: MarketTime): TaskTryT<MarketStatus> =>
	match(timeValue)
		.with(MarketTime.ONE_DAY, () => tradierService.isMarketClosed())
		.otherwise(() => TaskEither.right(MarketStatus.OPEN));

const getHistoryFn = (time: MarketTime): HistoryFn =>
	match(time)
		.with(MarketTime.ONE_DAY, () => tradierService.getTimesales)
		.with(MarketTime.ONE_WEEK, () => tradierService.getOneWeekHistory)
		.with(MarketTime.ONE_MONTH, () => tradierService.getOneMonthHistory)
		.with(
			MarketTime.THREE_MONTHS,
			() => tradierService.getThreeMonthHistory
		)
		.with(MarketTime.ONE_YEAR, () => tradierService.getOneYearHistory)
		.with(MarketTime.FIVE_YEARS, () => tradierService.getFiveYearHistory)
		.run();

const getHistory = (
	status: MarketStatus,
	time: MarketTime
): TaskTryT<ReadonlyArray<ReadonlyArray<HistoryRecord>>> =>
	match(status)
		.with(MarketStatus.CLOSED, () => TaskEither.right([]))
		.otherwise(() =>
			pipe(
				MARKET_SYMBOLS,
				RArray.map(getHistoryFn(time)),
				TaskEither.sequenceArray
			)
		);

// TODO wrap all this in useMemo based on timeValue
export const useMarketData = () => {
	const timeValue = useSelector(timeValueSelector);

	pipe(
		checkMarketStatus(timeValue),
		TaskEither.bindTo('marketStatus'),
		TaskEither.bind('history', ({ marketStatus }) =>
			getHistory(marketStatus, timeValue)
		)
	);
};
