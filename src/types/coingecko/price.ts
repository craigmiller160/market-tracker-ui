import * as ioType from 'io-ts';

export const coinPriceV = ioType.readonly(
    ioType.type({
        usd: ioType.number
    })
);
export type CoinPrice = ioType.TypeOf<typeof coinPriceV>;

export const coinGeckoPriceV = ioType.readonly(
    ioType.partial({
        bitcoin: coinPriceV,
        ethereum: coinPriceV
    })
);
export type CoinGeckoPrice = ioType.TypeOf<typeof coinGeckoPriceV>;
