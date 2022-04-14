import { ajaxApi } from './AjaxApi';
import { Watchlist } from '../types/Watchlist';

export const getAllWatchlists = () =>
	ajaxApi.get<ReadonlyArray<Watchlist>>({
		uri: '/watchlists/all'
	});
