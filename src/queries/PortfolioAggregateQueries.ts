import { useQuery } from '@tanstack/react-query';
import {
	type AggregateCurrentSharesOwnedResponse,
	getAggregateCurrentSharesForStocksInPortfolio
} from '../services/PortfolioAggregateService';

export const GET_AGGREGATE_CURRENT_SHARES_FOR_STOCKS_IN_PORTFOLIO_KEY =
	'GET_AGGREGATE_CURRENT_SHARES_FOR_STOCKS_IN_PORTFOLIO_KEY';
export const GET_AGGREGATE_SHARES_HISTORY_FOR_STOCKS_IN_PORTFOLIO_KEY =
	'GET_AGGREGATE_SHARES_HISTORY_FOR_STOCKS_IN_PORTFOLIO_KEY';

type AggregateCurrentSharesKey = [string, string, ReadonlyArray<string>];
export const useGetAggregateCurrentSharesForStocksInPortfolio = (
	portfolioId: string,
	symbols: ReadonlyArray<string>
) =>
	useQuery<
		AggregateCurrentSharesOwnedResponse,
		Error,
		AggregateCurrentSharesOwnedResponse,
		AggregateCurrentSharesKey
	>({
		queryKey: [
			GET_AGGREGATE_CURRENT_SHARES_FOR_STOCKS_IN_PORTFOLIO_KEY,
			portfolioId,
			symbols
		],
		queryFn: ({ queryKey: [, pId, sym], signal }) =>
			getAggregateCurrentSharesForStocksInPortfolio(pId, sym, signal)
	});
