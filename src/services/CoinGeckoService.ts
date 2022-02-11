import { TaskTryT, TryT } from '@craigmiller160/ts-functions/es/types';
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

export type HistoryInterval = 'minutely' | 'hourly' | 'daily';

export interface HistoryQuery {
	readonly symbol: string;
	readonly days: HistoryInterval;
	readonly interval: string;
}

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
): TaskTryT<ReadonlyArray<Quote>> =>
	pipe(
		ajaxApi.get<CoinGeckoPrice>({
			uri: `/coingecko/simple/price?ids=${symbols.join(
				','
			)}&vs_currencies=usd`
		}),
		TaskEither.map(getResponseData),
		TaskEither.chainEitherK(formatPrice(symbols))
	);

const getHistoryQuote = (
	historyQuery: HistoryQuery
): TaskTryT<ReadonlyArray<HistoryRecord>> => {
	pipe(
		ajaxApi.get<CoinGeckoMarketChart>({
			uri: `/coingecko/coins/${historyQuery.symbol}/market_chart?vs_currency=usd&days=${historyQuery.days}&interval=${historyQuery.interval}`
		})
	);
};
