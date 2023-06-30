import { getResponseData, marketTrackerPortfoliosApi } from './AjaxApi';
import {
	PortfolioResponse,
	SharesOwnedResponse
} from '../types/generated/market-tracker-portfolio-service';
import { StockHistoryInterval } from '../types/portfolios';
import qs from 'qs';
import { MarketTime } from '../types/MarketTime';
import { match } from 'ts-pattern';
import {
	formatHistoryDate,
	getFiveYearHistoryStartDate,
	getOneMonthHistoryStartDate,
	getOneWeekHistoryStartDate,
	getOneYearHistoryStartDate,
	getThreeMonthHistoryStartDate
} from '../utils/timeUtils';
import { flow } from 'fp-ts/es6/function';
import { addDays } from 'date-fns/fp';

const plusOneDay: (d: Date) => string = flow(addDays(1), formatHistoryDate);

export const getDateRangeForMarketTime = (
	time: MarketTime
): [string, string] => {
	const today = new Date();
	const todayString = formatHistoryDate(today);
	return match<MarketTime, [string, string]>(time)
		.with(MarketTime.ONE_DAY, () => [todayString, plusOneDay(today)])
		.with(MarketTime.ONE_WEEK, () => [
			getOneWeekHistoryStartDate(),
			todayString
		])
		.with(MarketTime.ONE_MONTH, () => [
			getOneMonthHistoryStartDate(),
			todayString
		])
		.with(MarketTime.THREE_MONTHS, () => [
			getThreeMonthHistoryStartDate(),
			todayString
		])
		.with(MarketTime.ONE_YEAR, () => [
			getOneYearHistoryStartDate(),
			todayString
		])
		.with(MarketTime.FIVE_YEARS, () => [
			getFiveYearHistoryStartDate(),
			todayString
		])
		.run();
};

export const getIntervalForMarketTime = (
	time: MarketTime
): StockHistoryInterval =>
	match<MarketTime, StockHistoryInterval>(time)
		.with(MarketTime.ONE_DAY, () => 'SINGLE')
		.with(MarketTime.ONE_WEEK, () => 'DAILY')
		.with(MarketTime.ONE_MONTH, () => 'DAILY')
		.with(MarketTime.THREE_MONTHS, () => 'DAILY')
		.with(MarketTime.ONE_YEAR, () => 'WEEKLY')
		.with(MarketTime.FIVE_YEARS, () => 'MONTHLY')
		.run();

export const downloadUpdatedPortfolioData = (): Promise<unknown> =>
	marketTrackerPortfoliosApi.post({
		uri: '/download',
		errorCustomizer: 'Error downloading updated portfolio data'
	});

export const getPortfolioList = (
	time: MarketTime
): Promise<ReadonlyArray<PortfolioResponse>> => {
	const [start, end] = getDateRangeForMarketTime(time);
	return marketTrackerPortfoliosApi
		.get<ReadonlyArray<PortfolioResponse>>({
			uri: `/portfolios?startDate=${start}&endDate=${end}`,
			errorCustomizer: 'Error getting list of portfolios'
		})
		.then(getResponseData);
};

export const getCurrentSharesForStockInPortfolio = (
	portfolioId: string,
	symbol: string
): Promise<SharesOwnedResponse> =>
	marketTrackerPortfoliosApi
		.get<SharesOwnedResponse>({
			uri: `/portfolios/${portfolioId}/stocks/${symbol}/current`,
			errorCustomizer: `Error getting current shares for stock ${symbol} in portfolio ${portfolioId}`
		})
		.then(getResponseData);

export const getSharesHistoryForStockInPortfolio = (
	portfolioId: string,
	symbol: string,
	time: MarketTime
): Promise<ReadonlyArray<SharesOwnedResponse>> => {
	const [start, end] = getDateRangeForMarketTime(time);
	const interval = getIntervalForMarketTime(time);
	const queryString = qs.stringify({
		startDate: start,
		endDate: end,
		interval: interval
	});
	return marketTrackerPortfoliosApi
		.get<ReadonlyArray<SharesOwnedResponse>>({
			uri: `/portfolios/${portfolioId}/stocks/${symbol}/history?${queryString}`,
			errorCustomizer: `Error getting shares history for stock ${symbol} in portfolio ${portfolioId}`
		})
		.then(getResponseData);
};
