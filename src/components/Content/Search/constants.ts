import { InvestmentType } from '../../../types/data/InvestmentType';

export interface SearchValues {
	readonly searchType: InvestmentType;
	readonly symbol: string;
}
