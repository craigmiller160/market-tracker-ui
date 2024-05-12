import {
	type InvestmentInfo,
	type PortfolioInvestmentInfo
} from '../../../types/data/InvestmentInfo';
import { type WithActions } from '../../../types/data/WithActions';
import type { UseLoadInvestmentData } from '../../Content/common/InvestmentCard/InvestmentCardDataLoadingContext';

export type AccordionInvestment = (InvestmentInfo | PortfolioInvestmentInfo) &
	WithActions &
	Readonly<{
		useOverrideLoadInvestmentData?: UseLoadInvestmentData;
	}>;
