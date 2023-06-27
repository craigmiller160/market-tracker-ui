import Chainable = Cypress.Chainable;

const getPortfoliosPageTitle = (): Chainable<JQuery> =>
	cy.get('#portfoliosPageTitle');

export const portfoliosPage = {
	getPortfoliosPageTitle
};
