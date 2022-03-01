import { MonoidT, TaskTryT, TryT } from '@craigmiller160/ts-functions/es/types';
import { Quote } from '../types/quote';
import { flow, pipe } from 'fp-ts/es6/function';
import { ajaxApi, getResponseData } from './AjaxApi';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import { CoinGeckoPrice, coinGeckoPriceV } from '../types/coingecko/price';
import * as RArray from 'fp-ts/es6/ReadonlyArray';
import * as Option from 'fp-ts/es6/Option';
import * as Either from 'fp-ts/es6/Either';
import { HistoryRecord } from '../types/history';
import {
	CoinGeckoMarketChart,
	coinGeckoMarketChartV
} from '../types/coingecko/marketchart';
import * as Time from '@craigmiller160/ts-functions/es/Time';
import { match } from 'ts-pattern';
import * as Monoid from 'fp-ts/es6/Monoid';
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

const formatPrice =
	(ids: ReadonlyArray<string>) =>
	(price: CoinGeckoPrice): TryT<ReadonlyArray<Quote>> =>
		pipe(
			ids,
			RArray.map((id) =>
				pipe(
					Option.fromNullable(price[id as keyof CoinGeckoPrice]),
					Option.map((price) => ({
						symbol: getSymbolForAltId(id),
						price: price.usd,
						previousClose: 0
					}))
				)
			),
			Option.sequenceArray,
			Either.fromOption(
				() =>
					new Error(
						`Unable to find all symbols in quote response. ${ids}`
					)
			)
		);

export const getQuotes = (
	symbols: ReadonlyArray<string>
): TaskTryT<ReadonlyArray<Quote>> => {
	const ids = pipe(symbols, RArray.map(getAltIdForSymbol));
	const idString = pipe(ids, Monoid.concatAll(quoteSymbolMonoid));

	return pipe(
		ajaxApi.get<CoinGeckoPrice>({
			uri: `/coingecko/simple/price?ids=${idString}&vs_currencies=usd`
		}),
		TaskEither.map(getResponseData),
		TaskEither.chainEitherK(decodePrice),
		TaskEither.chainEitherK(formatPrice(ids))
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
	const id = getAltIdForSymbol(historyQuery.symbol);
	const start = Math.floor(historyQuery.start.getTime() / 1000);
	const end = Math.floor(getTodayEnd().getTime() / 1000);
	return pipe(
		ajaxApi.get<CoinGeckoMarketChart>({
			uri: `/coingecko/coins/${id}/market_chart/range?vs_currency=usd&from=${start}&to=${end}`
		}),
		TaskEither.map(getResponseData),
		TaskEither.chainEitherK(decodeMarketChart),
		TaskEither.map(formatMarketChart)
	);
};

export const getTodayHistory = (
	symbol: string
): TaskTryT<ReadonlyArray<HistoryRecord>> =>
	getHistoryQuote({
		symbol,
		start: getTodayStart()
	});

export const getDays = (historyDate: string): number =>
	pipe(
		historyDate,
		Time.parse(HISTORY_DATE_FORMAT),
		Time.differenceInDays(new Date())
	);

export const getOneWeekHistory = (
	symbol: string
): TaskTryT<ReadonlyArray<HistoryRecord>> =>
	getHistoryQuote({
		symbol,
		start: getOneWeekStartDate()
	});

export const getOneMonthHistory = (
	symbol: string
): TaskTryT<ReadonlyArray<HistoryRecord>> => {
	return getHistoryQuote({
		symbol,
		start: getOneMonthStartDate()
	});
};

export const getThreeMonthHistory = (
	symbol: string
): TaskTryT<ReadonlyArray<HistoryRecord>> =>
	getHistoryQuote({
		symbol,
		start: getThreeMonthStartDate()
	});

export const getOneYearHistory = (
	symbol: string
): TaskTryT<ReadonlyArray<HistoryRecord>> =>
	getHistoryQuote({
		symbol,
		start: getOneYearStartDate()
	});

export const getFiveYearHistory = (
	symbol: string
): TaskTryT<ReadonlyArray<HistoryRecord>> =>
	getHistoryQuote({
		symbol,
		start: getFiveYearStartDate()
	});
