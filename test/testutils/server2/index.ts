import { createServer } from 'miragejs';
import { Server } from 'miragejs/server';
import { Database } from './Database';

export const newApiServer = (): Server => {
	const database = new Database();
	return createServer({
		routes() {
			this.namespace = '/market-tracker/api';

			this.get('/watchlists/all', () => database.data.watchlists);
		}
	});
};
