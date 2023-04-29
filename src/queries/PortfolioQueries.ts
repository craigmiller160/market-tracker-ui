import {
	QueryClient,
	useMutation,
	UseMutationResult,
	useQuery,
	useQueryClient
} from '@tanstack/react-query';
import {
	downloadUpdatedPortfolioData,
	getCurrentSharesForStockInCombinedPortfolios,
	getCurrentSharesForStockInPortfolio,
	getPortfolioList,
	getSharesHistoryForStockInCombinedPortfolios,
	getSharesHistoryForStockInPortfolio,
	getStocksForCombinedPortfolios,
	getStocksForPortfolio
} from '../services/PortfolioService';
import {
	StockHistoryInPortfolioRequest,
	StockHistoryRequest
} from '../types/portfolios';
import { SharesOwnedResponse } from '../types/generated/market-tracker-portfolio-service';

export const GET_PORTFOLIO_LIST_KEY = 'PortfolioQueries_GetPortfolioList';
export const GET_STOCKS_FOR_COMBINED_PORTFOLIOS_KEY =
	'PortfolioQueries_GetStocksForCombinedPortfolios';
export const GET_CURRENT_SHARES_FOR_STOCK_IN_COMBINED_PORTFOLIOS_KEY =
	'PortfolioQueries_GetCurrentSharesForStockInCombinedPortfolios';
export const GET_SHARES_HISTORY_FOR_STOCK_IN_COMBINED_PORTFOLIOS_KEY =
	'PortfolioQueries_GetSharesHistoryForStockInCombinedPortfolios';
export const GET_STOCKS_FOR_PORTFOLIO_KEY =
	'PortfolioQueries_GetStocksForPortfolio';
export const GET_CURRENT_SHARES_FOR_STOCK_IN_PORTFOLIO_KEY =
	'PortfolioQueries_GetCurrentSharesForStockInPortfolio';
export const GET_SHARES_HISTORY_FOR_STOCK_IN_PORTFOLIO_KEY =
	'PortfolioQueries_GetSharesHistoryForStockInPortfolio';

const invalidateQueries = (queryClient: QueryClient) =>
	Promise.all([
		queryClient.invalidateQueries([GET_PORTFOLIO_LIST_KEY]),
		queryClient.invalidateQueries([GET_STOCKS_FOR_COMBINED_PORTFOLIOS_KEY]),
		queryClient.invalidateQueries([
			GET_CURRENT_SHARES_FOR_STOCK_IN_COMBINED_PORTFOLIOS_KEY
		]),
		queryClient.invalidateQueries([
			GET_SHARES_HISTORY_FOR_STOCK_IN_COMBINED_PORTFOLIOS_KEY
		]),
		queryClient.invalidateQueries([GET_STOCKS_FOR_PORTFOLIO_KEY]),
		queryClient.invalidateQueries([
			GET_CURRENT_SHARES_FOR_STOCK_IN_PORTFOLIO_KEY
		]),
		queryClient.invalidateQueries([
			GET_SHARES_HISTORY_FOR_STOCK_IN_PORTFOLIO_KEY
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

export const useGetPortfolioList = () =>
	useQuery({
		queryKey: [GET_PORTFOLIO_LIST_KEY],
		queryFn: getPortfolioList
	});

export const useGetStocksForCombinedPortfolios = () =>
	useQuery({
		queryKey: [GET_STOCKS_FOR_COMBINED_PORTFOLIOS_KEY],
		queryFn: getStocksForCombinedPortfolios
	});

export const useGetCurrentSharesForStockInCombinedPortfolios = (
	symbol: string
) =>
	useQuery({
		queryKey: [
			GET_CURRENT_SHARES_FOR_STOCK_IN_COMBINED_PORTFOLIOS_KEY,
			symbol
		],
		queryFn: ({ queryKey: [, symbol] }) =>
			getCurrentSharesForStockInCombinedPortfolios(symbol)
	});

export const useGetSharesHistoryForStockInCombinedPortfolios = (
	request: StockHistoryRequest
) =>
	useQuery<
		ReadonlyArray<SharesOwnedResponse>,
		Error,
		ReadonlyArray<SharesOwnedResponse>,
		[string, StockHistoryRequest]
	>({
		queryKey: [
			GET_SHARES_HISTORY_FOR_STOCK_IN_COMBINED_PORTFOLIOS_KEY,
			request
		],
		queryFn: ({ queryKey: [, request] }) =>
			getSharesHistoryForStockInCombinedPortfolios(request)
	});

export const useGetStocksForPortfolio = (portfolioId: string) =>
	useQuery({
		queryKey: [GET_STOCKS_FOR_PORTFOLIO_KEY, portfolioId],
		queryFn: ({ queryKey: [, portfolioId] }) =>
			getStocksForPortfolio(portfolioId)
	});

export const useGetCurrentSharesForStockInPortfolio = (
	portfolioId: string,
	symbol: string
) =>
	useQuery({
		queryKey: [
			GET_CURRENT_SHARES_FOR_STOCK_IN_PORTFOLIO_KEY,
			portfolioId,
			symbol
		],
		queryFn: ({ queryKey: [, portfolioId, symbol] }) =>
			getCurrentSharesForStockInPortfolio(portfolioId, symbol)
	});

export const useGetSharesHistoryForStockInPortfolio = (
	request: StockHistoryInPortfolioRequest
) =>
	useQuery<
		ReadonlyArray<SharesOwnedResponse>,
		Error,
		ReadonlyArray<SharesOwnedResponse>,
		[string, StockHistoryInPortfolioRequest]
	>({
		queryKey: [GET_SHARES_HISTORY_FOR_STOCK_IN_PORTFOLIO_KEY, request],
		queryFn: ({ queryKey: [, request] }) =>
			getSharesHistoryForStockInPortfolio(request)
	});
