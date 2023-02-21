import { MarketTime } from '../types/MarketTime';
import { useQuery } from '@tanstack/react-query';
import { getQuotes } from '../services/CoinGeckoService';
import { getRefetchInterval } from './utils';

export const GET_QUOTES_KEY = 'CoinGeckoQueries_GetQuotes';
export const GET_HISTORY_KEY = 'CoinGeckoQueries_GetHistory';

export const useGetQuote = (time: MarketTime, symbol: string) =>
	useQuery({
		queryKey: [GET_QUOTES_KEY, time, symbol],
		queryFn: () => getQuotes([symbol]),
		refetchInterval: getRefetchInterval(time)
	});
