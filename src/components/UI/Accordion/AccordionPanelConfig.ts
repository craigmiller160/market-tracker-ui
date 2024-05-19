import type { ReactNode } from 'react';
import type { AccordionInvestment } from './AccordionInvestment';

export type AccordionPanelConfig = Readonly<{
	title: ReactNode;
	key: string;
	actions?: ReactNode;
	investments: ReadonlyArray<AccordionInvestment>;
}>;
