import { MarketTime } from '../types/MarketTime';
import { match, when } from 'ts-pattern';
import * as tradierService from './TradierService';
import * as coinGeckoService from './CoinGeckoService';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import { MarketStatus } from '../types/MarketStatus';
import {
	OptionT,
	PredicateT,
	TaskTryT
} from '@craigmiller160/ts-functions/es/types';
import { HistoryRecord } from '../types/history';
import { pipe } from 'fp-ts/es6/function';
import {
	INVESTMENT_CRYPTO,
	INVESTMENT_INFO,
	INVESTMENT_INTERNATIONAL,
	INVESTMENT_SYMBOLS,
	INVESTMENT_USA,
	InvestmentInfo,
	InvestmentType
} from './MarketInfo';
import * as RArray from 'fp-ts/es6/ReadonlyArray';
import * as Option from 'fp-ts/es6/Option';
import { Quote } from '../types/quote';
import { MarketData } from '../types/MarketData';
import { MarketDataGroup } from '../types/MarketDataGroup';
import * as Either from 'fp-ts/es6/Either';

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

const getHistoryFn = (time: MarketTime, type: InvestmentType): HistoryFn =>
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

const isCrypto: PredicateT<InvestmentType> = (type) =>
	type === INVESTMENT_CRYPTO;

const isStock: PredicateT<InvestmentType> = (type) =>
	type === INVESTMENT_USA || type === INVESTMENT_INTERNATIONAL;

const getInvestmentHistory = (
	time: MarketTime,
	investments: ReadonlyArray<InvestmentInfo>
): TaskTryT<ReadonlyArray<ReadonlyArray<HistoryRecord>>> =>
	pipe(
		investments,
		RArray.map((_) => getHistoryFn(time, _.type)(_.symbol)),
		TaskEither.sequenceArray
	);

const getHistory = (
	status: MarketStatus,
	time: MarketTime
): TaskTryT<ReadonlyArray<ReadonlyArray<HistoryRecord>>> =>
	match(status)
		.with(MarketStatus.CLOSED, () =>
			getInvestmentHistory(
				time,
				RArray.filter((_) => isCrypto(_.type))(INVESTMENT_INFO)
			)
		)
		.otherwise(() => getInvestmentHistory(time, INVESTMENT_INFO));

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
): TaskTryT<ReadonlyArray<Quote>> => {
	// TODO prep this kind of stuff, along with padding the results for the crypto-only calls
	const { left: stockSymbols, right: cryptoSymbols } = pipe(
		INVESTMENT_INFO,
		RArray.partitionMap((info) =>
			match(info)
				.with({ type: when(isStock) }, () => Either.right(info.symbol))
				.otherwise(() => Either.left(info.symbol))
		)
	);

	return match({
		status,
		mostRecentHistoryRecord: getMostRecentHistoryRecord(history)
	})
		.with({ status: MarketStatus.CLOSED }, () =>
			coinGeckoService.getQuotes(cryptoSymbols)
		)
		.with({ mostRecentHistoryRecord: when(isLaterThanNow) }, () =>
			coinGeckoService.getQuotes(cryptoSymbols)
		)
		.otherwise(() =>
			pipe(
				[
					tradierService.getQuotes(stockSymbols),
					coinGeckoService.getQuotes(cryptoSymbols)
				],
				TaskEither.sequenceArray,
				TaskEither.map(RArray.flatten)
			)
		);
};

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
		INVESTMENT_SYMBOLS,
		RArray.mapWithIndex(
			(index, symbol): MarketData => ({
				symbol,
				name: INVESTMENT_INFO[index].name,
				currentPrice: getMarketDataCurrentPrice(data, index),
				isInternational: INVESTMENT_INFO[index].isInternational,
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
