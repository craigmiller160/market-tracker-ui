import { useQuery } from '@tanstack/react-query';
import { getMarketStatus, getQuotes } from '../services/TradierService';
import { MarketTime } from '../types/MarketTime';
import { HistoryRecord } from '../types/history';
import { getHistoryFn, GetHistoryQueryKey, getRefetchInterval } from './utils';
import { InvestmentType } from '../types/data/InvestmentType';
// TODO delete this file

export const GET_QUOTES_KEY = 'TradierQueries_GetQuotes';
export const GET_HISTORY_KEY = 'TradierQueries_GetHistory';
export const GET_MARKET_STATUS_KEY = 'TradierQueries_GetMarketStatus';

export const useGetStockQuote = (time: MarketTime, symbol: string) =>
	useQuery({
		queryKey: [GET_QUOTES_KEY, time, symbol],
		queryFn: () => getQuotes([symbol]),
		refetchInterval: getRefetchInterval(time)
	});

export const useGetStockHistory = (time: MarketTime, symbol: string) =>
	useQuery<
		ReadonlyArray<HistoryRecord>,
		Error,
		ReadonlyArray<HistoryRecord>,
		GetHistoryQueryKey
	>({
		queryKey: [GET_HISTORY_KEY, time, symbol],
		queryFn: ({ queryKey: [, theTime, theSymbol] }) =>
			getHistoryFn(theTime, InvestmentType.STOCK)(theSymbol),
		refetchInterval: getRefetchInterval(time)
	});

export const useGetMarketStatus = () =>
	useQuery({
		queryKey: [GET_MARKET_STATUS_KEY],
		queryFn: getMarketStatus
	});
