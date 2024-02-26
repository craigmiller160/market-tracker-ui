const getPageTitle = () => cy.get('.watchlists-page h2');
const getAddButton = () => cy.get('.watchlists-page .root-actions button');

export const watchlistPage = {
	getPageTitle,
	getAddButton
};
