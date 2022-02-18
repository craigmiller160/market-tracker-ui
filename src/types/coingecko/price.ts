// TODO fix readonly
import * as ioType from 'io-ts';

export const coinPriceV = ioType.type({
	usd: ioType.readonly(ioType.number)
});
export type CoinPrice = ioType.TypeOf<typeof coinPriceV>;

export const coinGeckoPriceV = ioType.partial({
	bitcoin: ioType.readonly(coinPriceV),
	ethereum: ioType.readonly(coinPriceV)
});
export type CoinGeckoPrice = ioType.TypeOf<typeof coinGeckoPriceV>;
