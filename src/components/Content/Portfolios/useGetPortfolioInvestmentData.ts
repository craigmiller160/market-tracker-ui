import {
	InvestmentInfo,
	PortfolioInvestmentInfo
} from '../../../types/data/InvestmentInfo';
import {
	useGetInvestmentData,
	UseGetInvestmentDataResult
} from '../../../queries/InvestmentQueries';
import {
	useGetCurrentSharesForStockInPortfolio,
	useGetSharesHistoryForStockInPortfolio
} from '../../../queries/PortfolioQueries';
import { useSelector } from 'react-redux';
import { timeValueSelector } from '../../../store/marketSettings/selectors';
import { SharesOwnedResponse } from '../../../types/generated/market-tracker-portfolio-service';

const isPortfolioInvestmentInfo = (
	info: InvestmentInfo
): info is PortfolioInvestmentInfo => Object.hasOwn(info, 'portfolioId');

type UseGetPortfolioDataReturn = Readonly<{
	currentData?: SharesOwnedResponse;
	historyData?: ReadonlyArray<SharesOwnedResponse>;
	error?: Error;
	isFetching: boolean;
}>;

const useGetPortfolioData = (
	info: InvestmentInfo
): UseGetPortfolioDataReturn => {
	if (!isPortfolioInvestmentInfo(info)) {
		throw new Error('InvestmentInfo is not PortfolioInvestmentInfo');
	}

	const time = useSelector(timeValueSelector);

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
	const {
		currentData: portfolioCurrentData,
		historyData: portfolioHistoryData,
		isFetching: portfolioIsFetching,
		error: portfolioError
	} = useGetPortfolioData(info);
	const {
		data: investmentData,
		error: investmentError,
		loading: investmentIsFetching,
		respectMarketStatus,
		status
	} = useGetInvestmentData(info);
	// TODO need to figure out how to integrate portfolio stuff
	return {
		respectMarketStatus,
		status,
		data: undefined, // TODO
		error: undefined, // TODO
		loading: false // TODO
	};
};
