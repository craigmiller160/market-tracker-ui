export interface HistoryDay {
	readonly day: string;
	readonly open: number;
	readonly high: number;
	readonly low: number;
	readonly close: number;
}

export interface TradierHistory {
	readonly history: {
		readonly day: ReadonlyArray<HistoryDay>;
	};
}
