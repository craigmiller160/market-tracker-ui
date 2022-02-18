// TODO add typechecking

export interface TradierHistoryDay {
	readonly date: string;
	readonly open: number;
	readonly high: number;
	readonly low: number;
	readonly close: number;
}

export interface TradierHistory {
	readonly history: {
		readonly day: ReadonlyArray<TradierHistoryDay>;
	};
}
