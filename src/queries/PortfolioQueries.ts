import {
	QueryClient,
	useMutation,
	UseMutationResult,
	useQuery,
	useQueryClient
} from '@tanstack/react-query';
import {
	downloadUpdatedPortfolioData,
	getPortfolioList
} from '../services/PortfolioService';

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
