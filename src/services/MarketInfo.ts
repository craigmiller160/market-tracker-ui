import * as RArray from 'fp-ts/es6/ReadonlyArray';
import { pipe } from 'fp-ts/es6/function';

export interface BaseInfo {
	readonly symbol: string;
	readonly name: string;
}

export interface StockInfo extends BaseInfo {
	readonly isInternational: boolean;
}

export interface CryptoInfo extends BaseInfo {
	readonly id: string;
}

export const STOCK_INFO: ReadonlyArray<StockInfo> = [
	{
		symbol: 'VTI',
		name: 'US Total Market',
		isInternational: false
	},
	{
		symbol: 'VOO',
		name: 'S&P 500',
		isInternational: false
	},
	{
		symbol: 'DIA',
		name: 'Dow Jones',
		isInternational: false
	},
	{
		symbol: 'QQQ',
		name: 'NASDAQ',
		isInternational: false
	},
	{
		symbol: 'EWU',
		name: 'United Kingdom',
		isInternational: true
	},
	{
		symbol: 'SPEU',
		name: 'Europe',
		isInternational: true
	},
	{
		symbol: 'EWJ',
		name: 'Japan',
		isInternational: true
	},
	{
		symbol: 'MCHI',
		name: 'China',
		isInternational: true
	}
];

export const STOCK_SYMBOLS = pipe(
	STOCK_INFO,
	RArray.map((_) => _.symbol)
);

export const CRYPTO_INFO: ReadonlyArray<CryptoInfo> = [
	{
		symbol: 'BTC',
		name: 'Bitcoin',
		id: 'bitcoin'
	},
	{
		symbol: 'ETH',
		name: 'Ethereum',
		id: 'ethereum'
	}
];
