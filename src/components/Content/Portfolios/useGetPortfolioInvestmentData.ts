import {
	InvestmentInfo,
	PortfolioInvestmentInfo
} from '../../../types/data/InvestmentInfo';
import {
	useGetInvestmentData,
	UseGetInvestmentDataResult
} from '../../../queries/InvestmentQueries';
import {
	useGetCurrentSharesForStockInPortfolio,
	useGetSharesHistoryForStockInPortfolio
} from '../../../queries/PortfolioQueries';
import { useSelector } from 'react-redux';
import { timeValueSelector } from '../../../store/marketSettings/selectors';
import { SharesOwnedResponse } from '../../../types/generated/market-tracker-portfolio-service';

const isPortfolioInvestmentInfo = (
	info: InvestmentInfo
): info is PortfolioInvestmentInfo => Object.hasOwn(info, 'portfolioId');

type UseGetPortfolioDataReturn = Readonly<{
	currentData?: SharesOwnedResponse;
	historyData?: ReadonlyArray<SharesOwnedResponse>;
	isFetching: boolean;
}>;

const useGetPortfolioData = (
	info: InvestmentInfo
): UseGetPortfolioDataReturn => {
	if (!isPortfolioInvestmentInfo(info)) {
		throw new Error('InvestmentInfo is not PortfolioInvestmentInfo');
	}

	const time = useSelector(timeValueSelector);

	const { data: currentData, isFetching: currentIsFetching } =
		useGetCurrentSharesForStockInPortfolio(info.portfolioId, info.symbol);
	const { data: historyData, isFetching: historyIsFetching } =
		useGetSharesHistoryForStockInPortfolio(
			info.portfolioId,
			info.symbol,
			time
		);
	return {
		currentData,
		historyData,
		isFetching: currentIsFetching || historyIsFetching
	};
};

export const useGetPortfolioInvestmentData = (
	info: InvestmentInfo
): UseGetInvestmentDataResult => {
	useGetPortfolioData(info);
	const getInvestmentDataResult = useGetInvestmentData(info);
	// TODO need to figure out how to integrate portfolio stuff
	return getInvestmentDataResult;
};
