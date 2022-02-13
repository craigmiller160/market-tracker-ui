import { TaskTryT, TryT, MonoidT } from '@craigmiller160/ts-functions/es/types';
import { Quote } from '../types/quote';
import { pipe } from 'fp-ts/es6/function';
import { ajaxApi, getResponseData } from './AjaxApi';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import { CoinGeckoPrice } from '../types/coingecko/price';
import * as RArray from 'fp-ts/es6/ReadonlyArray';
import * as Option from 'fp-ts/es6/Option';
import * as Either from 'fp-ts/es6/Either';
import { HistoryRecord } from '../types/history';
import { CoinGeckoMarketChart } from '../types/coingecko/marketchart';
import { flow } from 'fp-ts/es6/function';
import * as Time from '@craigmiller160/ts-functions/es/Time';
import { match } from 'ts-pattern';
import * as Monoid from 'fp-ts/es6/Monoid';
import * as Pattern from '@craigmiller160/ts-functions/es/Pattern';

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
	readonly days: number;
	readonly interval: HistoryInterval;
}

const getId = (symbol: string): string =>
	match(symbol.toLowerCase())
		.with('btc', () => 'bitcoin')
		.with('eth', () => 'ethereum')
		.run();

const getMarketChartDate: (millis: number) => string = flow(
	Time.fromMillis,
	Time.format('yyyy-MM-dd')
);

const getMarketChartTime: (millis: number) => string = flow(
	Time.fromMillis,
	Time.format('HH:mm:ss')
);

const formatPrice =
	(symbols: ReadonlyArray<string>) =>
	(price: CoinGeckoPrice): TryT<ReadonlyArray<Quote>> =>
		pipe(
			symbols,
			RArray.map((symbol) =>
				pipe(
					Option.fromNullable(price[symbol]),
					Option.map((price) => ({
						symbol,
						price: parseFloat(price.usd)
					}))
				)
			),
			Option.sequenceArray,
			Either.fromOption(
				() =>
					new Error(
						`Unable to find all symbols in quote response. ${symbols}`
					)
			)
		);

export const getQuotes = (
	symbols: ReadonlyArray<string>
): TaskTryT<ReadonlyArray<Quote>> => {
	const idString = pipe(
		symbols,
		RArray.map(getId),
		Monoid.concatAll(quoteSymbolMonoid)
	);

	return pipe(
		ajaxApi.get<CoinGeckoPrice>({
			uri: `/coingecko/simple/price?ids=${idString}&vs_currencies=usd`
		}),
		TaskEither.map(getResponseData),
		TaskEither.chainEitherK(formatPrice(symbols))
	);
};

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
	historyQuery: HistoryQuery
): TaskTryT<ReadonlyArray<HistoryRecord>> => {
	const id = getId(historyQuery.symbol);
	return pipe(
		ajaxApi.get<CoinGeckoMarketChart>({
			uri: `/coingecko/coins/${id}/market_chart?vs_currency=usd&days=${historyQuery.days}&interval=${historyQuery.interval}`
		}),
		TaskEither.map(getResponseData),
		TaskEither.map(formatMarketChart)
	);
};

export const getTodayHistory = (
	symbol: string
): TaskTryT<ReadonlyArray<HistoryRecord>> =>
	getHistoryQuote({
		symbol,
		days: 1,
		interval: 'minutely'
	});

export const getOneWeekHistory = (
	symbol: string
): TaskTryT<ReadonlyArray<HistoryRecord>> =>
	getHistoryQuote({
		symbol,
		days: 7,
		interval: 'daily'
	});

export const getOneMonthHistory = (
	symbol: string
): TaskTryT<ReadonlyArray<HistoryRecord>> =>
	getHistoryQuote({
		symbol,
		days: 30,
		interval: 'daily'
	});

export const getThreeMonthHistory = (
	symbol: string
): TaskTryT<ReadonlyArray<HistoryRecord>> =>
	getHistoryQuote({
		symbol,
		days: 90,
		interval: 'daily'
	});

export const getOneYearHistory = (
	symbol: string
): TaskTryT<ReadonlyArray<HistoryRecord>> =>
	getHistoryQuote({
		symbol,
		days: 365,
		interval: 'daily'
	});

export const getFiveYearHistory = (
	symbol: string
): TaskTryT<ReadonlyArray<HistoryRecord>> =>
	getHistoryQuote({
		symbol,
		days: 365 * 5,
		interval: 'daily'
	});
