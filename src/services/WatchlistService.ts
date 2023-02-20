import { ajaxApiFpTs, getResponseData } from './AjaxApi';
import { DbWatchlist, Watchlist } from '../types/Watchlist';
import { pipe } from 'fp-ts/es6/function';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import { TaskTryT } from '@craigmiller160/ts-functions/es/types';

export const getAllWatchlists = (): TaskTryT<ReadonlyArray<DbWatchlist>> =>
	pipe(
		ajaxApiFpTs.get<ReadonlyArray<DbWatchlist>>({
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
	return ajaxApiFpTs.put<void, void>({
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
		ajaxApiFpTs.put<DbWatchlist, void>({
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
		ajaxApiFpTs.post<DbWatchlist, Watchlist>({
			uri: '/watchlists',
			body: input
		}),
		TaskEither.map(getResponseData)
	);
};

export const getWatchlistNames = (): TaskTryT<ReadonlyArray<string>> =>
	pipe(
		ajaxApiFpTs.get<ReadonlyArray<string>>({
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
		ajaxApiFpTs.delete<DbWatchlist>({
			uri: `/watchlists/${encodedWatchlistName}/stock/${encodedStockSymbol}`
		}),
		TaskEither.map(getResponseData)
	);
};

export const removeWatchlist = (watchlistName: string): TaskTryT<unknown> => {
	const encodedWatchlistName = encodeURIComponent(watchlistName);
	return ajaxApiFpTs.delete<unknown>({
		uri: `/watchlists/${encodedWatchlistName}`
	});
};
