export interface Quote {
	readonly symbol: string;
	readonly description: string;
	readonly open: number;
	readonly high: number;
	readonly low: number;
	readonly bid: number;
	readonly ask: number;
	readonly close: number;
}

export interface TradierQuotes {
	readonly quotes: Quote | ReadonlyArray<Quote>;
}
