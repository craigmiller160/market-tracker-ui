import * as ioType from 'io-ts';
import { match } from 'ts-pattern';
import { PredicateT } from '@craigmiller160/ts-functions/es/types';

export enum MarketInvestmentType {
	USA_ETF = 'USA_ETF',
	INTERNATIONAL_ETF = 'INTERNATIONAL_ETF',
	CRYPTO = 'CRYPTO'
}

export const marketInvestmentTypeV = ioType.keyof({
	[MarketInvestmentType.USA_ETF]: null,
	[MarketInvestmentType.INTERNATIONAL_ETF]: null,
	[MarketInvestmentType.CRYPTO]: null
});

export const getMarketInvestmentTypeTitle = (
	type: MarketInvestmentType
): string =>
	match(type)
		.with(MarketInvestmentType.USA_ETF, () => 'US Markets')
		.with(
			MarketInvestmentType.INTERNATIONAL_ETF,
			() => 'International Markets'
		)
		.with(MarketInvestmentType.CRYPTO, () => 'Cryptocurrency')
		.run();

export const isStock: PredicateT<MarketInvestmentType> = (type) =>
	[
		MarketInvestmentType.USA_ETF,
		MarketInvestmentType.INTERNATIONAL_ETF
	].includes(type);

export const isCrypto: PredicateT<MarketInvestmentType> = (type) =>
	MarketInvestmentType.CRYPTO === type;
