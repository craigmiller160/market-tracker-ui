import { createServer } from 'miragejs';
import { Server } from 'miragejs/server';
import { Database } from './Database';
import { createWatchlistRoutes } from './routes/watchlists';

export interface ApiServer {
	readonly server: Server;
	readonly database: Database;
}

export const newApiServer = (): ApiServer => {
	const database = new Database();
	const server: Server = createServer({
		routes() {
			this.namespace = '/market-tracker/api';

			createWatchlistRoutes(database, this);
		}
	});
	return {
		server,
		database
	};
};
