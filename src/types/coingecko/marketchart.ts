type CoinGeckoChartPrice = [number, number];

export interface CoinGeckoMarketChart {
	readonly prices: ReadonlyArray<CoinGeckoChartPrice>;
}
