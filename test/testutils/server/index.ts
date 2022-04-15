import { createServer } from 'miragejs';
import { Server } from 'miragejs/server';
import { NanoidIdentityManager } from './NanoidIdentityManager';

export const newTestServer = (): Server =>
	createServer({
		identityManagers: new NanoidIdentityManager(),
		seeds(server) {
			server.db.loadData({
				movies: [
					{ title: 'LOTR' },
					{ title: 'Marvel' },
					{ title: 'Star Wars' }
				]
			});
		},
		routes() {
			this.namespace = '/market-tracker/api';

			// TODO how to properly type schema.db?
			this.get('/movies', (schema) => schema.db.movies);
			this.post('/movies', (schema, request) => {
				const movie = JSON.parse(request.requestBody);
				return schema.db.movies.insert(movie);
			});
		}
	});
