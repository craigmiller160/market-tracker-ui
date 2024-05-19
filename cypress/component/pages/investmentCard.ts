type Chainable<T> = Cypress.Chainable<T>;

const getInvestmentCards = (): Chainable<JQuery> => cy.get('.investment-card');
const getTitle = (card: JQuery): Chainable<JQuery> =>
    cy.wrap(card).find('.ant-card-head-title .title');

export const investmentCardPage = {
    getInvestmentCards,
    getTitle
};
