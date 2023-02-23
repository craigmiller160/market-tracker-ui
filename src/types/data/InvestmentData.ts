import { HistoryRecord } from '../history';

export type InvestmentData = {
	readonly name: string;
	readonly startPrice: number;
	readonly currentPrice: number;
	readonly history: ReadonlyArray<HistoryRecord>;
};
