import * as ioType from 'io-ts';

export enum MarketInvestmentType {
	USA_ETF = 'USA_ETF',
	INTERNATIONAL_ETF = 'INTERNATIONAL_ETF',
	CRYPTO = 'CRYPTO'
}

const marketInvestmentTypeV = ioType.keyof({
	[MarketInvestmentType.USA_ETF]: null,
	[MarketInvestmentType.INTERNATIONAL_ETF]: null,
	[MarketInvestmentType.CRYPTO]: null
});

const marketInvestmentInfoV = ioType.type({
	symbol: ioType.readonly(ioType.string),
	name: ioType.readonly(ioType.string),
	type: ioType.readonly(marketInvestmentTypeV)
});
export type MarketInvestmentInfo = ioType.TypeOf<typeof marketInvestmentInfoV>;

const foo: MarketInvestmentInfo = {
	symbol: '',
	name: '',
	type: MarketInvestmentType.USA_ETF
};
foo.symbol = 'abc';

const marketInvestmentInfoArrayV = ioType.readonlyArray(marketInvestmentInfoV);
export type MarketInvestmentInfoArray = ioType.TypeOf<
	typeof marketInvestmentInfoArrayV
>;
