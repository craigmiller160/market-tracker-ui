import { ajaxApi, getResponseData } from './AjaxApi';
import { Watchlist } from '../types/Watchlist';
import { pipe } from 'fp-ts/es6/function';
import * as TaskEither from 'fp-ts/es6/TaskEither';

export const getAllWatchlists = () =>
	pipe(
		ajaxApi.get<ReadonlyArray<Watchlist>>({
			uri: '/watchlists/all'
		}),
		TaskEither.map(getResponseData)
	);
