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
import { identity, pipe } from 'fp-ts/es6/function';
import * as RArray from 'fp-ts/es6/ReadonlyArray';
import * as Option from 'fp-ts/es6/Option';
import { Quote } from '../types/quote';
import * as Time from '@craigmiller160/ts-functions/es/Time';

const TIME_FORMAT = 'HH:mm:ss';
const parseTime = Time.parse(TIME_FORMAT);
const formatTime = Time.format(TIME_FORMAT);
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
	readonly quote: OptionT<Quote>;
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

const historyRecordToQuote =
	(symbol: string) =>
	(record: HistoryRecord): Quote => ({
		symbol,
		price: record.price,
		previousClose: 0
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
		.otherwise(({ type }) =>
			pipe(getQuoteFn(type)([info.symbol]), TaskEither.map(RArray.head))
		);

const getCurrentPrice: (quote: OptionT<Quote>) => number = Option.fold(
	() => 0,
	(_) => _.price
);

const greaterThan0: PredicateT<number> = (_) => _ > 0;

// TODO make sure the different permutations here are tested
const getStartPrice = (
	quote: OptionT<Quote>,
	history: ReadonlyArray<HistoryRecord>
): number =>
	pipe(
		quote,
		Option.chain((q) =>
			match(q)
				.with(
					{ previousClose: when(greaterThan0) },
					({ previousClose }) => Option.some(previousClose)
				)
				.otherwise(() => Option.none)
		),
		Option.fold(
			() =>
				pipe(
					RArray.head(history),
					Option.map((_) => _.price),
					Option.getOrElse(() => 0)
				),
			identity
		)
	);

const getFirstHistoryRecordDateTime = (
	history: ReadonlyArray<HistoryRecord>
): { date: string; time: string } =>
	pipe(
		RArray.head(history),
		Option.map((record) => ({
			date: record.date,
			time: pipe(parseTime(record.time), subtractOneHour, formatTime)
		})),
		Option.getOrElse(() => ({
			date: formatDate(new Date()),
			time: formatTime(new Date())
		}))
	);

const handleInvestmentData = ({
	history,
	quote
}: IntermediateInvestmentData): InvestmentData => {
	const currentPrice = getCurrentPrice(quote);
	const startPrice = getStartPrice(quote, history);
	// TODO this is probably the source of the 0 bug on historical items
	// TODO only want to do this extra starting record for today entries
	const { date, time } = getFirstHistoryRecordDateTime(history);

	const newHistory: ReadonlyArray<HistoryRecord> = RArray.prepend({
		date,
		unixTimestampMillis: 0,
		time,
		price: startPrice
	})(history);
	return {
		startPrice,
		currentPrice,
		history: newHistory
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
