import { InvestmentInfo } from '../../../types/data/InvestmentInfo';
import {
	useGetInvestmentData,
	UseGetInvestmentDataResult
} from '../../../queries/InvestmentQueries';

export const useGetPortfolioInvestmentData = (
	info: InvestmentInfo
): UseGetInvestmentDataResult => {
	const getInvestmentDataResult = useGetInvestmentData(info);
	// TODO need to figure out how to integrate portfolio stuff
	return getInvestmentDataResult;
};
