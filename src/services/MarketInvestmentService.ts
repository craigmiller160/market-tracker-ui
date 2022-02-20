import { MarketTime } from '../types/MarketTime';
import {
	OptionT,
	PredicateT,
	TaskT,
	TaskTryT
} from '@craigmiller160/ts-functions/es/types';
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
import { MarketInvestmentInfo } from '../types/data/MarketInvestmentInfo';
import { pipe } from 'fp-ts/es6/function';
import * as RArray from 'fp-ts/es6/ReadonlyArray';
import * as Option from 'fp-ts/es6/Option';
import { Quote } from '../types/quote';

type HistoryFn = (s: string) => TaskTryT<ReadonlyArray<HistoryRecord>>;
type QuoteFn = (s: string) => TaskTryT<OptionT<Quote>>;

export interface InvestmentData {
	readonly currentPrice: number;
	readonly history: ReadonlyArray<HistoryRecord>;
}

interface IntermediateInvestmentData {
	readonly history: ReadonlyArray<HistoryRecord>;
	readonly quote: OptionT<Quote>;
}

const getQuoteFn = (type: MarketInvestmentType): QuoteFn =>
	match(type)
		.with(
			when(isStock),
			() => (symbol: string) =>
				pipe(
					tradierService.getQuotes([symbol]),
					TaskEither.map(RArray.head)
				)
		)
		.otherwise(
			() => (symbol: string) =>
				pipe(
					coinGeckoService.getQuotes([symbol]),
					TaskEither.map(RArray.head)
				)
		);

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
): TaskT<MarketStatus> => {
	const statusTE = match(timeValue)
		.with(MarketTime.ONE_DAY, () => tradierService.getMarketStatus())
		.otherwise(() => TaskEither.right(MarketStatus.OPEN));

	return pipe(
		statusTE,
		TaskEither.fold(
			() => async () => MarketStatus.UNKNOWN,
			(status) => async () => status
		)
	);
};

const isLaterThanNow: PredicateT<OptionT<HistoryRecord>> = (mostRecentRecord) =>
	Option.fold(
		() => false,
		(_: HistoryRecord) => _.unixTimestampMillis > new Date().getTime()
	)(mostRecentRecord);

const getMostRecentHistoryRecord = (
	history: ReadonlyArray<HistoryRecord>
): OptionT<HistoryRecord> => RArray.last(history);

const historyRecordToQuote =
	(symbol: string) =>
	(record: HistoryRecord): Quote => ({
		symbol,
		price: record.price
	});

const getQuote = (
	info: MarketInvestmentInfo,
	history: ReadonlyArray<HistoryRecord>
): TaskTryT<OptionT<Quote>> =>
	match({
		type: info.type,
		mostRecentHistoryRecord: getMostRecentHistoryRecord(history)
	})
		.with(
			{
				type: when(isStock),
				mostRecentHistoryRecord: when(isLaterThanNow)
			},
			({ mostRecentHistoryRecord }) =>
				pipe(
					mostRecentHistoryRecord,
					Option.map(historyRecordToQuote(info.symbol)),
					TaskEither.right
				)
		)
		.otherwise(({ type }) => getQuoteFn(type)(info.symbol));

const handleInvestmentData = ({
	history,
	quote
}: IntermediateInvestmentData): InvestmentData => {
	const currentPrice = pipe(
		quote,
		Option.fold(
			() => 0,
			(q) => q.price
		)
	);
	return {
		currentPrice,
		history
	};
};

export const getInvestmentData = (
	time: MarketTime,
	info: MarketInvestmentInfo
): TaskTryT<InvestmentData> =>
	pipe(
		getHistoryFn(time, info.type)(info.symbol),
		TaskEither.bindTo('history'),
		TaskEither.bind('quote', ({ history }) => getQuote(info, history)),
		TaskEither.map(handleInvestmentData)
	);
