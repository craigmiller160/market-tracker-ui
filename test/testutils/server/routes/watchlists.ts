import { Server } from 'miragejs/server';
import { Response } from 'miragejs';
import { Database } from '../Database';

interface RenameWatchlistParams {
	readonly oldName: string;
	readonly newName: string;
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
};
