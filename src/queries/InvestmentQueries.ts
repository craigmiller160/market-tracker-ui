import { MarketTime } from '../types/MarketTime';
import { type HistoryRecord } from '../types/history';
import { InvestmentType } from '../types/data/InvestmentType';
import * as tradierService from '../services/TradierService';
import { type Quote } from '../types/quote';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type InvestmentInfo } from '../types/data/InvestmentInfo';
import { useMemo } from 'react';
import * as Either from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { type TryT } from '@craigmiller160/ts-functions/types';
import { handleInvestmentData } from '../services/MarketInvestmentService';
import { type InvestmentData } from '../types/data/InvestmentData';
import { MarketStatus } from '../types/MarketStatus';
import { useSelector } from 'react-redux';
import { timeValueSelector } from '../store/marketSettings/selectors';
import { getHistoryFn, getQuoteFn } from '../services/ServiceSelectors';

export const GET_QUOTE_KEY = 'InvestmentQueries_GetQuote';
export const GET_QUOTES_KEY = 'InvestmentQueries_GetQuotes';
export const GET_HISTORY_KEY = 'InvestmentQueries_GetHistory';
export const GET_MARKET_STATUS = 'InvestmentQueries_GetMarketStatus';

const TODAY_REFETCH_INTERVAL = 300_000;

const getRefetchInterval = (time: MarketTime): number =>
	time === MarketTime.ONE_DAY ? TODAY_REFETCH_INTERVAL : 0;

type GetQuoteQueryKey = [string, MarketTime, InvestmentType, string];
export const useGetQuote = (
	time: MarketTime,
	type: InvestmentType,
	symbol: string,
	shouldLoad: boolean
) =>
	useQuery<Quote, Error, Quote, GetQuoteQueryKey>({
		queryKey: [GET_QUOTE_KEY, time, type, symbol],
		queryFn: ({ queryKey: [, , theType, theSymbol], signal }) =>
			getQuoteFn(theType)([theSymbol], signal).then((list) => list[0]),
		refetchInterval: getRefetchInterval(time),
		enabled: shouldLoad
	});

type GetQuotesQueryKey = [
	string,
	MarketTime,
	InvestmentType,
	ReadonlyArray<string>
];
export const useGetQuotes = (
	time: MarketTime,
	type: InvestmentType,
	symbols: ReadonlyArray<string>,
	shouldLoad: boolean
) =>
	useQuery<
		ReadonlyArray<Quote>,
		Error,
		ReadonlyArray<Quote>,
		GetQuotesQueryKey
	>({
		queryKey: [GET_QUOTES_KEY, time, type, symbols],
		queryFn: ({ queryKey: [, , theType, theSymbols], signal }) =>
			getQuoteFn(theType)(theSymbols, signal),
		refetchInterval: getRefetchInterval(time),
		enabled: shouldLoad && symbols.length > 0
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
		queryFn: ({ queryKey: [, theTime, theType, theSymbol], signal }) =>
			getHistoryFn(theTime, theType)(theSymbol, signal),
		refetchInterval: getRefetchInterval(time),
		enabled: shouldLoad
	});

export type UseGetInvestmentDataResult = Readonly<{
	data?: InvestmentData;
	error?: Error;
	loading: boolean;
	respectMarketStatus: boolean;
	status: MarketStatus;
}>;

const shouldRespectMarketStatus = (info: InvestmentInfo) =>
	info.type !== InvestmentType.CRYPTO;

export const useGetInvestmentData = (
	info: InvestmentInfo
): UseGetInvestmentDataResult => {
	const time = useSelector(timeValueSelector);
	const respectMarketStatus = shouldRespectMarketStatus(info);
	const { data: status, isFetching: statusIsFetching } =
		useCheckMarketStatus();

	const shouldLoadQuoteData = status !== MarketStatus.UNKNOWN;
	const shouldLoadHistoryData =
		status === MarketStatus.OPEN ||
		(status === MarketStatus.CLOSED && !respectMarketStatus);
	const {
		data: quote,
		error: quoteError,
		isFetching: quoteIsFetching
	} = useGetQuote(time, info.type, info.symbol, shouldLoadQuoteData);
	const {
		data: history,
		error: historyError,
		isFetching: historyIsFetching
	} = useGetHistory(time, info.type, info.symbol, shouldLoadHistoryData);

	const dataEither: TryT<InvestmentData | undefined> = useMemo(() => {
		if (quoteError || historyError) {
			return Either.left<Error, InvestmentData | undefined>(
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				(quoteError || historyError)!
			);
		}

		if (quote) {
			return handleInvestmentData(time, info, quote, history ?? []);
		}

		return Either.right<Error, InvestmentData | undefined>(undefined);
	}, [time, info, quote, history, quoteError, historyError]);

	const baseResult: UseGetInvestmentDataResult = {
		loading: quoteIsFetching || historyIsFetching || statusIsFetching,
		respectMarketStatus,
		status: status ?? MarketStatus.UNKNOWN
	};

	return pipe(
		dataEither,
		Either.mapLeft(
			(ex) =>
				new Error(
					`Error getting data for ${info.symbol}: ${ex.message}`,
					{
						cause: ex
					}
				)
		),
		Either.fold(
			(error): UseGetInvestmentDataResult => ({
				...baseResult,
				error
			}),
			(data): UseGetInvestmentDataResult => ({
				...baseResult,
				data
			})
		)
	);
};

export const useCheckMarketStatus = (): UseQueryResult<MarketStatus, Error> => {
	const time = useSelector(timeValueSelector);
	return useQuery<MarketStatus, Error>({
		queryKey: [GET_MARKET_STATUS, time],
		queryFn: ({ signal }) => tradierService.getMarketStatus(signal),
		enabled: MarketTime.ONE_DAY === time,
		placeholderData:
			MarketTime.ONE_DAY === time
				? MarketStatus.UNKNOWN
				: MarketStatus.OPEN
	});
};
