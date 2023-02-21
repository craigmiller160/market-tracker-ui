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
import { useMemo } from 'react';
import * as Either from 'fp-ts/es6/Either';
import { pipe } from 'fp-ts/es6/function';
import { TryT } from '@craigmiller160/ts-functions/es/types';
import { handleInvestmentData } from '../services/MarketInvestmentService';
import { InvestmentData } from '../types/data/InvestmentData';
import { MarketStatus } from '../types/MarketStatus';
import { useSelector } from 'react-redux';
import { timeValueSelector } from '../store/marketSettings/selectors';

export const GET_QUOTE_KEY = 'InvestmentQueries_GetQuote';
export const GET_HISTORY_KEY = 'InvestmentQueries_GetHistory';
export const GET_MARKET_STATUS = 'InvestmentQueries_GetMarketStatus';

const TODAY_REFETCH_INTERVAL = 300_000;

const getRefetchInterval = (time: MarketTime): number =>
	time === MarketTime.ONE_DAY ? TODAY_REFETCH_INTERVAL : 0;

type HistoryFn = (symbol: string) => Promise<ReadonlyArray<HistoryRecord>>;
export const getHistoryFn = (
	time: MarketTime,
	type: InvestmentType
): HistoryFn =>
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
export const useGetQuote = (
	time: MarketTime,
	type: InvestmentType,
	symbol: string,
	shoudLoad: boolean
) =>
	useQuery<Quote, Error, Quote, GetQuoteQueryKey>({
		queryKey: [GET_QUOTE_KEY, time, type, symbol],
		queryFn: ({ queryKey: [, , theType, theSymbol] }) =>
			getQuoteFn(theType)([theSymbol]).then((list) => list[0]),
		refetchInterval: getRefetchInterval(time),
		enabled: shoudLoad
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

type UseGetInvestmentDataResult = {
	readonly data?: InvestmentData;
	readonly error?: Error;
	readonly loading: boolean;
	readonly respectMarketStatus: boolean;
	readonly status: MarketStatus;
};

const shouldRespectMarketStatus = (info: InvestmentInfo) =>
	info.type !== InvestmentType.CRYPTO;

// TODO is InvestmentInfo safe as a reference for controlling re-enders/re-queries?
export const useGetInvestmentData = (
	info: InvestmentInfo
): UseGetInvestmentDataResult => {
	const time = useSelector(timeValueSelector);
	const respectMarketStatus = shouldRespectMarketStatus(info);
	const { data: status } = useCheckMarketStatus();

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
		loading: quoteIsFetching || historyIsFetching,
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

// TODO what happens when this is disabled
export const useCheckMarketStatus = (): UseQueryResult<MarketStatus, Error> => {
	const time = useSelector(timeValueSelector);
	return useQuery<MarketStatus, Error>({
		queryKey: [GET_MARKET_STATUS, time],
		queryFn: tradierService.getMarketStatus,
		enabled: MarketTime.ONE_DAY === time,
		placeholderData:
			MarketTime.ONE_DAY === time
				? MarketStatus.UNKNOWN
				: MarketStatus.OPEN
	});
};
