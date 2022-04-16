import { ajaxApi, getResponseData } from './AjaxApi';
import { DbWatchlist } from '../types/Watchlist';
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
		ajaxApi.put<void, DbWatchlist>({
			uri: `/watchlists/${encodedWatchlistName}/stock/${encodedStockSymbol}`
		}),
		TaskEither.map(getResponseData)
	);
};
