import type { UseLoadInvestmentData } from '../../common/InvestmentCard/UseLoadInvestmentData';
import { MarketStatus } from '../../../../types/MarketStatus';
import { useSelector } from 'react-redux';
import { timeValueSelector } from '../../../../store/marketSettings/selectors';
import type {
	InvestmentInfo,
	PortfolioInvestmentInfo
} from '../../../../types/data/InvestmentInfo';
import { isPortfolioInvestmentInfo } from './common';
import type { MarketTime } from '../../../../types/MarketTime';
import { useGetPortfolioList } from '../../../../queries/PortfolioQueries';
import { useMemo } from 'react';

type IntermediateQueryResult<T> = Readonly<{
	data?: T;
	error: Error | null;
	isLoading: boolean;
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
		isLoading: result.isLoading
	};
};

// TODO write tests for this
export const useGetPortfolioTotalInvestmentData: UseLoadInvestmentData = (
	info: InvestmentInfo
) => {
	const time = useSelector(timeValueSelector);
	if (!isPortfolioInvestmentInfo(info)) {
		throw new Error('InvestmentInfo is not PortfolioInvestmentInfo');
	}

	const portfolioStockListResult = useGetPortfolioStockList(info, time);

	return {
		loading: portfolioStockListResult.isLoading,
		// TODO need to get that from a better source
		status: MarketStatus.UNKNOWN,
		respectMarketStatus: true
	};
};
