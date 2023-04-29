import { getResponseData, marketTrackerPortfoliosApi } from './AjaxApi';
import {
	PortfolioResponse,
	SharesOwnedResponse
} from '../types/generated/market-tracker-portfolio-service';
import { StockHistoryRequest } from '../types/portfolios';
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

export const getStocksForCombinedPortfolios = (): Promise<
	ReadonlyArray<string>
> =>
	marketTrackerPortfoliosApi
		.get<ReadonlyArray<string>>({
			uri: '/portfolios/combined/stocks',
			errorCustomizer: 'Error getting stocks for combined portfolios'
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

export const getSharesHistoryForStockInCombinedPortfolios = (
	request: StockHistoryRequest
): Promise<ReadonlyArray<SharesOwnedResponse>> => {
	const queryString = qs.stringify({
		startDate: formatDateForFilter(request.startDate),
		endDate: formatDateForFilter(request.endDate),
		interval: request.interval
	});
	return marketTrackerPortfoliosApi
		.get<ReadonlyArray<SharesOwnedResponse>>({
			uri: `/portfolios/combined/stocks/${request.symbol}/history?${queryString}`,
			errorCustomizer: `Error getting shares history for stock ${request.symbol} in combined portfolios`
		})
		.then(getResponseData);
};

export const getStocksForPortfolio = (
	portfolioId: string
): Promise<ReadonlyArray<string>> =>
	marketTrackerPortfoliosApi
		.get<ReadonlyArray<string>>({
			uri: `/portfolios/${portfolioId}/stocks`,
			errorCustomizer: `Error getting stocks for portfolio ${portfolioId}`
		})
		.then(getResponseData);
