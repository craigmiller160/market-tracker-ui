import type { TradierQuote } from '../../../../src/types/tradier/quotes';
import type { TradierHistory } from '../../../../src/types/tradier/history';
import type { InvestmentData } from '../../../../src/types/data/InvestmentData';
import type { HistoryRecord } from '../../../../src/types/history';
import { MarketTime } from '../../../../src/types/MarketTime';

export const vtiQuote: TradierQuote = {
    symbol: 'VTI',
    description: 'VTI Name',
    ask: 0,
    bid: 0,
    close: 0,
    high: 0,
    last: 262.3,
    low: 0,
    open: 0,
    prevclose: 261.93
};

export const vxusQuote: TradierQuote = {
    symbol: 'VXUS',
    description: 'VXUS Name',
    ask: 0,
    bid: 0,
    close: 0,
    high: 0,
    last: 62.21,
    low: 0,
    open: 0,
    prevclose: 61.94
};

export const vtiHistory: TradierHistory = {
    history: {
        day: [
            {
                date: '2024-05-13',
                open: 259.08,
                high: 259.08,
                low: 257.56,
                close: 258.19
            },
            {
                date: '2024-05-14',
                open: 258.23,
                high: 259.67,
                low: 258.083,
                close: 259.45
            },
            {
                date: '2024-05-15',
                open: 260.85,
                high: 262.73,
                low: 260.4428,
                close: 262.64
            },
            {
                date: '2024-05-16',
                open: 262.68,
                high: 263.28,
                low: 261.86,
                close: 261.93
            },
            {
                date: '2024-05-17',
                open: 262.15,
                high: 262.3,
                low: 261.24,
                close: 262.3
            }
        ]
    }
};

export const vxusHistory: TradierHistory = {
    history: {
        day: [
            {
                date: '2024-05-13',
                open: 61.23,
                high: 61.3268,
                low: 61.07,
                close: 61.15
            },
            {
                date: '2024-05-14',
                open: 61.36,
                high: 61.547,
                low: 61.3,
                close: 61.53
            },
            {
                date: '2024-05-15',
                open: 61.83,
                high: 62.155,
                low: 61.675,
                close: 62.15
            },
            {
                date: '2024-05-16',
                open: 62.11,
                high: 62.17,
                low: 61.94,
                close: 61.94
            },
            {
                date: '2024-05-17',
                open: 61.99,
                high: 62.24,
                low: 61.92,
                close: 62.21
            }
        ]
    }
};

const tradierToInvestmentData = (
    time: MarketTime,
    quote: TradierQuote,
    history: TradierHistory
): InvestmentData => ({
    name: quote.description,
    startPrice:
        time === MarketTime.ONE_DAY
            ? quote.prevclose
            : parseInt(history.history?.day?.[0]?.open?.toString() ?? '0'),
    currentPrice: quote.last ?? 0,
    history:
        history.history?.day?.flatMap(
            (day): ReadonlyArray<HistoryRecord> => [
                {
                    date: day.date,
                    unixTimestampMillis: 0,
                    price: parseInt(day.open.toString()),
                    time: '00:00:00'
                },
                {
                    date: day.date,
                    unixTimestampMillis: 0,
                    price: parseInt(day.close.toString()),
                    time: '23:59:59'
                }
            ]
        ) ?? []
});

const emptyHistory: TradierHistory = {
    history: {
        day: []
    }
};

export const expectedVtiTodayData: InvestmentData = tradierToInvestmentData(
    MarketTime.ONE_DAY,
    vtiQuote,
    emptyHistory
);

export const expectedVtiOneWeekData: InvestmentData = tradierToInvestmentData(
    MarketTime.ONE_WEEK,
    vtiQuote,
    vtiHistory
);

export const expectedVxusTodayData: InvestmentData = tradierToInvestmentData(
    MarketTime.ONE_DAY,
    vxusQuote,
    emptyHistory
);

export const expectedVxusOneWeekData: InvestmentData = tradierToInvestmentData(
    MarketTime.ONE_WEEK,
    vxusQuote,
    vxusHistory
);
