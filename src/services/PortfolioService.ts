import { marketTrackerPortfoliosApi } from './AjaxApi';

export const updatePortfolioData = () =>
	marketTrackerPortfoliosApi.post({
		uri: '/download',
		errorCustomizer: 'Error updating portfolio data'
	});

export const getPortfolioList = () =>
	marketTrackerPortfoliosApi.get({
		uri: '/portfolios'
	});
