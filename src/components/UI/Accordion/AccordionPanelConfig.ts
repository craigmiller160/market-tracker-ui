import type { ReactNode } from 'react';
import type { AccordionInvestment } from './AccordionInvestment';
import type { UseLoadInvestmentData } from '../../Content/common/InvestmentCard/InvestmentCardDataLoadingContext';

export type AccordionPanelConfig = Readonly<{
	title: ReactNode;
	key: string;
	actions?: ReactNode;
	investments: ReadonlyArray<AccordionInvestment>;
	useLoadInvestmentData?: UseLoadInvestmentData;
}>;
