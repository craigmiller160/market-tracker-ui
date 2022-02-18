import * as ioType from 'io-ts';

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

export const marketInvestmentInfoV = ioType.type({
	symbol: ioType.readonly(ioType.string),
	name: ioType.readonly(ioType.string),
	type: ioType.readonly(marketInvestmentTypeV)
});
// TODO not good enough, does not cascade to array type
export type MarketInvestmentInfo = Readonly<
	ioType.TypeOf<typeof marketInvestmentInfoV>
>;

export const marketInvestmentInfoArrayV = ioType.readonlyArray(marketInvestmentInfoV);
export type MarketInvestmentInfoArray = ioType.TypeOf<
	typeof marketInvestmentInfoArrayV
>;
