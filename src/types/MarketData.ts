import { HistoryRecord } from './history';

export interface MarketData {
	readonly symbol: string;
	readonly name: string;
	readonly currentPrice: number;
	readonly isInternational: boolean;
	readonly history: ReadonlyArray<HistoryRecord>;
}
