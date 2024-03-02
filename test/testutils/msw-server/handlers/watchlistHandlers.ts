import { type Database, ensureDbUserRecord } from '../Database';
import { http, HttpResponse, type PathParams, type RequestHandler } from 'msw';
import type { Watchlist } from '../../../../src/types/Watchlist';
import { castDraft } from 'immer';
import { InvestmentType } from '../../../../src/types/data/InvestmentType';
import { validationError } from '../utils/validate';

type RenameWatchlistParams = Readonly<{
	oldName: string;
	newName: string;
}>;

type AddInvestmentToWatchlistParams = Readonly<{
	name: string;
	type: InvestmentType;
	symbol: string;
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

	const addInvestmentToWatchlistHandler =
		http.put<AddInvestmentToWatchlistParams>(
			'http://localhost/market-tracker/api/watchlists/:name/:type/:symbol',
			({ params }) => {
				if (params.type === InvestmentType.CRYPTO) {
					return validationError(
						'Crypto not yet supported for add/remove investments'
					);
				}

				const watchlistIndex = database.data.watchlists.findIndex(
					(watchlist) => watchlist.watchlistName === params.name
				);
				if (watchlistIndex < 0) {
					return validationError(
						`Invalid watchlist name: ${params.name}`
					);
				}

				if (
					database.data.watchlists[watchlistIndex].stocks.findIndex(
						(stock) => stock.symbol === params.symbol
					) >= 0
				) {
					return validationError(
						`Investment already in watchlist. Watchlist ${params.name} Type: ${params.type} Symbol: ${params.symbol}`
					);
				}

				database.updateData((draft) => {
					draft.watchlists[watchlistIndex].stocks.push({
						symbol: params.symbol
					});
				});
				return HttpResponse.json(
					database.data.watchlists[watchlistIndex]
				);
			}
		);

	return [
		getWatchlistNamesHandler,
		createWatchlistHandler,
		getAllWatchlistsHandler,
		renameWatchlistHandler,
		addInvestmentToWatchlistHandler
	];
};
