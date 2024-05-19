import type { HistoryRecord } from '../types/history';
import { MarketTime } from '../types/MarketTime';
import {
    InvestmentType,
    isCrypto,
    isStock
} from '../types/data/InvestmentType';
import { match, P } from 'ts-pattern';
import * as tradierService from './TradierService';
import * as coinGeckoService from './CoinGeckoService';
import type { Quote } from '../types/quote';

export type HistoryFn = (
    symbol: string,
    signal?: AbortSignal
) => Promise<ReadonlyArray<HistoryRecord>>;
export const getHistoryFn = (
    time: MarketTime,
    type: InvestmentType
): HistoryFn =>
    match({ time, type })
        .with(
            { time: MarketTime.ONE_DAY, type: P.when(isStock) },
            () => tradierService.getTimesales
        )
        .with(
            { time: MarketTime.ONE_DAY, type: P.when(isCrypto) },
            () => coinGeckoService.getTodayHistory
        )
        .with(
            { time: MarketTime.ONE_WEEK, type: P.when(isStock) },
            () => tradierService.getOneWeekHistory
        )
        .with(
            { time: MarketTime.ONE_WEEK, type: P.when(isCrypto) },
            () => coinGeckoService.getOneWeekHistory
        )
        .with(
            { time: MarketTime.ONE_MONTH, type: P.when(isStock) },
            () => tradierService.getOneMonthHistory
        )
        .with(
            { time: MarketTime.ONE_MONTH, type: P.when(isCrypto) },
            () => coinGeckoService.getOneMonthHistory
        )
        .with(
            { time: MarketTime.THREE_MONTHS, type: P.when(isStock) },
            () => tradierService.getThreeMonthHistory
        )
        .with(
            { time: MarketTime.THREE_MONTHS, type: P.when(isCrypto) },
            () => coinGeckoService.getThreeMonthHistory
        )
        .with(
            { time: MarketTime.ONE_YEAR, type: P.when(isStock) },
            () => tradierService.getOneYearHistory
        )
        .with(
            { time: MarketTime.ONE_YEAR, type: P.when(isCrypto) },
            () => coinGeckoService.getOneYearHistory
        )
        .with(
            { time: MarketTime.FIVE_YEARS, type: P.when(isStock) },
            () => tradierService.getFiveYearHistory
        )
        .with(
            { time: MarketTime.FIVE_YEARS, type: P.when(isCrypto) },
            () => coinGeckoService.getFiveYearHistory
        )
        .run();

export type QuoteFn = (
    symbol: ReadonlyArray<string>,
    signal?: AbortSignal
) => Promise<ReadonlyArray<Quote>>;
export const getQuoteFn = (type: InvestmentType): QuoteFn =>
    match(type)
        .when(isStock, () => tradierService.getQuotes)
        .otherwise(() => coinGeckoService.getQuotes);
