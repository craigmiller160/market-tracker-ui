import type { UseLoadInvestmentData } from '../common/InvestmentCard/InvestmentCardDataLoadingContext';
import { MarketStatus } from '../../../types/MarketStatus';

export const useGetPortfolioTotalInvestmentData: UseLoadInvestmentData = () => {
	console.log('WORKING');
	return {
		loading: false,
		status: MarketStatus.CLOSED,
		respectMarketStatus: true
	};
};
