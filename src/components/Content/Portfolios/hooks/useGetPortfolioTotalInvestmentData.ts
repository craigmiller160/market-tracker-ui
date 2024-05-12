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
import { useCheckMarketStatus } from '../../../../queries/InvestmentQueries';

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
	return {
		data: result.data?.find(
			(portfolio) => portfolio.id === info.portfolioId
		)?.stockSymbols,
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
	const checkMarketStatusResult = useCheckMarketStatus();

	return {
		loading: portfolioStockListResult.isLoading,
		status: checkMarketStatusResult?.data ?? MarketStatus.UNKNOWN,
		respectMarketStatus: true
	};
};
