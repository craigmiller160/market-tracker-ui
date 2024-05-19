const getAllWatchlists = () =>
    cy.intercept('/market-tracker/api/watchlists/all', {
        fixture: 'watchlists.json'
    });

const getWatchlistNames = () =>
    cy.intercept('/market-tracker/api/watchlists/names', {
        fixture: 'watchlistNames.json'
    });

const removeStockFromWatchlist = (stock: string, watchlist: string) =>
    cy
        .intercept(
            `/market-tracker/api/watchlists/${watchlist}/stock/${stock}`,
            {
                statusCode: 204
            }
        )
        .as(`removeStockFromWatchlist_${stock}_${watchlist}`);

export const watchlistApi = {
    getAllWatchlists,
    getWatchlistNames,
    removeStockFromWatchlist
};
