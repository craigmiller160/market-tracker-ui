import { ajaxApi, getResponseData } from './AjaxApi';
import { DbWatchlist } from '../types/Watchlist';
import { pipe } from 'fp-ts/es6/function';
import * as TaskEither from 'fp-ts/es6/TaskEither';

export const getAllWatchlists = () =>
	pipe(
		ajaxApi.get<ReadonlyArray<DbWatchlist>>({
			uri: '/watchlists/all'
		}),
		TaskEither.map(getResponseData)
	);

export const renameWatchlist = (oldName: string, newName: string) =>
	pipe(
		ajaxApi.put<void, void>({
			uri: `/watchlists/${oldName}/rename/${newName}`
		})
	);
