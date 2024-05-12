import { createContext, useContext } from 'react';
import { type InvestmentInfo } from '../../../../types/data/InvestmentInfo';
import { type UseGetInvestmentDataResult } from '../../../../queries/InvestmentQueries';

export type UseLoadInvestmentData = (
	info: InvestmentInfo
) => UseGetInvestmentDataResult;

export const InvestmentCardDataLoadingContext = createContext<
	UseLoadInvestmentData | undefined
>(undefined);

export const useGetLoadInvestmentData = (
	useOverrideLoadInvestmentData?: UseLoadInvestmentData
): UseLoadInvestmentData => {
	const value = useContext(InvestmentCardDataLoadingContext);
	if (useOverrideLoadInvestmentData) {
		return useOverrideLoadInvestmentData;
	}

	if (!value) {
		throw new Error(
			'No provider available for InvestmentCardDataLoadingContext'
		);
	}
	return value;
};
