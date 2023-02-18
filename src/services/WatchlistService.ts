import { ajaxApi, getResponseData } from './AjaxApi';
import { DbWatchlist, Watchlist } from '../types/Watchlist';
import { pipe } from 'fp-ts/es6/function';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import { TaskTryT } from '@craigmiller160/ts-functions/es/types';

export const getAllWatchlists = (): TaskTryT<ReadonlyArray<DbWatchlist>> =>
	pipe(
		ajaxApi.get<ReadonlyArray<DbWatchlist>>({
			uri: '/watchlists/all'
		}),
		TaskEither.map(getResponseData)
	);

export const renameWatchlist = (
	oldName: string,
	newName: string
): TaskTryT<unknown> => {
	const encodedOldName = encodeURIComponent(oldName);
	const encodedNewName = encodeURIComponent(newName);
	return ajaxApi.put<void, void>({
		uri: `/watchlists/${encodedOldName}/rename/${encodedNewName}`
	});
};

export const addStockToWatchlist = (
	watchlistName: string,
	stockSymbol: string
): TaskTryT<DbWatchlist> => {
	const encodedWatchlistName = encodeURIComponent(watchlistName);
	const encodedStockSymbol = encodeURIComponent(stockSymbol);
	return pipe(
		ajaxApi.put<DbWatchlist, void>({
			uri: `/watchlists/${encodedWatchlistName}/stock/${encodedStockSymbol}`
		}),
		TaskEither.map(getResponseData)
	);
};

export const createWatchlist = (
	watchlistName: string,
	stockSymbol?: string
): TaskTryT<DbWatchlist> => {
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
	return pipe(
		ajaxApi.post<DbWatchlist, Watchlist>({
			uri: '/watchlists',
			body: input
		}),
		TaskEither.map(getResponseData)
	);
};

export const getWatchlistNames = (): TaskTryT<ReadonlyArray<string>> =>
	pipe(
		ajaxApi.get<ReadonlyArray<string>>({
			uri: '/watchlists/names'
		}),
		TaskEither.map(getResponseData)
	);

export const removeStockFromWatchlist = (
	watchlistName: string,
	stockSymbol: string
): TaskTryT<DbWatchlist> => {
	const encodedWatchlistName = encodeURIComponent(watchlistName);
	const encodedStockSymbol = encodeURIComponent(stockSymbol);
	return pipe(
		ajaxApi.delete<DbWatchlist>({
			uri: `/watchlists/${encodedWatchlistName}/stock/${encodedStockSymbol}`
		}),
		TaskEither.map(getResponseData)
	);
};

export const removeWatchlist = (watchlistName: string): TaskTryT<unknown> => {
	const encodedWatchlistName = encodeURIComponent(watchlistName);
	return ajaxApi.delete<unknown>({
		uri: `/watchlists/${encodedWatchlistName}`
	});
};
