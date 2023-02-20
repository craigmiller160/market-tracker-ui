import { ajaxApi, getResponseData } from './AjaxApi';
import { DbWatchlist, Watchlist } from '../types/Watchlist';

export const getAllWatchlists = (): Promise<ReadonlyArray<DbWatchlist>> =>
	ajaxApi
		.get<ReadonlyArray<DbWatchlist>>({
			uri: '/watchlists/all'
		})
		.then(getResponseData);

export const renameWatchlist = (
	oldName: string,
	newName: string
): Promise<unknown> => {
	const encodedOldName = encodeURIComponent(oldName);
	const encodedNewName = encodeURIComponent(newName);
	return ajaxApi
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
	return ajaxApi
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
	return ajaxApi
		.post<DbWatchlist, Watchlist>({
			uri: '/watchlists',
			body: input
		})
		.then(getResponseData);
};

export const getWatchlistNames = (): Promise<ReadonlyArray<string>> =>
	ajaxApi
		.get<ReadonlyArray<string>>({
			uri: '/watchlists/names'
		})
		.then(getResponseData);

export const removeStockFromWatchlist = (
	watchlistName: string,
	stockSymbol: string
): Promise<DbWatchlist> => {
	const encodedWatchlistName = encodeURIComponent(watchlistName);
	const encodedStockSymbol = encodeURIComponent(stockSymbol);
	return ajaxApi
		.delete<DbWatchlist>({
			uri: `/watchlists/${encodedWatchlistName}/stock/${encodedStockSymbol}`
		})
		.then(getResponseData);
};

export const removeWatchlist = (watchlistName: string): Promise<unknown> => {
	const encodedWatchlistName = encodeURIComponent(watchlistName);
	return ajaxApi
		.delete<unknown>({
			uri: `/watchlists/${encodedWatchlistName}`
		})
		.then(getResponseData);
};
