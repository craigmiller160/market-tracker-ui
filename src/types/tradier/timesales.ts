// TODO add typechecking

export interface TradierSeriesData {
	readonly time: string;
	readonly timestamp: number;
	readonly price: number;
	readonly open: number;
	readonly high: number;
	readonly low: number;
	readonly close: number;
	readonly volume: number;
	readonly vwap: number;
}

export interface TradierSeries {
	readonly series: {
		readonly data: ReadonlyArray<TradierSeriesData>;
	};
}
