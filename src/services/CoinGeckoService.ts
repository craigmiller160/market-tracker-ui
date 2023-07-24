import { MonoidT, TryT } from '@craigmiller160/ts-functions/es/types';
import { Quote } from '../types/quote';
import { flow, pipe } from 'fp-ts/function';
import { marketTrackerApiFpTs, getResponseData } from './AjaxApi';
import * as TaskEither from 'fp-ts/TaskEither';
import { CoinGeckoPrice, coinGeckoPriceV } from '../types/coingecko/price';
import * as RArray from 'fp-ts/ReadonlyArray';
import * as Option from 'fp-ts/Option';
import * as Either from 'fp-ts/Either';
import { HistoryRecord } from '../types/history';
import {
	CoinGeckoMarketChart,
	coinGeckoMarketChartV
} from '../types/coingecko/marketchart';
import * as Time from '@craigmiller160/ts-functions/es/Time';
import { match } from 'ts-pattern';
import * as Monoid from 'fp-ts/Monoid';
import * as Pattern from '@craigmiller160/ts-functions/es/Pattern';
import {
	getFiveYearStartDate,
	getOneMonthStartDate,
	getOneWeekStartDate,
	getOneYearStartDate,
	getThreeMonthStartDate,
	getTodayEnd,
	getTodayStart,
	HISTORY_DATE_FORMAT
} from '../utils/timeUtils';
import * as TypeValidation from '@craigmiller160/ts-functions/es/TypeValidation';
import {
	getAltIdForSymbol,
	getSymbolForAltId
} from '../data/MarketPageInvestmentParsing';
import { taskEitherToPromise } from '../function/TaskEitherToPromise';

const decodePrice = TypeValidation.decode(coinGeckoPriceV);
const decodeMarketChart = TypeValidation.decode(coinGeckoMarketChartV);

const quoteSymbolMonoid: MonoidT<string> = {
	empty: '',
	concat: (s1, s2) =>
		match(s1)
			.with(Pattern.lengthGT(0), () => `${s1},${s2}`)
			.otherwise(() => s2)
};

export type HistoryInterval = 'minutely' | 'hourly' | 'daily';

export interface HistoryQuery {
	readonly symbol: string;
	readonly start: Date;
}

const getMarketChartDate: (millis: number) => string = flow(
	Time.fromMillis,
	Time.format('yyyy-MM-dd')
);

const getMarketChartTime: (millis: number) => string = flow(
	Time.fromMillis,
	Time.format('HH:mm:ss')
);

const getPrice = (id: string, price: CoinGeckoPrice): TryT<string> =>
	pipe(
		Option.fromNullable(price[id as keyof CoinGeckoPrice]),
		Option.map((_) => _.usd.toString()),
		Either.fromOption(() => new Error(`Unable to find price for ID: ${id}`))
	);

const formatPrice =
	(ids: ReadonlyArray<string>) =>
	(price: CoinGeckoPrice): TryT<ReadonlyArray<Quote>> =>
		pipe(
			ids,
			RArray.map((id) =>
				pipe(
					[getPrice(id, price), getSymbolForAltId(id)],
					Either.sequenceArray,
					Either.map(
						([price, symbol]): Quote => ({
							symbol,
							name: '',
							price: parseFloat(price),
							previousClose: 0
						})
					)
				)
			),
			Either.sequenceArray
		);

export const getQuotes = (
	symbols: ReadonlyArray<string>,
	signal?: AbortSignal
): Promise<ReadonlyArray<Quote>> =>
	pipe(
		symbols,
		RArray.map(getAltIdForSymbol),
		Either.sequenceArray,
		TaskEither.fromEither,
		TaskEither.bindTo('ids'),
		TaskEither.bind('idString', ({ ids }) =>
			TaskEither.right(Monoid.concatAll(quoteSymbolMonoid)(ids))
		),
		TaskEither.bind('response', ({ idString }) =>
			pipe(
				marketTrackerApiFpTs.get<CoinGeckoPrice>({
					uri: `/coingecko/simple/price?ids=${idString}&vs_currencies=usd`,
					config: {
						signal
					}
				}),
				TaskEither.map(getResponseData),
				TaskEither.chainEitherK(decodePrice)
			)
		),
		TaskEither.chainEitherK(({ ids, response }) =>
			formatPrice(ids)(response)
		),
		taskEitherToPromise
	);

const formatMarketChart = (
	chart: CoinGeckoMarketChart
): ReadonlyArray<HistoryRecord> =>
	pipe(
		chart.prices,
		RArray.map(
			([millis, price]): HistoryRecord => ({
				date: getMarketChartDate(millis),
				time: getMarketChartTime(millis),
				unixTimestampMillis: millis,
				price
			})
		)
	);

const getHistoryQuote = (
	historyQuery: HistoryQuery,
	signal?: AbortSignal
): Promise<ReadonlyArray<HistoryRecord>> => {
	const start = Math.floor(historyQuery.start.getTime() / 1000);
	const end = Math.floor(getTodayEnd().getTime() / 1000);
	return pipe(
		getAltIdForSymbol(historyQuery.symbol),
		TaskEither.fromEither,
		TaskEither.chain((id) =>
			marketTrackerApiFpTs.get<CoinGeckoMarketChart>({
				uri: `/coingecko/coins/${id}/market_chart/range?vs_currency=usd&from=${start}&to=${end}`,
				config: {
					signal
				}
			})
		),
		TaskEither.map(getResponseData),
		TaskEither.chainEitherK(decodeMarketChart),
		TaskEither.map(formatMarketChart),
		taskEitherToPromise
	);
};

export const getTodayHistory = (
	symbol: string,
	signal?: AbortSignal
): Promise<ReadonlyArray<HistoryRecord>> =>
	getHistoryQuote(
		{
			symbol,
			start: getTodayStart()
		},
		signal
	);

export const getDays = (historyDate: string): number =>
	pipe(
		historyDate,
		Time.parse(HISTORY_DATE_FORMAT),
		Time.differenceInDays(new Date())
	);

export const getOneWeekHistory = (
	symbol: string,
	signal?: AbortSignal
): Promise<ReadonlyArray<HistoryRecord>> =>
	getHistoryQuote(
		{
			symbol,
			start: getOneWeekStartDate()
		},
		signal
	);

export const getOneMonthHistory = (
	symbol: string,
	signal?: AbortSignal
): Promise<ReadonlyArray<HistoryRecord>> => {
	return getHistoryQuote(
		{
			symbol,
			start: getOneMonthStartDate()
		},
		signal
	);
};

export const getThreeMonthHistory = (
	symbol: string,
	signal?: AbortSignal
): Promise<ReadonlyArray<HistoryRecord>> =>
	getHistoryQuote(
		{
			symbol,
			start: getThreeMonthStartDate()
		},
		signal
	);

export const getOneYearHistory = (
	symbol: string,
	signal?: AbortSignal
): Promise<ReadonlyArray<HistoryRecord>> =>
	getHistoryQuote(
		{
			symbol,
			start: getOneYearStartDate()
		},
		signal
	);

export const getFiveYearHistory = (
	symbol: string,
	signal?: AbortSignal
): Promise<ReadonlyArray<HistoryRecord>> =>
	getHistoryQuote(
		{
			symbol,
			start: getFiveYearStartDate()
		},
		signal
	);
