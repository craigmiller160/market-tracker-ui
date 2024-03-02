import type { Database } from '../Database';
import { type RequestHandler, http, HttpResponse } from 'msw';

export const createWatchlistHandlers = (
	database: Database
): ReadonlyArray<RequestHandler> => {
	const watchlistNamesHandler = http.get(
		'http://localhost/market-tracker/api/watchlists/names',
		() => {
			const names = database.data.watchlists.map(
				(watchlist) => watchlist.watchlistName
			);
			return HttpResponse.json(names);
		}
	);

	return [watchlistNamesHandler];
};
