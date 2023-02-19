const getAllWatchlists = () =>
	cy.intercept('/market-tracker/api/watchlists/all', {
		fixture: 'watchlists.json'
	});

export const watchlistApi = {
	getAllWatchlists
};
