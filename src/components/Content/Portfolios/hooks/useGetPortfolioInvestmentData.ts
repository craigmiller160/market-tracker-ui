import { type InvestmentInfo } from '../../../../types/data/InvestmentInfo';
import {
	useGetInvestmentData,
	type UseGetInvestmentDataResult
} from '../../../../queries/InvestmentQueries';
import {
	useGetCurrentSharesForStockInPortfolio,
	useGetSharesHistoryForStockInPortfolio
} from '../../../../queries/PortfolioQueries';
import { useSelector } from 'react-redux';
import { timeValueSelector } from '../../../../store/marketSettings/selectors';
import { type SharesOwnedResponse } from '../../../../types/generated/market-tracker-portfolio-service';
import { useMemo } from 'react';
import { MarketTime } from '../../../../types/MarketTime';
import { isPortfolioInvestmentInfo, mergeInvestmentData } from './common';

type UseGetPortfolioDataReturn = Readonly<{
	currentData?: SharesOwnedResponse;
	historyData?: ReadonlyArray<SharesOwnedResponse>;
	error?: Error;
	isFetching: boolean;
}>;

const useGetPortfolioData = (
	info: InvestmentInfo,
	time: MarketTime
): UseGetPortfolioDataReturn => {
	if (!isPortfolioInvestmentInfo(info)) {
		throw new Error('InvestmentInfo is not PortfolioInvestmentInfo');
	}

	const {
		data: currentData,
		error: currentError,
		isFetching: currentIsFetching
	} = useGetCurrentSharesForStockInPortfolio(info.portfolioId, info.symbol);
	const {
		data: historyData,
		error: historyError,
		isFetching: historyIsFetching
	} = useGetSharesHistoryForStockInPortfolio(
		info.portfolioId,
		info.symbol,
		time
	);
	return {
		currentData,
		historyData,
		error: currentError ?? historyError ?? undefined,
		isFetching: currentIsFetching || historyIsFetching
	};
};

export const useGetPortfolioInvestmentData = (
	info: InvestmentInfo
): UseGetInvestmentDataResult => {
	const time = useSelector(timeValueSelector);
	const {
		currentData: portfolioCurrentData,
		historyData: portfolioHistoryData,
		isFetching: portfolioIsFetching,
		error: portfolioError
	} = useGetPortfolioData(info, time);
	const {
		data: investmentData,
		error: investmentError,
		loading: investmentIsFetching,
		respectMarketStatus,
		status
	} = useGetInvestmentData(info);

	const mergedInvestmentData = useMemo(
		() =>
			mergeInvestmentData(
				time,
				investmentData,
				portfolioCurrentData,
				portfolioHistoryData
			),
		[time, investmentData, portfolioCurrentData, portfolioHistoryData]
	);

	return {
		respectMarketStatus,
		status,
		data: mergedInvestmentData,
		error: investmentError ?? portfolioError,
		loading: investmentIsFetching || portfolioIsFetching
	};
};
