type CoinGeckoChartPrice = [unixTimestamp: number, price: number];

export interface CoinGeckoMarketChart {
	readonly prices: ReadonlyArray<CoinGeckoChartPrice>;
}
