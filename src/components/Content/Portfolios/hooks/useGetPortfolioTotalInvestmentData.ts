import type { UseLoadInvestmentData } from '../../common/InvestmentCard/UseLoadInvestmentData';
import { MarketStatus } from '../../../../types/MarketStatus';
import { useSelector } from 'react-redux';
import { timeValueSelector } from '../../../../store/marketSettings/selectors';
import type { InvestmentInfo } from '../../../../types/data/InvestmentInfo';

export const useGetPortfolioTotalInvestmentData: UseLoadInvestmentData = (
	info: InvestmentInfo
) => {
	const time = useSelector(timeValueSelector);
	return {
		loading: false,
		status: MarketStatus.CLOSED,
		respectMarketStatus: true
	};
};
