import { HistoryRecord } from './history';
import { InvestmentType } from '../data/InvestmentInfo';

export interface MarketData {
	readonly symbol: string;
	readonly name: string;
	readonly currentPrice: number;
	readonly type: InvestmentType;
	readonly history: ReadonlyArray<HistoryRecord>;
}
