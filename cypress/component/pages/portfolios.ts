type Chainable<T> = Cypress.Chainable<T>;

const getPortfoliosPageTitle = (): Chainable<JQuery> =>
	cy.get('#portfoliosPageTitle');

const getDownloadDataButton = (): Chainable<JQuery> =>
	cy.get('#downloadPortfolioDataBtn');

export const portfoliosPage = {
	getPortfoliosPageTitle,
	getDownloadDataButton
};
