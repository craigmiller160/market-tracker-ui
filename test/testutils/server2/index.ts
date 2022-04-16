import { createServer } from 'miragejs';
import { Server } from 'miragejs/server';
import { Database } from './Database';

export interface ApiServer {
	readonly server: Server;
	readonly shutdown: () => void;
	readonly database: Database;
}

export const newApiServer = (): ApiServer => {
	const database = new Database();
	const server: Server = createServer({
		routes() {
			this.namespace = '/market-tracker/api';

			this.get('/watchlists/all', () => database.data.watchlists);
		}
	});
	return {
		server,
		database,
		shutdown: server.shutdown
	};
};
