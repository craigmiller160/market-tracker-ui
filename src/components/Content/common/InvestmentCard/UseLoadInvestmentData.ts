import { type InvestmentInfo } from '../../../../types/data/InvestmentInfo';
import { type UseGetInvestmentDataResult } from '../../../../queries/InvestmentQueries';

export type UseLoadInvestmentData = (
	info: InvestmentInfo
) => UseGetInvestmentDataResult;
