import { test } from 'vitest';
import { MarketTime } from '../../../../../src/types/MarketTime';
import type { AggregateInvestmentData } from '../../../../../src/queries/InvestmentAggregateQueries';
import { match } from 'ts-pattern';
import {
	expectedVtiData,
	expectedVtiDataNoHistory,
	expectedVxusData,
	expectedVxusDataNoHistory
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

const getInvestmentData = (time: MarketTime): AggregateInvestmentData =>
	match<MarketTime, AggregateInvestmentData>(time)
		.with(MarketTime.ONE_DAY, () => ({
			VTI: expectedVtiDataNoHistory,
			VXUS: expectedVxusDataNoHistory
		}))
		.with(MarketTime.ONE_WEEK, () => ({
			VTI: expectedVtiData,
			VXUS: expectedVxusData
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

test.each<MarketTime>([MarketTime.ONE_DAY, MarketTime.ONE_WEEK])(
	'validate mergeTotalInvestmentData',
	(time) => {
		const investmentData = getInvestmentData(time);
		const portfolioData = getPortfolioData(time);
		const result = mergeTotalInvestmentData(time, investmentData, portfolioData);
    console.log('RESULT', result); // TODO delete this
	}
);
