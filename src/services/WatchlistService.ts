import { marketTrackerApi, getResponseData } from './AjaxApi';
import { type DbWatchlist, type Watchlist } from '../types/Watchlist';

export const getAllWatchlists = (
    signal?: AbortSignal
): Promise<ReadonlyArray<DbWatchlist>> =>
    marketTrackerApi
        .get<ReadonlyArray<DbWatchlist>>({
            uri: '/watchlists/all',
            config: {
                signal
            }
        })
        .then(getResponseData);

export const renameWatchlist = (
    oldName: string,
    newName: string
): Promise<unknown> => {
    const encodedOldName = encodeURIComponent(oldName);
    const encodedNewName = encodeURIComponent(newName);
    return marketTrackerApi
        .put<void, void>({
            uri: `/watchlists/${encodedOldName}/rename/${encodedNewName}`
        })
        .then(getResponseData);
};

export const addStockToWatchlist = (
    watchlistName: string,
    stockSymbol: string
): Promise<DbWatchlist> => {
    const encodedWatchlistName = encodeURIComponent(watchlistName);
    const encodedStockSymbol = encodeURIComponent(stockSymbol);
    return marketTrackerApi
        .put<DbWatchlist, void>({
            uri: `/watchlists/${encodedWatchlistName}/stock/${encodedStockSymbol}`
        })
        .then(getResponseData);
};

export const createWatchlist = (
    watchlistName: string,
    stockSymbol?: string
): Promise<DbWatchlist> => {
    const stocks = stockSymbol
        ? [
              {
                  symbol: stockSymbol
              }
          ]
        : [];
    const input: Watchlist = {
        watchlistName,
        stocks,
        cryptos: []
    };
    return marketTrackerApi
        .post<DbWatchlist, Watchlist>({
            uri: '/watchlists',
            body: input
        })
        .then(getResponseData);
};

export const getWatchlistNames = (
    signal?: AbortSignal
): Promise<ReadonlyArray<string>> =>
    marketTrackerApi
        .get<ReadonlyArray<string>>({
            uri: '/watchlists/names',
            config: {
                signal
            }
        })
        .then(getResponseData);

export const removeStockFromWatchlist = (
    watchlistName: string,
    stockSymbol: string
): Promise<DbWatchlist> => {
    const encodedWatchlistName = encodeURIComponent(watchlistName);
    const encodedStockSymbol = encodeURIComponent(stockSymbol);
    return marketTrackerApi
        .delete<DbWatchlist>({
            uri: `/watchlists/${encodedWatchlistName}/stock/${encodedStockSymbol}`
        })
        .then(getResponseData);
};

export const removeWatchlist = (watchlistName: string): Promise<unknown> => {
    const encodedWatchlistName = encodeURIComponent(watchlistName);
    return marketTrackerApi
        .delete<unknown>({
            uri: `/watchlists/${encodedWatchlistName}`
        })
        .then(getResponseData);
};
