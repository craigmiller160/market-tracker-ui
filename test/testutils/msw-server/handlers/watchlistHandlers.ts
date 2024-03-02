import { type Database, ensureDbUserRecord } from '../Database';
import { type RequestHandler, http, HttpResponse, type PathParams } from 'msw';
import type { Watchlist } from '../../../../src/types/Watchlist';
import { castDraft } from 'immer';

type RenameWatchlistParams = Readonly<{
	oldName: string;
	newName: string;
}>;

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
			const dbWatchlist = ensureDbUserRecord(body);
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

	const renameWatchlistHandler = http.put<RenameWatchlistParams>(
		'http://localhost/market-tracker/api/watchlists/:oldName/rename/:newName',
		({ params }) => {
			const existingIndex = database.data.watchlists.findIndex(
				(watchlist) => watchlist.watchlistName === params.oldName
			);
			if (existingIndex >= 0) {
				database.updateData((draft) => {
					draft.watchlists[existingIndex] = {
						...draft.watchlists[existingIndex],
						watchlistName: params.newName
					};
				});
				return HttpResponse.text('', {
					status: 204
				});
			}
			return HttpResponse.text('', {
				status: 400
			});
		}
	);

	return [
		getWatchlistNamesHandler,
		createWatchlistHandler,
		getAllWatchlistsHandler,
		renameWatchlistHandler
	];
};
