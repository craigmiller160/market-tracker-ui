const getPortfolioList = () =>
	cy.intercept(/\/market-tracker\/portfolios\/portfolios?.*/, {
		fixture: 'portfolios.json'
	});

const getPortfolioList_empty = () =>
	cy
		.intercept(/\/market-tracker\/portfolios\/portfolios?.*/, {
			fixture: 'portfolios_empty.json'
		})
		.as('portfolioList_empty');

const downloadPortfolioData = () =>
	cy
		.intercept('post', '/market-tracker/portfolios/download', {
			statusCode: 204
		})
		.as('downloadPortfolioData');

export const portfolioApi = {
	getPortfolioList,
	getPortfolioList_empty,
	downloadPortfolioData
};
