import { expect, test } from 'vitest';
import { MarketTime } from '../../../../../src/types/MarketTime';
import type { AggregateInvestmentData } from '../../../../../src/queries/InvestmentAggregateQueries';
import { match } from 'ts-pattern';
import {
	expectedVtiOneWeekData,
	expectedVtiTodayData,
	expectedVxusOneWeekData,
	expectedVxusTodayData
} from '../../../../testutils/support/aggregate-queries/tradier-data';
import {
	type AggregatePortfolioData,
	mergeTotalInvestmentData
} from '../../../../../src/components/Content/Portfolios/hooks/useGetPortfolioTotalInvestmentData';
import {
	aggregateCurrent,
	aggregateOneWeekHistory,
	aggregateTodayHistory
} from '../../../../testutils/support/aggregate-queries/portfolio-data';
import type { InvestmentData } from '../../../../../src/types/data/InvestmentData';
import type { HistoryRecord } from '../../../../../src/types/history';
import { mergeHistory } from '../../../../../src/components/Content/Portfolios/hooks/common';

const getInvestmentData = (time: MarketTime): AggregateInvestmentData =>
	match<MarketTime, AggregateInvestmentData>(time)
		.with(MarketTime.ONE_DAY, () => ({
			VTI: expectedVtiTodayData,
			VXUS: expectedVxusTodayData
		}))
		.with(MarketTime.ONE_WEEK, () => ({
			VTI: expectedVtiOneWeekData,
			VXUS: expectedVxusOneWeekData
		}))
		.run();

const getPortfolioData = (time: MarketTime): AggregatePortfolioData =>
	match<MarketTime, AggregatePortfolioData>(time)
		.with(MarketTime.ONE_DAY, () => ({
			current: aggregateCurrent,
			history: aggregateTodayHistory
		}))
		.with(MarketTime.ONE_WEEK, () => ({
			current: aggregateCurrent,
			history: aggregateOneWeekHistory
		}))
		.run();

const getExpectedStartPrice = (
	time: MarketTime,
	investmentData: AggregateInvestmentData,
	portfolioData: AggregatePortfolioData
): number =>
	match<MarketTime, number>(time)
		.with(MarketTime.ONE_DAY, () => {
			const totalVti =
				investmentData.VTI.startPrice *
				portfolioData.current.VTI.totalShares;
			const totalVxus =
				investmentData.VXUS.startPrice *
				portfolioData.current.VXUS.totalShares;
			return totalVti + totalVxus;
		})
		.with(MarketTime.ONE_WEEK, () => {
			const totalVti =
				investmentData.VTI.history[0].price *
				portfolioData.current.VTI.totalShares;
			const totalVxus =
				investmentData.VXUS.history[0].price *
				portfolioData.current.VXUS.totalShares;
			return totalVti + totalVxus;
		})
		.run();

const getExpectedCurrentPrice = (
	investmentData: AggregateInvestmentData,
	portfolioData: AggregatePortfolioData
): number => {
	const vtiTotal =
		investmentData.VTI.currentPrice * portfolioData.current.VTI.totalShares;
	const vxusTotal =
		investmentData.VXUS.currentPrice *
		portfolioData.current.VXUS.totalShares;
	return vtiTotal + vxusTotal;
};

const getExpectedHistory = (
	time: MarketTime,
	investmentData: AggregateInvestmentData,
	portfolioData: AggregatePortfolioData
): ReadonlyArray<HistoryRecord> => {
	const vtiHistory = mergeHistory(
		time,
		investmentData.VTI.history,
		portfolioData.history.VTI
	);
	const vxusHistory = mergeHistory(
		time,
		investmentData.VXUS.history,
		portfolioData.history.VXUS
	);

	return vtiHistory.map((vtiRecord, index) => ({
		...vtiRecord,
		price: vtiRecord.price + vxusHistory[index].price
	}));
};

test.each<MarketTime>([MarketTime.ONE_DAY, MarketTime.ONE_WEEK])(
	'validate mergeTotalInvestmentData',
	(time) => {
		const investmentData = getInvestmentData(time);
		const portfolioData = getPortfolioData(time);
		const result = mergeTotalInvestmentData(
			time,
			investmentData,
			portfolioData
		);

		const expectedStartPrice = getExpectedStartPrice(
			time,
			investmentData,
			portfolioData
		);
		const expectedCurrentPrice = getExpectedCurrentPrice(
			investmentData,
			portfolioData
		);
		const expectedHistory = getExpectedHistory(
			time,
			investmentData,
			portfolioData
		);

		expect(result).toEqual<InvestmentData>({
			name: 'Portfolio',
			startPrice: expectedStartPrice,
			currentPrice: expectedCurrentPrice,
			history: expectedHistory
		});
	}
);
