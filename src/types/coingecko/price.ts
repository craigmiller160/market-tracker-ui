export interface CoinGeckoPrice {
	readonly [key: string]: {
		readonly usd: string;
	};
}
