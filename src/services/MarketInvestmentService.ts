import { MarketTime } from '../types/MarketTime';
import {
	OptionT,
	PredicateT,
	TaskT,
	TaskTryT,
	TryT
} from '@craigmiller160/ts-functions/es/types';
import { MarketStatus } from '../types/MarketStatus';
import { match, when } from 'ts-pattern';
import * as tradierService from './TradierService';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import * as coinGeckoService from './CoinGeckoService';
import {
	isCrypto,
	isStock,
	MarketInvestmentType
} from '../types/data/MarketInvestmentType';
import { HistoryRecord } from '../types/history';
import { MarketInvestmentInfo } from '../types/data/MarketInvestmentInfo';
import { pipe } from 'fp-ts/es6/function';
import * as RArray from 'fp-ts/es6/ReadonlyArray';
import * as Option from 'fp-ts/es6/Option';
import { Quote } from '../types/quote';
import * as Time from '@craigmiller160/ts-functions/es/Time';
import * as Either from 'fp-ts/es6/Either';

const DATE_TIME_FORMAT = 'yyyy-MM-dd HH:mm:ss';
const parseDateTime = Time.parse(DATE_TIME_FORMAT);
const formatTime = Time.format('HH:mm:ss');
const subtractOneHour = Time.subHours(1);
const formatDate = Time.format('yyyy-MM-dd');

type HistoryFn = (s: string) => TaskTryT<ReadonlyArray<HistoryRecord>>;
type QuoteFn = (s: ReadonlyArray<string>) => TaskTryT<ReadonlyArray<Quote>>;

export interface InvestmentData {
	readonly startPrice: number;
	readonly currentPrice: number;
	readonly history: ReadonlyArray<HistoryRecord>;
}

interface IntermediateInvestmentData {
	readonly history: ReadonlyArray<HistoryRecord>;
	readonly quote: Quote;
}

export const getQuoteFn = (type: MarketInvestmentType): QuoteFn =>
	match(type)
		.with(when(isStock), () => tradierService.getQuotes)
		.otherwise(() => coinGeckoService.getQuotes);

export const getHistoryFn = (
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

const getQuote = (info: MarketInvestmentInfo): TaskTryT<Quote> =>
	pipe(
		getQuoteFn(info.type)([info.symbol]),
		TaskEither.map(RArray.head),
		TaskEither.chain(
			Option.fold(
				() =>
					TaskEither.left(
						new Error(`No quote found for symbol: ${info.symbol}`)
					),
				TaskEither.right
			)
		)
	);

const getFirstHistoryRecordDate = (
	history: ReadonlyArray<HistoryRecord>
): TryT<Date> =>
	pipe(
		RArray.head(history),
		Option.map((record) =>
			pipe(
				parseDateTime(`${record.date} ${record.time}`),
				subtractOneHour
			)
		),
		Either.fromOption(
			() => new Error('Unable to get first history record for date')
		)
	);

const hasPrevClose: PredicateT<Quote> = (quote) => quote.previousClose > 0;

const getStartPrice = (
	time: MarketTime,
	quote: Quote,
	history: ReadonlyArray<HistoryRecord>
): TryT<number> =>
	match({ time, quote, history })
		.with({ time: MarketTime.ONE_DAY, quote: when(hasPrevClose) }, () =>
			Either.right(quote.previousClose)
		)
		.otherwise(() =>
			pipe(
				RArray.head(history),
				Option.map((_) => _.price),
				Either.fromOption(
					() => new Error('Unable to get start price from history')
				)
			)
		);

const notEqualToHistoryStartPrice =
	(historyStartPrice: number): PredicateT<number> =>
	(startPrice) =>
		startPrice !== historyStartPrice;

const updateHistory = (
	time: MarketTime,
	startPrice: number,
	history: ReadonlyArray<HistoryRecord>
): TryT<ReadonlyArray<HistoryRecord>> => {
	const historyStartPrice = pipe(
		RArray.head(history),
		Option.map((_) => _.price),
		Option.getOrElse(() => -1)
	);
	return match({ time, startPrice })
		.with(
			{
				time: MarketTime.ONE_DAY,
				startPrice: when(notEqualToHistoryStartPrice(historyStartPrice))
			},
			() =>
				pipe(
					getFirstHistoryRecordDate(history),
					Either.map((date) =>
						RArray.prepend({
							date: formatDate(date),
							unixTimestampMillis: date.getTime(),
							time: formatTime(date),
							price: startPrice
						})(history)
					)
				)
		)
		.otherwise(() => Either.right(history));
};

const getCurrentPrice = (
	info: MarketInvestmentInfo,
	time: MarketTime,
	quote: Quote,
	history: ReadonlyArray<HistoryRecord>
): number =>
	match({
		type: info.type,
		time,
		mostRecentHistoryRecord: getMostRecentHistoryRecord(history)
	})
		.with(
			{
				type: when(isStock),
				time: MarketTime.ONE_DAY,
				mostRecentHistoryRecord: when(isLaterThanNow)
			},
			({ mostRecentHistoryRecord }) =>
				pipe(
					mostRecentHistoryRecord,
					Option.map((_) => _.price),
					Option.getOrElse(() => quote.price)
				)
		)
		.otherwise(() => quote.price);

const handleInvestmentData =
	(time: MarketTime, info: MarketInvestmentInfo) =>
	({ history, quote }: IntermediateInvestmentData): TryT<InvestmentData> => {
		const currentPrice = getCurrentPrice(info, time, quote, history);
		return pipe(
			getStartPrice(time, quote, history),
			Either.bindTo('startPrice'),
			Either.bind('newHistory', ({ startPrice }) =>
				updateHistory(time, startPrice, history)
			),
			Either.map(
				({ startPrice, newHistory }): InvestmentData => ({
					startPrice,
					currentPrice,
					history: newHistory
				})
			)
		);
	};

export const getInvestmentData = (
	time: MarketTime,
	info: MarketInvestmentInfo
): TaskTryT<InvestmentData> =>
	pipe(
		getHistoryFn(time, info.type)(info.symbol),
		TaskEither.bindTo('history'),
		TaskEither.bind('quote', () => getQuote(info)),
		TaskEither.chainEitherK(handleInvestmentData(time, info))
	);
