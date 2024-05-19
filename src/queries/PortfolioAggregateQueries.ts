import { useQuery } from '@tanstack/react-query';
import {
	type AggregateCurrentSharesOwnedResponse,
	type AggregateSharesOwnedHistoryResponse,
	getAggregateCurrentSharesForStocksInPortfolio,
	getAggregateSharesHistoryForStocksInPortfolio
} from '../services/PortfolioAggregateService';
import type { MarketTime } from '../types/MarketTime';

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
			getAggregateCurrentSharesForStocksInPortfolio(pId, sym, signal),
		enabled: symbols.length > 0
	});

type AggregateShareHistoryKey = [
	string,
	string,
	ReadonlyArray<string>,
	MarketTime
];
export const useGetAggregateSharesHistoryForStocksInPortfolio = (
	portfolioId: string,
	symbols: ReadonlyArray<string>,
	time: MarketTime
) =>
	useQuery<
		AggregateSharesOwnedHistoryResponse,
		Error,
		AggregateSharesOwnedHistoryResponse,
		AggregateShareHistoryKey
	>({
		queryKey: [
			GET_AGGREGATE_SHARES_HISTORY_FOR_STOCKS_IN_PORTFOLIO_KEY,
			portfolioId,
			symbols,
			time
		],
		queryFn: ({ queryKey: [, pId, sym, t], signal }) =>
			getAggregateSharesHistoryForStocksInPortfolio(pId, sym, t, signal),
		enabled: symbols.length > 0
	});
