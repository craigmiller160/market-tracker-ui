const getPageTitle = () => cy.get('.WatchlistsPage h2');
const getAddButton = () => cy.get('.WatchlistsPage .RootActions button');

export const watchlistPage = {
	getPageTitle,
	getAddButton
};
