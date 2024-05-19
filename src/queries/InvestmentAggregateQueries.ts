import type { MarketTime } from '../types/MarketTime';
import { InvestmentType } from '../types/data/InvestmentType';
import { useQuery } from '@tanstack/react-query';
import {
	type AggregateHistoryRecords,
	getAggregateHistory
} from '../services/TradierAggregateService';
import type { InvestmentData } from '../types/data/InvestmentData';
import { MarketStatus } from '../types/MarketStatus';
import { useSelector } from 'react-redux';
import { timeValueSelector } from '../store/marketSettings/selectors';
import { useCheckMarketStatus, useGetQuotes } from './InvestmentQueries';
import type { Quote } from '../types/quote';
import { useMemo } from 'react';
import type { InvestmentInfo } from '../types/data/InvestmentInfo';
import { handleInvestmentData } from '../services/MarketInvestmentService';
import { getOrThrow } from '@craigmiller160/ts-functions/Try';
import { function as func } from 'fp-ts';

const GET_AGGREGATE_HISTORY_KEY = 'GET_AGGREGATE_HISTORY_KEY';

type GetAggregateHistoryKey = [
	string,
	MarketTime,
	InvestmentType,
	ReadonlyArray<string>
];
export const useGetAggregateHistory = (
	time: MarketTime,
	type: InvestmentType,
	symbols: ReadonlyArray<string>,
	shouldLoad: boolean
) => {
	if (type !== InvestmentType.STOCK) {
		throw new Error(
			`Invalid InvestmentType for getting aggregate history: ${type}`
		);
	}

	return useQuery<
		AggregateHistoryRecords,
		Error,
		AggregateHistoryRecords,
		GetAggregateHistoryKey
	>({
		queryKey: [GET_AGGREGATE_HISTORY_KEY, time, type, symbols],
		queryFn: ({ queryKey: [, theTime, , theSymbols], signal }) =>
			getAggregateHistory(theSymbols, theTime, signal),
		enabled: shouldLoad && symbols.length > 0
	});
};

export type AggregateInvestmentData = Readonly<Record<string, InvestmentData>>;
export type UseGetAggregateInvestmentDataResult = Readonly<{
	data?: AggregateInvestmentData;
	error: Error | null;
	isLoading: boolean;
	shouldRespectMarketStatus: boolean;
	status: MarketStatus;
}>;

const combineResults = (
	time: MarketTime,
	quotes: ReadonlyArray<Quote>,
	aggregateHistory: AggregateHistoryRecords
): AggregateInvestmentData =>
	quotes
		.map((quote): AggregateInvestmentData => {
			const history = aggregateHistory[quote.symbol] ?? [];
			const info: InvestmentInfo = {
				type: InvestmentType.STOCK,
				name: '',
				symbol: quote.symbol
			};
			const data = func.pipe(
				handleInvestmentData(time, info, quote, history),
				getOrThrow
			);
			return {
				[quote.symbol]: data
			};
		})
		.reduce<AggregateInvestmentData>(
			(acc, rec) => ({
				...acc,
				...rec
			}),
			{}
		);

// TODO need tests for this
export const useGetAggregateInvestmentData = (
	symbols?: ReadonlyArray<string>
): UseGetAggregateInvestmentDataResult => {
	const time = useSelector(timeValueSelector);
	const marketStatusResult = useCheckMarketStatus();
	const shouldLoadQuoteData =
		marketStatusResult.data !== MarketStatus.UNKNOWN;
	const shouldLoadHistoryData = marketStatusResult.data === MarketStatus.OPEN;

	const quoteResult = useGetQuotes(
		time,
		InvestmentType.STOCK,
		symbols ?? [],
		shouldLoadQuoteData
	);
	const historyResult = useGetAggregateHistory(
		time,
		InvestmentType.STOCK,
		symbols ?? [],
		shouldLoadHistoryData
	);

	const data = useMemo(() => {
		if (
			quoteResult.data === undefined ||
			historyResult.data === undefined
		) {
			return undefined;
		}
		return combineResults(time, quoteResult.data, historyResult.data);
	}, [time, quoteResult.data, historyResult.data]);

	return {
		data,
		error:
			marketStatusResult.error ??
			quoteResult.error ??
			historyResult.error,
		isLoading:
			marketStatusResult.isFetching ||
			quoteResult.isFetching ||
			historyResult.isFetching,
		shouldRespectMarketStatus: true,
		status: marketStatusResult.data ?? MarketStatus.UNKNOWN
	};
};
