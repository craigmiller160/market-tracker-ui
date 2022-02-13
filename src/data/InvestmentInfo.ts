import * as RArray from 'fp-ts/es6/ReadonlyArray';
import { pipe } from 'fp-ts/es6/function';
import { match, when } from 'ts-pattern';
import {
	PredicateT,
	ReadonlyNonEmptyArrayT
} from '@craigmiller160/ts-functions/es/types';
import * as Option from 'fp-ts/es6/Option';
import { Quote } from '../types/quote';
import { HistoryRecord } from '../types/history';
import * as RNonEmptyArray from 'fp-ts/es6/ReadonlyNonEmptyArray';

// TODO make this an enum
export const INVESTMENT_USA = 'usa';
export const INVESTMENT_INTERNATIONAL = 'international';
export const INVESTMENT_CRYPTO = 'crypto';
export type InvestmentType =
	| typeof INVESTMENT_USA
	| typeof INVESTMENT_INTERNATIONAL
	| typeof INVESTMENT_CRYPTO;

export interface InvestmentInfo {
	readonly symbol: string;
	readonly name: string;
	readonly type: InvestmentType;
}

export const INVESTMENT_INFO: ReadonlyNonEmptyArrayT<InvestmentInfo> = [
	{
		symbol: 'VTI',
		name: 'US Total Market',
		type: 'usa'
	},
	{
		symbol: 'VOO',
		name: 'S&P 500',
		type: 'usa'
	},
	{
		symbol: 'DIA',
		name: 'Dow Jones',
		type: 'usa'
	},
	{
		symbol: 'QQQ',
		name: 'NASDAQ',
		type: 'usa'
	},
	{
		symbol: 'EWU',
		name: 'United Kingdom',
		type: 'international'
	},
	{
		symbol: 'SPEU',
		name: 'Europe',
		type: 'international'
	},
	{
		symbol: 'EWJ',
		name: 'Japan',
		type: 'international'
	},
	{
		symbol: 'MCHI',
		name: 'China',
		type: 'international'
	},
	{
		symbol: 'BTC',
		name: 'Bitcoin',
		type: 'crypto'
	},
	{
		symbol: 'ETH',
		name: 'Ethereum',
		type: 'crypto'
	}
];

export const isCrypto: PredicateT<InvestmentType> = (type) =>
	type === INVESTMENT_CRYPTO;

export const isStock: PredicateT<InvestmentType> = (type) =>
	type === INVESTMENT_USA || type === INVESTMENT_INTERNATIONAL;

export const INVESTMENT_SYMBOLS: ReadonlyNonEmptyArrayT<string> = pipe(
	INVESTMENT_INFO,
	RNonEmptyArray.map((info) => info.symbol)
);

export const STOCK_INVESTMENT_SYMBOLS: ReadonlyArray<string> = pipe(
	INVESTMENT_INFO,
	RArray.filterMap((info) =>
		match(info)
			.with({ type: when(isStock) }, () => Option.some(info.symbol))
			.otherwise(() => Option.none)
	)
);

export const CRYPTO_INVESTMENT_SYMB0LS: ReadonlyArray<string> = pipe(
	INVESTMENT_INFO,
	RArray.filterMap((info) =>
		match(info)
			.with({ type: when(isCrypto) }, () => Option.some(info.symbol))
			.otherwise(() => Option.none)
	)
);

export const STOCK_INVESTMENT_INFO: ReadonlyArray<InvestmentInfo> = pipe(
	INVESTMENT_INFO,
	RArray.filter((info) => isStock(info.type))
);

export const CRYPTO_INVESTMENT_INFO: ReadonlyArray<InvestmentInfo> = pipe(
	INVESTMENT_INFO,
	RArray.filter((info) => isCrypto(info.type))
);

export const STOCK_PLACEHOLDER_QUOTES: ReadonlyArray<Quote> = pipe(
	STOCK_INVESTMENT_INFO,
	RArray.map(() => ({
		symbol: '',
		price: 0
	}))
);

export const STOCK_PLACEHOLDER_HISTORY: ReadonlyArray<
	ReadonlyArray<HistoryRecord>
> = pipe(
	STOCK_INVESTMENT_INFO,
	RArray.map(() => [])
);
