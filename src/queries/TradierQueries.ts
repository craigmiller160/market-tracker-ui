import { useQuery } from '@tanstack/react-query';
import {
	getFiveYearHistory,
	getOneMonthHistory,
	getOneWeekHistory,
	getOneYearHistory,
	getQuotes,
	getThreeMonthHistory,
	getTimesales
} from '../services/TradierService';
import { MarketTime } from '../types/MarketTime';
import { TODAY_REFETCH_INTERVAL } from './constants';
import { HistoryRecord } from '../types/history';
import { match } from 'ts-pattern';

export const GET_QUOTES_KEY = 'TradierQueries_GetQuotes';
export const GET_HISTORY_KEY = 'TradierQueries_GetHistory';

const getRefetchInterval = (time: MarketTime): number =>
	time === MarketTime.ONE_DAY ? TODAY_REFETCH_INTERVAL : 0;

export const useGetQuote = (time: MarketTime, symbol: string) =>
	useQuery({
		queryKey: [GET_QUOTES_KEY, time, symbol],
		queryFn: () => getQuotes([symbol]),
		refetchInterval: getRefetchInterval(time)
	});

type HistoryFn = (symbol: string) => Promise<ReadonlyArray<HistoryRecord>>;
const getHistoryFn = (time: MarketTime): HistoryFn =>
	match(time)
		.with(MarketTime.ONE_DAY, () => getTimesales)
		.with(MarketTime.ONE_WEEK, () => getOneWeekHistory)
		.with(MarketTime.ONE_MONTH, () => getOneMonthHistory)
		.with(MarketTime.THREE_MONTHS, () => getThreeMonthHistory)
		.with(MarketTime.ONE_YEAR, () => getOneYearHistory)
		.with(MarketTime.FIVE_YEARS, () => getFiveYearHistory)
		.run();

type GetHistoryQueryKey = [string, MarketTime, string];

export const useGetHistory = (time: MarketTime, symbol: string) =>
	useQuery<
		ReadonlyArray<HistoryRecord>,
		Error,
		ReadonlyArray<HistoryRecord>,
		GetHistoryQueryKey
	>({
		queryKey: [GET_HISTORY_KEY, time, symbol],
		queryFn: ({ queryKey: [, theTime, theSymbol] }) =>
			getHistoryFn(theTime)(theSymbol),
		refetchInterval: getRefetchInterval(time)
	});
