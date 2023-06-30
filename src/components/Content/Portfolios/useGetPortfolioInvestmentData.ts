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
import { match, P } from 'ts-pattern';

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

type PortfolioHistoryFinder = (
	rec: HistoryRecord
) => (pRec: SharesOwnedResponse) => boolean;
const getPortfolioHistoryFinder = (time: MarketTime): PortfolioHistoryFinder =>
	match<MarketTime, PortfolioHistoryFinder>(time)
		.with(MarketTime.ONE_DAY, () => () => () => true)
		.with(
			P.union(
				MarketTime.ONE_WEEK,
				MarketTime.ONE_MONTH,
				MarketTime.THREE_MONTHS
			),
			() => (rec) => (pRec) => rec.date === pRec.date
		)
		.run();

const mergeHistory = (
	time: MarketTime,
	investmentHistory: ReadonlyArray<HistoryRecord>,
	portfolioHistory: ReadonlyArray<SharesOwnedResponse>
): ReadonlyArray<HistoryRecord> => {
	const portfolioHistoryFinder = getPortfolioHistoryFinder(time);

	return investmentHistory.map((record): HistoryRecord => {
		const portfolioRecord = portfolioHistory.find(
			portfolioHistoryFinder(record)
		);

		return {
			...record,
			price: record.price * (portfolioRecord?.totalShares ?? 0)
		};
	});
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
	const history = mergeHistory(
		time,
		investmentData.history,
		portfolioHistoryData
	);

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

	console.log('INVESTMENT', investmentData);
	console.log('PORTFOLIO', portfolioCurrentData, portfolioHistoryData);

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

	// TODO weekly/monthly intervals do not come close to lining up between tradier & portfolio

	return {
		respectMarketStatus,
		status,
		data: mergedInvestmentData,
		error: investmentError ?? portfolioError,
		loading: investmentIsFetching || portfolioIsFetching
	};
};
