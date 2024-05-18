import type { UseLoadInvestmentData } from '../../common/InvestmentCard/UseLoadInvestmentData';
import { useSelector } from 'react-redux';
import { timeValueSelector } from '../../../../store/marketSettings/selectors';
import type {
	InvestmentInfo,
	PortfolioInvestmentInfo
} from '../../../../types/data/InvestmentInfo';
import { isPortfolioInvestmentInfo, mergeInvestmentData } from './common';
import type { MarketTime } from '../../../../types/MarketTime';
import { useGetPortfolioList } from '../../../../queries/PortfolioQueries';
import { useMemo } from 'react';
import type {
	AggregateCurrentSharesOwnedResponse,
	AggregateSharesOwnedHistoryResponse
} from '../../../../services/PortfolioAggregateService';
import {
	useGetAggregateCurrentSharesForStocksInPortfolio,
	useGetAggregateSharesHistoryForStocksInPortfolio
} from '../../../../queries/PortfolioAggregateQueries';
import {
	type AggregateInvestmentData,
	useGetAggregateInvestmentData
} from '../../../../queries/InvestmentAggregateQueries';
import type { InvestmentData } from '../../../../types/data/InvestmentData';

type IntermediateQueryResult<T> = Readonly<{
	data?: T;
	error: Error | null;
	isLoading: boolean;
}>;

type AggregatePortfolioData = Readonly<{
	current: AggregateCurrentSharesOwnedResponse;
	history: AggregateSharesOwnedHistoryResponse;
}>;

const useGetPortfolioStockList = (
	info: PortfolioInvestmentInfo,
	time: MarketTime
): IntermediateQueryResult<ReadonlyArray<string>> => {
	const result = useGetPortfolioList(time);
	const data = useMemo(() => {
		if (!result.data) {
			return undefined;
		}
		return result.data.find(
			(portfolio) => portfolio.id === info.portfolioId
		)?.stockSymbols;
	}, [result.data, info.portfolioId]);
	return {
		data,
		error: result.error,
		isLoading: result.isFetching
	};
};

const useGetPortfolioData = (
	info: PortfolioInvestmentInfo,
	time: MarketTime,
	symbols?: ReadonlyArray<string>
): IntermediateQueryResult<AggregatePortfolioData> => {
	const aggregateCurrentResult =
		useGetAggregateCurrentSharesForStocksInPortfolio(
			info.portfolioId,
			symbols ?? []
		);
	const aggregateHistoryResult =
		useGetAggregateSharesHistoryForStocksInPortfolio(
			info.portfolioId,
			symbols ?? [],
			time
		);

	return {
		data:
			aggregateCurrentResult.data && aggregateHistoryResult.data
				? {
						current: aggregateCurrentResult.data,
						history: aggregateHistoryResult.data
					}
				: undefined,
		isLoading:
			aggregateCurrentResult.isFetching ||
			aggregateHistoryResult.isFetching,
		error: aggregateCurrentResult.error ?? aggregateHistoryResult.error
	};
};

const mergeTotalInvestmentData = (
	time: MarketTime,
	investmentData: AggregateInvestmentData,
	portfolioData: AggregatePortfolioData
): AggregateInvestmentData =>
	Object.entries(portfolioData.current)
		.map(([symbol, currentData]): [string, InvestmentData] => {
			const historyData = portfolioData.history[symbol];
			if (!historyData) {
				throw new Error(
					`Cannot find portfolio history for symbol ${symbol}`
				);
			}

			const stockData = investmentData[symbol];
			if (!investmentData) {
				throw new Error(`Cannot find investment data for ${symbol}`);
			}

			const mergedData = mergeInvestmentData(
				time,
				stockData,
				currentData,
				historyData
			);
			return [symbol, mergedData];
		})
		.map(
			([symbol, mergedData]): AggregateInvestmentData => ({
				[symbol]: mergedData
			})
		)
		.reduce<AggregateInvestmentData>(
			(acc, record) => ({
				...acc,
				...record
			}),
			{}
		);

// TODO write tests for this
export const useGetPortfolioTotalInvestmentData: UseLoadInvestmentData = (
	info: InvestmentInfo
) => {
	const time = useSelector(timeValueSelector);
	if (!isPortfolioInvestmentInfo(info)) {
		throw new Error('InvestmentInfo is not PortfolioInvestmentInfo');
	}

	const portfolioStockListResult = useGetPortfolioStockList(info, time);
	const portfolioDataResult = useGetPortfolioData(
		info,
		time,
		portfolioStockListResult.data
	);
	const investmentDataResult = useGetAggregateInvestmentData(
		portfolioStockListResult.data
	);
	console.log('DATA', portfolioDataResult.data, investmentDataResult.data);

	const mergedInvestmentData = useMemo(() => {
		if (!portfolioDataResult.data || !investmentDataResult.data) {
			return undefined;
		}

		return mergeTotalInvestmentData(
			time,
			investmentDataResult.data,
			portfolioDataResult.data
		);
	}, [time, investmentDataResult.data, portfolioDataResult.data]);

	return {
		// todo fix this part
		data: undefined,
		error:
			portfolioStockListResult.error ??
			portfolioDataResult.error ??
			investmentDataResult.error ??
			undefined,
		loading:
			portfolioStockListResult.isLoading || portfolioDataResult.isLoading,
		status: investmentDataResult.status,
		respectMarketStatus: investmentDataResult.shouldRespectMarketStatus
	};
};
