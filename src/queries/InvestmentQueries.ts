import { MarketTime } from '../types/MarketTime';
import { HistoryRecord } from '../types/history';
import {
	InvestmentType,
	isCrypto,
	isStock
} from '../types/data/InvestmentType';
import { match, P } from 'ts-pattern';
import * as tradierService from '../services/TradierService';
import * as coinGeckoService from '../services/CoinGeckoService';
import { Quote } from '../types/quote';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { InvestmentInfo } from '../types/data/InvestmentInfo';

export type InvestmentData = {
	readonly name: string;
	readonly startPrice: number;
	readonly currentPrice: number;
	readonly history: ReadonlyArray<HistoryRecord>;
};

export const GET_QUOTE_KEY = 'InvestmentQueries_GetQuote';
export const GET_HISTORY_KEY = 'InvestmentQueries_GetHistory';

const TODAY_REFETCH_INTERVAL = 300_000;

const getRefetchInterval = (time: MarketTime): number =>
	time === MarketTime.ONE_DAY ? TODAY_REFETCH_INTERVAL : 0;

type HistoryFn = (symbol: string) => Promise<ReadonlyArray<HistoryRecord>>;
const getHistoryFn = (time: MarketTime, type: InvestmentType): HistoryFn =>
	match({ time, type })
		.with(
			{ time: MarketTime.ONE_DAY, type: P.when(isStock) },
			() => tradierService.getTimesales
		)
		.with(
			{ time: MarketTime.ONE_DAY, type: P.when(isCrypto) },
			() => coinGeckoService.getTodayHistory
		)
		.with(
			{ time: MarketTime.ONE_WEEK, type: P.when(isStock) },
			() => tradierService.getOneWeekHistory
		)
		.with(
			{ time: MarketTime.ONE_WEEK, type: P.when(isCrypto) },
			() => coinGeckoService.getOneWeekHistory
		)
		.with(
			{ time: MarketTime.ONE_MONTH, type: P.when(isStock) },
			() => tradierService.getOneMonthHistory
		)
		.with(
			{ time: MarketTime.ONE_MONTH, type: P.when(isCrypto) },
			() => coinGeckoService.getOneMonthHistory
		)
		.with(
			{ time: MarketTime.THREE_MONTHS, type: P.when(isStock) },
			() => tradierService.getThreeMonthHistory
		)
		.with(
			{ time: MarketTime.THREE_MONTHS, type: P.when(isCrypto) },
			() => coinGeckoService.getThreeMonthHistory
		)
		.with(
			{ time: MarketTime.ONE_YEAR, type: P.when(isStock) },
			() => tradierService.getOneYearHistory
		)
		.with(
			{ time: MarketTime.ONE_YEAR, type: P.when(isCrypto) },
			() => coinGeckoService.getOneYearHistory
		)
		.with(
			{ time: MarketTime.FIVE_YEARS, type: P.when(isStock) },
			() => tradierService.getFiveYearHistory
		)
		.with(
			{ time: MarketTime.FIVE_YEARS, type: P.when(isCrypto) },
			() => coinGeckoService.getFiveYearHistory
		)
		.run();

type QuoteFn = (symbol: ReadonlyArray<string>) => Promise<ReadonlyArray<Quote>>;
export const getQuoteFn = (type: InvestmentType): QuoteFn =>
	match(type)
		.when(isStock, () => tradierService.getQuotes)
		.otherwise(() => coinGeckoService.getQuotes);

type GetQuoteQueryKey = [string, MarketTime, InvestmentType, string];
// TODO narrow to a single quote
export const useGetQuote = (
	time: MarketTime,
	type: InvestmentType,
	symbol: string
) =>
	useQuery<
		ReadonlyArray<Quote>,
		Error,
		ReadonlyArray<Quote>,
		GetQuoteQueryKey
	>({
		queryKey: [GET_QUOTE_KEY, time, type, symbol],
		queryFn: ({ queryKey: [, , theType, theSymbol] }) =>
			getQuoteFn(theType)([theSymbol]),
		refetchInterval: getRefetchInterval(time)
	});

type GetHistoryQueryKey = [string, MarketTime, InvestmentType, string];
export const useGetHistory = (
	time: MarketTime,
	type: InvestmentType,
	symbol: string,
	shouldLoad: boolean
) =>
	useQuery<
		ReadonlyArray<HistoryRecord>,
		Error,
		ReadonlyArray<HistoryRecord>,
		GetHistoryQueryKey
	>({
		queryKey: [GET_HISTORY_KEY, time, type, symbol],
		queryFn: ({ queryKey: [, theTime, theType, theSymbol] }) =>
			getHistoryFn(theTime, theType)(theSymbol),
		refetchInterval: getRefetchInterval(time),
		enabled: shouldLoad
	});

export const useGetInvestmentData = (
	time: MarketTime,
	info: InvestmentInfo,
	shouldLoadHistoryData: boolean
): UseQueryResult<InvestmentData, Error> => {
	const { error: quoteError } = useGetQuote(time, info.type, info.symbol);
	const { error: historyError } = useGetHistory(
		time,
		info.type,
		info.symbol,
		shouldLoadHistoryData
	);
};
