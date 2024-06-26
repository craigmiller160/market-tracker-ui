import {
    QueryClient,
    useMutation,
    type UseMutationResult,
    useQuery,
    useQueryClient
} from '@tanstack/react-query';
import {
    downloadUpdatedPortfolioData,
    getCurrentSharesForStockInPortfolio,
    getPortfolioList,
    getSharesHistoryForStockInPortfolio
} from '../services/PortfolioService';
import {
    type PortfolioResponse,
    type SharesOwnedResponse
} from '../types/generated/market-tracker-portfolio-service';
import { MarketTime } from '../types/MarketTime';
import {
    GET_AGGREGATE_CURRENT_SHARES_FOR_STOCKS_IN_PORTFOLIO_KEY,
    GET_AGGREGATE_SHARES_HISTORY_FOR_STOCKS_IN_PORTFOLIO_KEY
} from './PortfolioAggregateQueries';

export const GET_PORTFOLIO_LIST_KEY = 'PortfolioQueries_GetPortfolioList';
export const GET_CURRENT_SHARES_FOR_STOCK_IN_PORTFOLIO_KEY =
    'PortfolioQueries_GetCurrentSharesForStockInPortfolio';
export const GET_SHARES_HISTORY_FOR_STOCK_IN_PORTFOLIO_KEY =
    'PortfolioQueries_GetSharesHistoryForStockInPortfolio';

const invalidateQueries = (queryClient: QueryClient) =>
    Promise.all([
        queryClient.invalidateQueries([GET_PORTFOLIO_LIST_KEY]),
        queryClient.invalidateQueries([
            GET_CURRENT_SHARES_FOR_STOCK_IN_PORTFOLIO_KEY
        ]),
        queryClient.invalidateQueries([
            GET_SHARES_HISTORY_FOR_STOCK_IN_PORTFOLIO_KEY
        ]),
        queryClient.invalidateQueries([
            GET_AGGREGATE_CURRENT_SHARES_FOR_STOCKS_IN_PORTFOLIO_KEY
        ]),
        queryClient.invalidateQueries([
            GET_AGGREGATE_SHARES_HISTORY_FOR_STOCKS_IN_PORTFOLIO_KEY
        ])
    ]);

export const useDownloadUpdatedPortfolioData = (): UseMutationResult<
    unknown,
    Error
> => {
    const queryClient = useQueryClient();
    return useMutation<unknown, Error, unknown>({
        mutationFn: downloadUpdatedPortfolioData,
        onSuccess: () => invalidateQueries(queryClient)
    });
};

export const useGetPortfolioList = (time: MarketTime) =>
    useQuery<
        ReadonlyArray<PortfolioResponse>,
        Error,
        ReadonlyArray<PortfolioResponse>,
        [string, MarketTime]
    >({
        queryKey: [GET_PORTFOLIO_LIST_KEY, time],
        queryFn: ({ queryKey: [, theTime], signal }) =>
            getPortfolioList(theTime, signal),
        keepPreviousData: true
    });

export const useGetCurrentSharesForStockInPortfolio = (
    portfolioId: string,
    symbol: string
) =>
    useQuery<
        SharesOwnedResponse,
        Error,
        SharesOwnedResponse,
        [string, string, string]
    >({
        queryKey: [
            GET_CURRENT_SHARES_FOR_STOCK_IN_PORTFOLIO_KEY,
            portfolioId,
            symbol
        ],
        queryFn: ({ queryKey: [, portfolioId, symbol], signal }) =>
            getCurrentSharesForStockInPortfolio(portfolioId, symbol, signal)
    });

export const useGetSharesHistoryForStockInPortfolio = (
    portfolioId: string,
    symbol: string,
    time: MarketTime
) =>
    useQuery<
        ReadonlyArray<SharesOwnedResponse>,
        Error,
        ReadonlyArray<SharesOwnedResponse>,
        [string, string, string, MarketTime]
    >({
        queryKey: [
            GET_SHARES_HISTORY_FOR_STOCK_IN_PORTFOLIO_KEY,
            portfolioId,
            symbol,
            time
        ],
        queryFn: ({
            queryKey: [, thePortfolioId, theSymbol, theTime],
            signal
        }) =>
            getSharesHistoryForStockInPortfolio(
                thePortfolioId,
                theSymbol,
                theTime,
                signal
            )
    });
