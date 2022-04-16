import { Server } from 'miragejs/server';
import { Response } from 'miragejs';
import { Database } from '../Database';
import { validationError } from '../utils/validate';

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

export const createWatchlistRoutes = (database: Database, server: Server) => {
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
};
