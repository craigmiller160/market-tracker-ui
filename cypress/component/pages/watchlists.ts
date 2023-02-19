const getPageTitle = () => cy.get('.WatchlistsPage h1');
const getAddButton = () => cy.get('.WatchlistsPage .RootActions button');

const getInvestmentCards = () => cy.get('.InvestmentCard');
export const watchlistPage = {
	getPageTitle,
	getAddButton,
	getInvestmentCards
};
