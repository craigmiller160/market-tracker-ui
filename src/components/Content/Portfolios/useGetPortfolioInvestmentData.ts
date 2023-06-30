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
import { useMemo } from 'react';
import { InvestmentData } from '../../../types/data/InvestmentData';
import { MarketTime } from '../../../types/MarketTime';
import { HistoryRecord } from '../../../types/history';

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

const mergeHistory = (
	time: MarketTime,
	investmentHistory: ReadonlyArray<HistoryRecord>,
	portfolioHistory: ReadonlyArray<SharesOwnedResponse>
): ReadonlyArray<HistoryRecord> => {
	if (MarketTime.ONE_DAY === time) {
		const singlePortfolioRecord = portfolioHistory[0];
		return investmentHistory.map(
			(record): HistoryRecord => ({
				...record,
				price: record.price * singlePortfolioRecord.totalShares
			})
		);
	}

	// TODO fix this
	return [];
};

const mergeInvestmentData = (
	time: MarketTime,
	investmentData?: InvestmentData,
	portfolioCurrentData?: SharesOwnedResponse,
	portfolioHistoryData?: ReadonlyArray<SharesOwnedResponse>
): InvestmentData | undefined => {
	if (
		investmentData === undefined ||
		portfolioCurrentData === undefined ||
		portfolioHistoryData === undefined
	) {
		return undefined;
	}

	const startPrice =
		portfolioHistoryData[0].totalShares * investmentData.startPrice;
	const currentPrice =
		portfolioCurrentData.totalShares * investmentData.currentPrice;
	const history = mergeHistory(time, investmentData.history, portfolioHistoryData);

	return {
		name: investmentData.name,
		startPrice,
		currentPrice,
		history
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

	console.log('INVESTMENT', investmentData);
	console.log('PORTFOLIO', portfolioCurrentData, portfolioHistoryData);

	// TODO for today, one portfolio history record with lots of tradier records
	// TODO for one week, portfolio has weekend dates, tradier does not. Also, tradier has two entries per day, portfolio has one
	// TODO the other history intervals are probably the same as one-week

	return {
		respectMarketStatus,
		status,
		data: mergedInvestmentData,
		error: investmentError ?? portfolioError,
		loading: investmentIsFetching || portfolioIsFetching
	};
};
