import { Response, Server } from 'miragejs';
import { Database, ensureDbUserRecord } from '../Database';
import { validationError } from '../utils/validate';
import { type DbWatchlist, type Watchlist } from '../../../../src/types/Watchlist';
import { castDraft } from 'immer';

interface RenameWatchlistParams {
	readonly oldName: string;
	readonly newName: string;
}

type InvestmentType = 'stock' | 'crypto';

interface ModifyInvestmentParams {
	readonly name: string;
	readonly type: InvestmentType;
	readonly symbol: string;
}

interface RemoveWatchlistParams {
	readonly name: string;
}

interface RemoveInvestmentParams {
	readonly name: string;
	readonly type: InvestmentType;
	readonly symbol: string;
}

export const createWatchlistRoutes = (database: Database, server: Server) => {
	server.get('/watchlists/names', () =>
		database.data.watchlists.map((watchlist) => watchlist.watchlistName)
	);
	server.post('/watchlists', (schema, request) => {
		const watchlist: Watchlist = JSON.parse(
			request.requestBody
		) as Watchlist;
		const dbWatchlist: DbWatchlist = ensureDbUserRecord(watchlist);
		database.updateData((draft) => {
			draft.watchlists.push(castDraft(dbWatchlist));
		});
		return dbWatchlist;
	});
	server.get('/watchlists/all', () => database.data.watchlists);
	server.put('/watchlists/:oldName/rename/:newName', (schema, request) => {
		const params = request.params as unknown as RenameWatchlistParams;
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
			return new Response(204);
		}
		return new Response(400);
	});
	server.put('/watchlists/:name/:type/:symbol', (schema, request) => {
		const params = request.params as unknown as ModifyInvestmentParams;
		if (params.type === 'crypto') {
			return validationError(
				'Crypto not yet supported for add/remove investments'
			);
		}

		const watchlistIndex = database.data.watchlists.findIndex(
			(watchlist) => watchlist.watchlistName === params.name
		);
		if (watchlistIndex < 0) {
			return validationError(`Invalid watchlist name: ${params.name}`);
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
		return database.data.watchlists[watchlistIndex];
	});
	server.delete('/watchlists/:name', (schema, request) => {
		const removeWatchlistParams =
			request.params as unknown as RemoveWatchlistParams;
		database.updateData((draft) => {
			draft.watchlists = draft.watchlists.filter(
				(watchlist) =>
					watchlist.watchlistName !== removeWatchlistParams.name
			);
		});
		return new Response(204);
	});
	server.delete('/watchlists/:name/:type/:symbol', (schema, request) => {
		const removeInvestmentParams =
			request.params as unknown as RemoveInvestmentParams;
		if (removeInvestmentParams.type === 'crypto') {
			return validationError(
				'Crypto not yet supported for removing investments'
			);
		}
		database.updateData((draft) => {
			const foundIndex = draft.watchlists.findIndex(
				(watchlist) =>
					watchlist.watchlistName === removeInvestmentParams.name
			);
			if (foundIndex >= 0) {
				draft.watchlists[foundIndex].stocks = draft.watchlists[
					foundIndex
				].stocks.filter(
					(stock) => stock.symbol !== removeInvestmentParams.symbol
				);
			}
		});
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return database.data.watchlists.find(
			(watchlist) =>
				watchlist.watchlistName === removeInvestmentParams.name
		)!;
	});
};
