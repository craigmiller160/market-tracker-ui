import type {
	InvestmentInfo,
	PortfolioInvestmentInfo
} from '../../../../types/data/InvestmentInfo';
import { MarketTime } from '../../../../types/MarketTime';
import type { InvestmentData } from '../../../../types/data/InvestmentData';
import type { SharesOwnedResponse } from '../../../../types/generated/market-tracker-portfolio-service';
import type { HistoryRecord } from '../../../../types/history';
import { match, P } from 'ts-pattern';

export const isPortfolioInvestmentInfo = (
	info: InvestmentInfo
): info is PortfolioInvestmentInfo => Object.hasOwn(info, 'portfolioId');

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
				MarketTime.THREE_MONTHS,
				MarketTime.ONE_YEAR,
				MarketTime.FIVE_YEARS
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

export const mergeInvestmentData = (
	time: MarketTime,
	investmentData: InvestmentData,
	portfolioCurrentData: SharesOwnedResponse,
	portfolioHistoryData: ReadonlyArray<SharesOwnedResponse>
): InvestmentData => {
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
