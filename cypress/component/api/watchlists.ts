const getAllWatchlists = () =>
	cy.intercept('/market-tracker/api/watchlists/all', {
		fixture: 'watchlists.json'
	});

const getWatchlistNames = () =>
	cy.intercept('/market-tracker/api/watchlists/names', {
		fixture: 'watchlistNames.json'
	});

export const watchlistApi = {
	getAllWatchlists,
	getWatchlistNames
};
