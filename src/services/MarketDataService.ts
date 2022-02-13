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
	CRYPTO_INVESTMENT_INFO,
	CRYPTO_INVESTMENT_SYMB0LS,
	INVESTMENT_CRYPTO,
	INVESTMENT_INFO,
	INVESTMENT_INTERNATIONAL,
	INVESTMENT_USA,
	InvestmentInfo,
	InvestmentType,
	isCrypto,
	isStock,
	STOCK_INVESTMENT_SYMBOLS,
	STOCK_PLACEHOLDER_HISTORY,
	STOCK_PLACEHOLDER_QUOTES
} from './InvestmentInfo';
import * as RArray from 'fp-ts/es6/ReadonlyArray';
import * as Option from 'fp-ts/es6/Option';
import { Quote } from '../types/quote';
import { MarketData } from '../types/MarketData';
import { MarketDataGroup } from '../types/MarketDataGroup';
import * as RNonEmptyArray from 'fp-ts/es6/ReadonlyNonEmptyArray';

export type GlobalMarketData = [
	usa: MarketDataGroup,
	international: MarketDataGroup,
	crypto: MarketDataGroup
];

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

const getInvestmentHistory = (
	time: MarketTime,
	investments: ReadonlyArray<InvestmentInfo>
): TaskTryT<ReadonlyArray<ReadonlyArray<HistoryRecord>>> =>
	pipe(
		investments,
		RArray.map((_) => getHistoryFn(time, _.type)(_.symbol)),
		TaskEither.sequenceArray
	);

const addStockPlaceholderHistory = (
	cryptoHistory: TaskTryT<ReadonlyArray<ReadonlyArray<HistoryRecord>>>
): TaskTryT<ReadonlyArray<ReadonlyArray<HistoryRecord>>> =>
	pipe(
		cryptoHistory,
		TaskEither.map((history) => [...STOCK_PLACEHOLDER_HISTORY, ...history])
	);

const getHistory = (
	status: MarketStatus,
	time: MarketTime
): TaskTryT<ReadonlyArray<ReadonlyArray<HistoryRecord>>> =>
	match(status)
		.with(MarketStatus.CLOSED, () =>
			addStockPlaceholderHistory(
				getInvestmentHistory(time, CRYPTO_INVESTMENT_INFO)
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

const addStockPlaceholderQuotes = (
	cryptoQuotes: TaskTryT<ReadonlyArray<Quote>>
): TaskTryT<ReadonlyArray<Quote>> =>
	pipe(
		cryptoQuotes,
		TaskEither.map((quotes) => [...STOCK_PLACEHOLDER_QUOTES, ...quotes])
	);

const getQuotes = (
	status: MarketStatus,
	history: ReadonlyArray<ReadonlyArray<HistoryRecord>>
): TaskTryT<ReadonlyArray<Quote>> =>
	match({
		status,
		mostRecentHistoryRecord: getMostRecentHistoryRecord(history)
	})
		.with({ status: MarketStatus.CLOSED }, () =>
			addStockPlaceholderQuotes(
				coinGeckoService.getQuotes(CRYPTO_INVESTMENT_SYMB0LS)
			)
		)
		.with({ mostRecentHistoryRecord: when(isLaterThanNow) }, () =>
			addStockPlaceholderQuotes(
				coinGeckoService.getQuotes(CRYPTO_INVESTMENT_SYMB0LS)
			)
		)
		.otherwise(() =>
			pipe(
				[
					tradierService.getQuotes(STOCK_INVESTMENT_SYMBOLS),
					coinGeckoService.getQuotes(CRYPTO_INVESTMENT_SYMB0LS)
				],
				TaskEither.sequenceArray,
				TaskEither.map(RArray.flatten)
			)
		);

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
	const groupedMarketData = pipe(
		INVESTMENT_INFO,
		RArray.mapWithIndex(
			(index, info): MarketData => ({
				symbol: info.symbol,
				name: info.name,
				currentPrice: getMarketDataCurrentPrice(data, index), // TODO check this
				history: getMarketDataHistory(data, index), // TODO check this
				type: info.type
			})
		),
		RNonEmptyArray.groupBy((data) => data.type)
	);

	return [
		{
			time: data.time,
			marketStatus: data.marketStatus,
			data: groupedMarketData[INVESTMENT_USA],
			type: INVESTMENT_USA
		},
		{
			time: data.time,
			marketStatus: data.marketStatus,
			data: groupedMarketData[INVESTMENT_INTERNATIONAL],
			type: INVESTMENT_INTERNATIONAL
		},
		{
			time: data.time,
			marketStatus: data.marketStatus,
			data: groupedMarketData[INVESTMENT_CRYPTO],
			type: INVESTMENT_CRYPTO
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
