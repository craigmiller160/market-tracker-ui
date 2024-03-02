type Chainable<T> = Cypress.Chainable<T>;

const getCards = () => cy.get('.investment-card');
const getCard = (card: JQuery | number): Chainable<JQuery> => {
	if (typeof card === 'number') {
		return getCards().eq(card);
	}
	return cy.wrap(card);
};
const getRemoveButton = (card: JQuery | number) =>
	getCard(card).find('.ant-card-actions button');

export const investments = {
	getCards,
	getRemoveButton
};
