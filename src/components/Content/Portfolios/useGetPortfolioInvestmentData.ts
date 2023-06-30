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

	console.log('INVESTMENT', investmentData);
	console.log('PORTFOLIO', portfolioCurrentData, portfolioHistoryData);

	// TODO for today, one portfolio history record with lots of tradier records
	// TODO for one week, portfolio has weekend dates, tradier does not. Also, tradier has two entries per day, portfolio has one
	// TODO the other history intervals are probably the same as one-week

	// TODO need to figure out how to integrate portfolio stuff
	return {
		respectMarketStatus,
		status,
		data: undefined, // TODO
		error: undefined, // TODO
		loading: false // TODO
	};
};
