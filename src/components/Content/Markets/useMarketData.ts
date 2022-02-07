import { useSelector } from 'react-redux';
import { timeValueSelector } from '../../../store/time/selectors';
import { MarketTime } from '../../../types/MarketTime';
import { match, when } from 'ts-pattern';
import * as tradierService from '../../../services/TradierService';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import { MarketStatus } from '../../../types/MarketStatus';
import {
	OptionT,
	PredicateT,
	TaskTryT
} from '@craigmiller160/ts-functions/es/types';
import { HistoryRecord } from '../../../types/history';
import { pipe } from 'fp-ts/es6/function';
import { MARKET_INFO, MARKET_SYMBOLS } from './MarketInfo';
import * as RArray from 'fp-ts/es6/ReadonlyArray';
import * as Option from 'fp-ts/es6/Option';
import { Quote } from '../../../types/quote';
import { MarketData } from '../../../types/MarketData';

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

interface DataLoadedResult {
	readonly marketStatus: MarketStatus;
	readonly quotes: ReadonlyArray<Quote>;
	readonly history: ReadonlyArray<ReadonlyArray<HistoryRecord>>;
}

export interface GlobalMarketData {
	readonly marketStatus: MarketStatus;
	readonly usMarketData: ReadonlyArray<MarketData>;
	readonly intMarketData: ReadonlyArray<MarketData>;
}

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
		.otherwise(() => tradierService.getQuotes(MARKET_SYMBOLS));

const handleMarketData = (data: DataLoadedResult): GlobalMarketData => {
	const { left: usa, right: international } = pipe(
		MARKET_SYMBOLS,
		RArray.mapWithIndex(
			(index, symbol): MarketData => ({
				symbol,
				name: MARKET_INFO[index].name,
				currentPrice: 0, // TODO fix this
				isInternational: MARKET_INFO[index].isInternational,
				history: [] // TODO fix this
			})
		),
		RArray.partition((_): boolean => _.isInternational)
	);
	return {
		marketStatus: data.marketStatus,
		usMarketData: usa,
		intMarketData: international
	};
};

// TODO make this whole thing into a service instead, pass timeValue in as an argument
export const useMarketData = () => {
	const timeValue = useSelector(timeValueSelector);

	pipe(
		checkMarketStatus(timeValue),
		TaskEither.bindTo('marketStatus'),
		TaskEither.bind('history', ({ marketStatus }) =>
			getHistory(marketStatus, timeValue)
		),
		TaskEither.bind('quotes', ({ marketStatus, history }) =>
			getQuotes(marketStatus, history)
		),
		TaskEither.map(handleMarketData)
	);
};
