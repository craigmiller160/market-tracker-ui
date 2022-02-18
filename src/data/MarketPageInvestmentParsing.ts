import marketDataJson from './marketsPageInvestments.json';
import {
	MarketInvestmentInfo,
	MarketInvestmentInfoArray,
	marketInvestmentInfoArrayV,
	MarketInvestmentType
} from '../types/data/MarketInvestmentInfo';
import { pipe } from 'fp-ts/es6/function';
import { handleValidationResult } from '../errors/TypeValidationError';
import { MonoidT } from '@craigmiller160/ts-functions/es/types';
import * as Monoid from 'fp-ts/es6/Monoid';
import * as RArray from 'fp-ts/es6/ReadonlyArray';

type InvestmentsByType = {
	[key in MarketInvestmentType]: MarketInvestmentInfoArray;
};

export const getMarketInvestmentInfo = () => {
	const result = pipe(
		marketInvestmentInfoArrayV.decode(marketDataJson),
		handleValidationResult
	);
};

const groupByTypeMonoid: MonoidT<InvestmentsByType> = {
	empty: {
		[MarketInvestmentType.USA_ETF]: [],
		[MarketInvestmentType.INTERNATIONAL_ETF]: [],
		[MarketInvestmentType.CRYPTO]: []
	},
	concat: (invest1, invest2) => ({
		[MarketInvestmentType.USA_ETF]: invest1[
			MarketInvestmentType.USA_ETF
		].concat(invest2[MarketInvestmentType.USA_ETF]),
		[MarketInvestmentType.INTERNATIONAL_ETF]: invest1[
			MarketInvestmentType.INTERNATIONAL_ETF
		].concat(invest2[MarketInvestmentType.INTERNATIONAL_ETF]),
		[MarketInvestmentType.CRYPTO]: invest1[
			MarketInvestmentType.CRYPTO
		].concat(invest2[MarketInvestmentType.CRYPTO])
	})
};

const infoToInvestmentByType = (
	info: MarketInvestmentInfo
): InvestmentsByType => {
	// TODO finish this
	throw new Error();
};

const groupInvestmentsByType = (
	infoArray: MarketInvestmentInfoArray
): InvestmentsByType => {
	const result = pipe(
		infoArray,
		RArray.map(infoToInvestmentByType),
		Monoid.concatAll(groupByTypeMonoid)
	);
};
