import Chainable = Cypress.Chainable;

const getInvestmentCards = (): Chainable<JQuery> => cy.get('.InvestmentCard');
const getTitle = (card: JQuery): Chainable<JQuery> =>
	cy.wrap(card).find('.ant-card-head-title .Title');

export const investmentCardPage = {
	getInvestmentCards,
	getTitle
};
