import * as ioType from 'io-ts';

export const coinGeckoChartPriceV = ioType.readonly(
	ioType.tuple([ioType.number, ioType.number])
);
export type CoinGeckoChartPrice = ioType.TypeOf<typeof coinGeckoChartPriceV>;

export const coinGeckoMarketChartV = ioType.readonly(
	ioType.type({
		prices: ioType.readonlyArray(coinGeckoChartPriceV)
	})
);
export type CoinGeckoMarketChart = ioType.TypeOf<typeof coinGeckoMarketChartV>;
