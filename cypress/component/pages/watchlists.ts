const getPageTitle = () => cy.get('.WatchlistsPage h1');
const getAddButton = () => cy.get('.WatchlistsPage .RootActions button');

export const watchlistPage = {
	getPageTitle,
	getAddButton
};
