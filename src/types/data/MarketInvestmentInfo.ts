import * as ioType from 'io-ts';
import { marketInvestmentTypeV } from './MarketInvestmentType';

export const marketInvestmentInfoV = ioType.type({
	symbol: ioType.readonly(ioType.string),
	name: ioType.readonly(ioType.string),
	type: ioType.readonly(marketInvestmentTypeV)
});
// TODO not good enough, does not cascade to array type
export type MarketInvestmentInfo = Readonly<
	ioType.TypeOf<typeof marketInvestmentInfoV>
>;

export const marketInvestmentInfoArrayV = ioType.readonlyArray(
	marketInvestmentInfoV
);
export type MarketInvestmentInfoArray = ioType.TypeOf<
	typeof marketInvestmentInfoArrayV
>;
