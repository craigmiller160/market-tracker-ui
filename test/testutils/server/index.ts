import { createServer, Model } from 'miragejs';
import { Server } from 'miragejs/server';
import { NanoidIdentityManager } from './NanoidIdentityManager';
import { ModelDefinition, Registry } from 'miragejs/-types';
import Schema from 'miragejs/orm/schema';

export interface Movie extends ModelDefinition<Movie> {
	readonly title: string;
}

type AppRegistry = Registry<{ movies: Movie }, Record<string, any>>;
type AppSchema = Schema<AppRegistry>;

export const newTestServer = (): Server =>
	createServer({
		identityManagers: new NanoidIdentityManager(),
		models: {
			movies: Model
		},
		seeds(server: Server<AppRegistry>) {
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
			this.get('/movies', (schema: AppSchema) => schema.db.movies);
			this.post('/movies', (schema: AppSchema, request) => {
				const movie = JSON.parse(request.requestBody);
				return schema.db.movies.insert(movie);
			});
		}
	});
