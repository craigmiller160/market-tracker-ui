import * as RArray from 'fp-ts/es6/ReadonlyArray';
import { pipe } from 'fp-ts/es6/function';

export interface MarketInfo {
	readonly symbol: string;
	readonly name: string;
	readonly isInternational: boolean;
}

export const MARKET_INFO: ReadonlyArray<MarketInfo> = [
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
	// TODO VGX is not in Tradier, figure out what alternatives there are
	// {
	// 	symbol: 'VGX',
	// 	name: 'Europe',
	// 	isInternational: true
	// },
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

export const MARKET_SYMBOLS = pipe(
	MARKET_INFO,
	RArray.map((_) => _.symbol)
);
