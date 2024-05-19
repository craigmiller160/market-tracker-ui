import { type HistoryRecord } from '../history';

export type InvestmentData = Readonly<{
	name: string;
	startPrice: number;
	currentPrice: number;
	history: ReadonlyArray<HistoryRecord>;
}>;
