import * as ioType from 'io-ts';
import { marketInvestmentTypeV } from './MarketInvestmentType';

export const marketInvestmentInfoV = ioType.readonly(
	ioType.type({
		symbol: ioType.string,
		name: ioType.string,
		type: marketInvestmentTypeV
	})
);
export type MarketInvestmentInfo = ioType.TypeOf<typeof marketInvestmentInfoV>;

export const marketInvestmentInfoArrayV = ioType.readonlyArray(
	marketInvestmentInfoV
);
export type MarketInvestmentInfoArray = ioType.TypeOf<
	typeof marketInvestmentInfoArrayV
>;
