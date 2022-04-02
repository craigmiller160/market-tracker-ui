import { InvestmentType } from './InvestmentType';

export interface InvestmentInfo {
	readonly symbol: string;
	readonly name: string;
	readonly type: InvestmentType;
}
