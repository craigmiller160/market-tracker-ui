import { type PredicateT } from '@craigmiller160/ts-functions/types';
import * as ioType from 'io-ts';

export enum InvestmentType {
	STOCK = 'STOCK',
	CRYPTO = 'CRYPTO',
	STOCK_TOTALS = 'STOCK_TOTALS'
}

export const investmentTypeV = ioType.keyof({
	[InvestmentType.STOCK]: null,
	[InvestmentType.CRYPTO]: null
});

export const isStock: PredicateT<InvestmentType> = (type) =>
	type === InvestmentType.STOCK;

export const isCrypto: PredicateT<InvestmentType> = (type) =>
	type === InvestmentType.CRYPTO;
