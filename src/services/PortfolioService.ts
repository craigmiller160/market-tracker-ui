import { getResponseData, marketTrackerPortfoliosApi } from './AjaxApi';
import { PortfolioResponse } from '../types/generated/market-tracker-portfolio-service';

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

export const getStocksForPortfolio = (
	portfolioId: string
): Promise<ReadonlyArray<string>> =>
	marketTrackerPortfoliosApi
		.get<ReadonlyArray<string>>({
			uri: `/portfolios/${portfolioId}/stocks`,
			errorCustomizer: `Error getting stocks for portfolio ${portfolioId}`
		})
		.then(getResponseData);
