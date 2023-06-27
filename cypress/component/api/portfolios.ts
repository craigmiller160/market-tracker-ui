const getPortfolioList = () =>
	cy.intercept('/market-tracker/portfolios/portfolios', {
		fixture: 'portfolios.json'
	});

export const portfolioApi = {
	getPortfolioList
};
