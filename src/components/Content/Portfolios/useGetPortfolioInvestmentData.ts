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

const isPortfolioInvestmentInfo = (
	info: InvestmentInfo
): info is PortfolioInvestmentInfo => Object.hasOwn(info, 'portfolioId');

const useGetPortfolioData = (info: InvestmentInfo) => {
	if (!isPortfolioInvestmentInfo(info)) {
		throw new Error('InvestmentInfo is not PortfolioInvestmentInfo');
	}

	useGetCurrentSharesForStockInPortfolio(info.portfolioId, info.symbol);
	useGetSharesHistoryForStockInPortfolio({
		symbol: info.symbol,
		portfolioId: info.portfolioId
	});
};

export const useGetPortfolioInvestmentData = (
	info: InvestmentInfo
): UseGetInvestmentDataResult => {
	useGetPortfolioData(info);
	const getInvestmentDataResult = useGetInvestmentData(info);
	// TODO need to figure out how to integrate portfolio stuff
	return getInvestmentDataResult;
};
