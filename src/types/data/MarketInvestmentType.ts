import * as ioType from 'io-ts';
import { match } from 'ts-pattern';

export enum MarketInvestmentType {
    USA_ETF = 'USA_ETF',
    INTERNATIONAL_ETF = 'INTERNATIONAL_ETF',
    CRYPTO = 'CRYPTO'
}

export const marketInvestmentTypeV = ioType.keyof({
    [MarketInvestmentType.USA_ETF]: null,
    [MarketInvestmentType.INTERNATIONAL_ETF]: null,
    [MarketInvestmentType.CRYPTO]: null
});

export const getMarketInvestmentTypeTitle = (
    type: MarketInvestmentType
): string =>
    match(type)
        .with(MarketInvestmentType.USA_ETF, () => 'US Markets')
        .with(
            MarketInvestmentType.INTERNATIONAL_ETF,
            () => 'International Markets'
        )
        .with(MarketInvestmentType.CRYPTO, () => 'Cryptocurrency')
        .run();
