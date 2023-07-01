import { createContext, useContext } from 'react';
import { InvestmentInfo } from '../../../../types/data/InvestmentInfo';
import { UseGetInvestmentDataResult } from '../../../../queries/InvestmentQueries';

export type UseLoadInvestmentData = (
	info: InvestmentInfo
) => UseGetInvestmentDataResult;

export const InvestmentCardDataLoadingContext = createContext<
	UseLoadInvestmentData | undefined
>(undefined);

export const useInvestmentCardDataLoadingContext =
	(): UseLoadInvestmentData => {
		const value = useContext(InvestmentCardDataLoadingContext);
		if (!value) {
			throw new Error(
				'No provider available for InvestmentCardDataLoadingContext'
			);
		}
		return value;
	};
