export interface TradierQuote {
	readonly symbol: string;
	readonly description: string;
	readonly open: number;
	readonly high: number;
	readonly low: number;
	readonly bid: number;
	readonly ask: number;
	readonly close: number;
	readonly last: number;
}

export interface TradierQuotes {
	readonly quotes: {
		readonly quote: TradierQuote | ReadonlyArray<TradierQuote>;
	};
}
