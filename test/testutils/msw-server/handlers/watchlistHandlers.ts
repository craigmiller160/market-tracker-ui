import { type Database, ensureDbRecord } from '../Database';
import { type RequestHandler, http, HttpResponse, type PathParams } from 'msw';
import type { Watchlist } from '../../../../src/types/Watchlist';
import { castDraft } from 'immer';

export const createWatchlistHandlers = (
	database: Database
): ReadonlyArray<RequestHandler> => {
	const getWatchlistNamesHandler = http.get(
		'http://localhost/market-tracker/api/watchlists/names',
		() => {
			const names = database.data.watchlists.map(
				(watchlist) => watchlist.watchlistName
			);
			return HttpResponse.json(names);
		}
	);

	const createWatchlistHandler = http.post<PathParams, Watchlist>(
		'http://localhost/market-tracker/api/watchlists',
		async ({ request }) => {
			const body = await request.json();
			const dbWatchlist = ensureDbRecord(body);
			database.updateData((draft) => {
				draft.watchlists.push(castDraft(dbWatchlist));
			});
			return HttpResponse.json(dbWatchlist);
		}
	);

	const getAllWatchlistsHandler = http.get(
		'http://localhost/market-tracker/api/watchlists/all',
		() => {
			return HttpResponse.json(database.data.watchlists);
		}
	);

	return [
		getWatchlistNamesHandler,
		createWatchlistHandler,
		getAllWatchlistsHandler
	];
};
