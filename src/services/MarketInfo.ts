import * as RArray from 'fp-ts/es6/ReadonlyArray';
import { pipe } from 'fp-ts/es6/function';

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
	readonly type: string;
}

export const INVESTMENT_INFO: ReadonlyArray<InvestmentInfo> = [
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

// TODO probably delete this
export const INVESTMENT_SYMBOLS = pipe(
	INVESTMENT_INFO,
	RArray.map((_) => _.symbol)
);
