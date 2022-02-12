import { MarketTime } from '../types/MarketTime';
import { match, when } from 'ts-pattern';
import * as tradierService from './TradierService';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import { MarketStatus } from '../types/MarketStatus';
import {
	OptionT,
	PredicateT,
	TaskTryT
} from '@craigmiller160/ts-functions/es/types';
import { HistoryRecord } from '../types/history';
import { pipe } from 'fp-ts/es6/function';
import { STOCK_INFO, STOCK_SYMBOLS } from './MarketInfo';
import * as RArray from 'fp-ts/es6/ReadonlyArray';
import * as Option from 'fp-ts/es6/Option';
import { Quote } from '../types/quote';
import { MarketData } from '../types/MarketData';
import { MarketDataGroup } from '../types/MarketDataGroup';

export type GlobalMarketData = [MarketDataGroup, MarketDataGroup];

interface DataLoadedResult {
	readonly time: MarketTime;
	readonly marketStatus: MarketStatus;
	readonly quotes: ReadonlyArray<Quote>;
	readonly history: ReadonlyArray<ReadonlyArray<HistoryRecord>>;
}

type HistoryFn = (s: string) => TaskTryT<ReadonlyArray<HistoryRecord>>;

const checkMarketStatus = (timeValue: MarketTime): TaskTryT<MarketStatus> =>
	match(timeValue)
		.with(MarketTime.ONE_DAY, () => tradierService.getMarketStatus())
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
				STOCK_SYMBOLS,
				RArray.map(getHistoryFn(time)),
				TaskEither.sequenceArray
			)
		);

const getMostRecentHistoryRecord = (
	history: ReadonlyArray<ReadonlyArray<HistoryRecord>>
): OptionT<HistoryRecord> =>
	pipe(RArray.head(history), Option.chain(RArray.last));

const isLaterThanNow: PredicateT<OptionT<HistoryRecord>> = (mostRecentRecord) =>
	Option.fold(
		() => false,
		(_: HistoryRecord) => _.unixTimestampMillis > new Date().getTime()
	)(mostRecentRecord);

const getQuotes = (
	status: MarketStatus,
	history: ReadonlyArray<ReadonlyArray<HistoryRecord>>
): TaskTryT<ReadonlyArray<Quote>> =>
	match({
		status,
		mostRecentHistoryRecord: getMostRecentHistoryRecord(history)
	})
		.with({ status: MarketStatus.CLOSED }, () => TaskEither.right([]))
		.with({ mostRecentHistoryRecord: when(isLaterThanNow) }, () =>
			TaskEither.right([])
		)
		.otherwise(() => tradierService.getQuotes(STOCK_SYMBOLS));

const getMarketDataHistory = (
	data: DataLoadedResult,
	index: number
): ReadonlyArray<HistoryRecord> =>
	pipe(
		data.history,
		RArray.lookup(index),
		Option.getOrElse((): ReadonlyArray<HistoryRecord> => [])
	);

const getMarketDataCurrentPrice = (
	data: DataLoadedResult,
	index: number
): number =>
	match(data)
		.with({ marketStatus: MarketStatus.CLOSED }, () => 0)
		.otherwise(({ quotes, history }) =>
			pipe(
				quotes,
				RArray.lookup(index),
				Option.map((_) => _.price),
				Option.getOrElse(() =>
					pipe(
						history,
						RArray.lookup(index),
						Option.chain(RArray.last),
						Option.map((_) => _.price),
						Option.getOrElse(() => 0)
					)
				)
			)
		);

const handleMarketData = (data: DataLoadedResult): GlobalMarketData => {
	const { left: usa, right: international } = pipe(
		STOCK_SYMBOLS,
		RArray.mapWithIndex(
			(index, symbol): MarketData => ({
				symbol,
				name: STOCK_INFO[index].name,
				currentPrice: getMarketDataCurrentPrice(data, index),
				isInternational: STOCK_INFO[index].isInternational,
				history: getMarketDataHistory(data, index)
			})
		),
		RArray.partition((_): boolean => _.isInternational)
	);
	return [
		{
			time: data.time,
			marketStatus: data.marketStatus,
			data: usa
		},
		{
			time: data.time,
			marketStatus: data.marketStatus,
			data: international
		}
	];
};

export const loadMarketData = (
	timeValue: MarketTime
): TaskTryT<GlobalMarketData> =>
	pipe(
		TaskEither.right(timeValue),
		TaskEither.bindTo('time'),
		TaskEither.bind('marketStatus', ({ time }) => checkMarketStatus(time)),
		TaskEither.bind('history', ({ marketStatus }) =>
			getHistory(marketStatus, timeValue)
		),
		TaskEither.bind('quotes', ({ marketStatus, history }) =>
			getQuotes(marketStatus, history)
		),
		TaskEither.map(handleMarketData)
	);
