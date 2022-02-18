import * as ioType from 'io-ts';

export const coinGeckoChartPriceV = ioType.tuple([
	ioType.number,
	ioType.number
]);
export type CoinGeckoChartPrice = ioType.TypeOf<typeof coinGeckoChartPriceV>;

export const coinGeckoMarketChartV = ioType.type({
	prices: ioType.readonlyArray(coinGeckoChartPriceV)
});
export type CoinGeckoMarketChart = ioType.TypeOf<typeof coinGeckoMarketChartV>;
