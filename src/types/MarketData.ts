import { HistoryRecord } from './history';
import { InvestmentType } from '../data/InvestmentInfo';

// TODO delete this
export interface MarketData {
	readonly symbol: string;
	readonly name: string;
	readonly currentPrice: number;
	readonly type: InvestmentType;
	readonly history: ReadonlyArray<HistoryRecord>;
}
