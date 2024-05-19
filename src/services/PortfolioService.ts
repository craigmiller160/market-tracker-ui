import { getResponseData, marketTrackerPortfoliosApi } from './AjaxApi';
import {
    type PortfolioResponse,
    type SharesOwnedResponse
} from '../types/generated/market-tracker-portfolio-service';
import { type StockHistoryInterval } from '../types/portfolios';
import qs from 'qs';
import { MarketTime } from '../types/MarketTime';
import { match } from 'ts-pattern';
import {
    formatHistoryDate,
    getFiveYearStartDate,
    getOneMonthHistoryStartDate,
    getOneWeekHistoryStartDate,
    getOneYearStartDate,
    getThreeMonthHistoryStartDate
} from '../utils/timeUtils';
import { flow } from 'fp-ts/function';
import { addMonths, addWeeks, startOfMonth } from 'date-fns/fp';
import startOfWeek from 'date-fns/startOfWeek/index';

const curriedStartOfWeek =
    (opts: { weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6 }) => (d: Date) =>
        startOfWeek(d, opts);

export const mondayAfterDate: (d: Date) => string = flow(
    curriedStartOfWeek({ weekStartsOn: 1 }),
    addWeeks(1),
    formatHistoryDate
);
export const mondayBeforeDate: (d: Date) => string = flow(
    curriedStartOfWeek({ weekStartsOn: 1 }),
    formatHistoryDate
);

export const monthStartAfterDate: (d: Date) => string = flow(
    startOfMonth,
    addMonths(1),
    formatHistoryDate
);
export const monthStartBeforeDate: (d: Date) => string = flow(
    startOfMonth,
    formatHistoryDate
);

export const getDateRangeForMarketTime = (
    time: MarketTime
): [string, string] => {
    const today = new Date();
    const todayString = formatHistoryDate(today);
    return match<MarketTime, [string, string]>(time)
        .with(MarketTime.ONE_DAY, () => [todayString, todayString])
        .with(MarketTime.ONE_WEEK, () => [
            getOneWeekHistoryStartDate(),
            todayString
        ])
        .with(MarketTime.ONE_MONTH, () => [
            getOneMonthHistoryStartDate(),
            todayString
        ])
        .with(MarketTime.THREE_MONTHS, () => [
            getThreeMonthHistoryStartDate(),
            todayString
        ])
        .with(MarketTime.ONE_YEAR, () => [
            mondayAfterDate(getOneYearStartDate()),
            mondayBeforeDate(today)
        ])
        .with(MarketTime.FIVE_YEARS, () => [
            monthStartAfterDate(getFiveYearStartDate()),
            monthStartBeforeDate(today)
        ])
        .run();
};

export const getIntervalForMarketTime = (
    time: MarketTime
): StockHistoryInterval =>
    match<MarketTime, StockHistoryInterval>(time)
        .with(MarketTime.ONE_DAY, () => 'SINGLE')
        .with(MarketTime.ONE_WEEK, () => 'DAILY')
        .with(MarketTime.ONE_MONTH, () => 'DAILY')
        .with(MarketTime.THREE_MONTHS, () => 'DAILY')
        .with(MarketTime.ONE_YEAR, () => 'WEEKLY')
        .with(MarketTime.FIVE_YEARS, () => 'MONTHLY')
        .run();

export const downloadUpdatedPortfolioData = (): Promise<unknown> =>
    marketTrackerPortfoliosApi.post({
        uri: '/download',
        errorCustomizer: 'Error downloading updated portfolio data'
    });

export const getPortfolioList = (
    time: MarketTime,
    signal?: AbortSignal
): Promise<ReadonlyArray<PortfolioResponse>> => {
    const [start, end] = getDateRangeForMarketTime(time);
    return marketTrackerPortfoliosApi
        .get<ReadonlyArray<PortfolioResponse>>({
            uri: `/portfolios?startDate=${start}&endDate=${end}`,
            errorCustomizer: 'Error getting list of portfolios',
            config: {
                signal
            }
        })
        .then(getResponseData);
};

export const getCurrentSharesForStockInPortfolio = (
    portfolioId: string,
    symbol: string,
    signal?: AbortSignal
): Promise<SharesOwnedResponse> =>
    marketTrackerPortfoliosApi
        .get<SharesOwnedResponse>({
            uri: `/portfolios/${portfolioId}/stocks/${symbol}/current`,
            errorCustomizer: `Error getting current shares for stock ${symbol} in portfolio ${portfolioId}`,
            config: {
                signal
            }
        })
        .then(getResponseData);

export const getSharesHistoryForStockInPortfolio = (
    portfolioId: string,
    symbol: string,
    time: MarketTime,
    signal?: AbortSignal
): Promise<ReadonlyArray<SharesOwnedResponse>> => {
    const [start, end] = getDateRangeForMarketTime(time);
    const interval = getIntervalForMarketTime(time);
    const queryString = qs.stringify({
        startDate: start,
        endDate: end,
        interval: interval
    });
    return marketTrackerPortfoliosApi
        .get<ReadonlyArray<SharesOwnedResponse>>({
            uri: `/portfolios/${portfolioId}/stocks/${symbol}/history?${queryString}`,
            errorCustomizer: `Error getting shares history for stock ${symbol} in portfolio ${portfolioId}`,
            config: {
                signal
            }
        })
        .then(getResponseData);
};
