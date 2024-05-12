import type {
	InvestmentInfo,
	PortfolioInvestmentInfo
} from '../../../../types/data/InvestmentInfo';

export const isPortfolioInvestmentInfo = (
	info: InvestmentInfo
): info is PortfolioInvestmentInfo => Object.hasOwn(info, 'portfolioId');
