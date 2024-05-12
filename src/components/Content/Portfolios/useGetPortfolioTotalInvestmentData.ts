import type { UseLoadInvestmentData } from '../common/InvestmentCard/InvestmentCardDataLoadingContext';
import { MarketStatus } from '../../../types/MarketStatus';

export const useGetPortfolioTotalInvestmentData: UseLoadInvestmentData = () => {
	return {
		loading: false,
		status: MarketStatus.CLOSED,
		respectMarketStatus: true
	};
};
