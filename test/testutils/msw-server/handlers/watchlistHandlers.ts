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

type WatchlistInvestmentParams = Readonly<{
	name: string;
	type: InvestmentType;
	symbol: string;
}>;

type DeleteWatchlistParams = Readonly<{
	name: string;
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

	const addInvestmentToWatchlistHandler = http.put<WatchlistInvestmentParams>(
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
			return HttpResponse.json(database.data.watchlists[watchlistIndex]);
		}
	);

	const deleteWatchlistHandler = http.delete<DeleteWatchlistParams>(
		'http://localhost/market-tracker/api/watchlists/:name',
		({ params }) => {
			database.updateData((draft) => {
				draft.watchlists = draft.watchlists.filter(
					(watchlist) => watchlist.watchlistName !== params.name
				);
			});
			return HttpResponse.text('', {
				status: 204
			});
		}
	);

	const removeInvestmentFromWatchlistHandler =
		http.delete<WatchlistInvestmentParams>(
			'http://localhost/market-tracker/api/watchlists/:name/:type/:symbol',
			({ params }) => {
				if (params.type === InvestmentType.CRYPTO) {
					return validationError(
						'Crypto not yet supported for removing investments'
					);
				}

				database.updateData((draft) => {
					const foundIndex = draft.watchlists.findIndex(
						(watchlist) => watchlist.watchlistName === params.name
					);
					if (foundIndex >= 0) {
						draft.watchlists[foundIndex].stocks = draft.watchlists[
							foundIndex
						].stocks.filter(
							(stock) => stock.symbol !== params.symbol
						);
					}
				});
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				const match = database.data.watchlists.find(
					(watchlist) => watchlist.watchlistName === params.name
				)!;
				return HttpResponse.json(match);
			}
		);

	return [
		getWatchlistNamesHandler,
		createWatchlistHandler,
		getAllWatchlistsHandler,
		renameWatchlistHandler,
		addInvestmentToWatchlistHandler,
		deleteWatchlistHandler,
		removeInvestmentFromWatchlistHandler
	];
};
