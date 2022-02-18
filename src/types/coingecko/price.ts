import * as ioType from 'io-ts';

const priceV = ioType.type({
	usd: ioType.readonly(ioType.string)
});

const coinGeckoPriceV = ioType.partial({
	bitcoin: ioType.readonly(priceV),
	ethereum: ioType.readonly(priceV)
});
export type CoinGeckoPrice = ioType.TypeOf<typeof coinGeckoPriceV>;
