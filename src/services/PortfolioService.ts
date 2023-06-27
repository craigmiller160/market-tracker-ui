import { getResponseData, marketTrackerPortfoliosApi } from './AjaxApi';
import {
	PortfolioResponse,
	SharesOwnedResponse
} from '../types/generated/market-tracker-portfolio-service';
import {
	StockHistoryInPortfolioRequest,
	StockHistoryRequest
} from '../types/portfolios';
import qs from 'qs';
import * as Time from '@craigmiller160/ts-functions/es/Time';

const formatDateForFilter = Time.format('yyyy-MM-dd');

export const downloadUpdatedPortfolioData = (): Promise<unknown> =>
	marketTrackerPortfoliosApi.post({
		uri: '/download',
		errorCustomizer: 'Error downloading updated portfolio data'
	});

export const getPortfolioList = (): Promise<ReadonlyArray<PortfolioResponse>> =>
	marketTrackerPortfoliosApi
		.get<ReadonlyArray<PortfolioResponse>>({
			uri: '/portfolios',
			errorCustomizer: 'Error getting list of portfolios'
		})
		.then(getResponseData);

export const getCurrentSharesForStockInCombinedPortfolios = (
	symbol: string
): Promise<SharesOwnedResponse> =>
	marketTrackerPortfoliosApi
		.get<SharesOwnedResponse>({
			uri: `/portfolios/combined/stocks/${symbol}/current`,
			errorCustomizer: `Error getting current shares for stock ${symbol} in combined portfolios`
		})
		.then(getResponseData);

const createHistoryQueryString = (request: StockHistoryRequest): string =>
	qs.stringify({
		startDate: formatDateForFilter(request.startDate),
		endDate: formatDateForFilter(request.endDate),
		interval: request.interval
	});

export const getSharesHistoryForStockInCombinedPortfolios = (
	request: StockHistoryRequest
): Promise<ReadonlyArray<SharesOwnedResponse>> => {
	const queryString = createHistoryQueryString(request);
	return marketTrackerPortfoliosApi
		.get<ReadonlyArray<SharesOwnedResponse>>({
			uri: `/portfolios/combined/stocks/${request.symbol}/history?${queryString}`,
			errorCustomizer: `Error getting shares history for stock ${request.symbol} in combined portfolios`
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
