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

// TODO probably delete a LOT of this

export enum InvestmentType {
	USA_ETF = 'USA_ETF',
	INTERNATIONAL_ETF = 'INTERNATIONAL_ETF',
	CRYPTO = 'CRYPTO'
}

export interface InvestmentInfo {
	readonly symbol: string;
	readonly name: string;
	readonly type: InvestmentType;
}

export const INVESTMENT_INFO: ReadonlyNonEmptyArrayT<InvestmentInfo> = [
	{
		symbol: 'VTI',
		name: 'US Total Market',
		type: InvestmentType.USA_ETF
	},
	{
		symbol: 'VOO',
		name: 'S&P 500',
		type: InvestmentType.USA_ETF
	},
	{
		symbol: 'DIA',
		name: 'Dow Jones',
		type: InvestmentType.USA_ETF
	},
	{
		symbol: 'QQQ',
		name: 'NASDAQ',
		type: InvestmentType.USA_ETF
	},
	{
		symbol: 'EWU',
		name: 'United Kingdom',
		type: InvestmentType.INTERNATIONAL_ETF
	},
	{
		symbol: 'SPEU',
		name: 'Europe',
		type: InvestmentType.INTERNATIONAL_ETF
	},
	{
		symbol: 'EWJ',
		name: 'Japan',
		type: InvestmentType.INTERNATIONAL_ETF
	},
	{
		symbol: 'MCHI',
		name: 'China',
		type: InvestmentType.INTERNATIONAL_ETF
	},
	{
		symbol: 'BTC',
		name: 'Bitcoin',
		type: InvestmentType.CRYPTO
	},
	{
		symbol: 'ETH',
		name: 'Ethereum',
		type: InvestmentType.CRYPTO
	}
];

export const isCrypto: PredicateT<InvestmentType> = (type) =>
	type === InvestmentType.CRYPTO;

export const isStock: PredicateT<InvestmentType> = (type) =>
	type === InvestmentType.USA_ETF ||
	type === InvestmentType.INTERNATIONAL_ETF;

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
