import { InvestmentType } from './InvestmentType';

export type InvestmentInfo = Readonly<{
	symbol: string;
	name: string;
	type: InvestmentType;
}>;

export type PortfolioInvestmentInfo = InvestmentInfo & {
	readonly portfolioId: string;
};
