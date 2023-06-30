import { getResponseData, marketTrackerPortfoliosApi } from './AjaxApi';
import {
	PortfolioResponse,
	SharesOwnedResponse
} from '../types/generated/market-tracker-portfolio-service';
import {
	StockHistoryInPortfolioRequest,
	StockHistoryInterval,
	StockHistoryRequest
} from '../types/portfolios';
import qs from 'qs';
import * as Time from '@craigmiller160/ts-functions/es/Time';
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

const formatDateForFilter = Time.format('yyyy-MM-dd');

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
): StockHistoryInterval => 'SINGLE';

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

const createHistoryQueryString = (request: StockHistoryRequest): string =>
	qs.stringify({
		startDate: formatDateForFilter(request.startDate),
		endDate: formatDateForFilter(request.endDate),
		interval: request.interval
	});

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
	request: StockHistoryInPortfolioRequest
): Promise<ReadonlyArray<SharesOwnedResponse>> => {
	const queryString = createHistoryQueryString(request);
	return marketTrackerPortfoliosApi
		.get<ReadonlyArray<SharesOwnedResponse>>({
			uri: `/portfolios/${request.portfolioId}/stocks/${request.symbol}/history?${queryString}`,
			errorCustomizer: `Error getting shares history for stock ${request.symbol} in portfolio ${request.portfolioId}`
		})
		.then(getResponseData);
};
