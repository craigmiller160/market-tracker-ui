import { createServer } from 'miragejs';
import { Server } from 'miragejs/server';
import { Database } from './Database';
import { createWatchlistRoutes } from './routes/watchlists';
import { seedWatchlists } from './seedData/watchlists';
import * as Option from 'fp-ts/es6/Option';

export interface ApiServer {
	readonly server: Server;
	readonly database: Database;
	readonly authenticate: () => void;
}

const createAuthenticate = (database: Database) => () =>
	database.updateData((draft) => {
		draft.authUser = Option.some({
			userId: 1
		});
	});

export const newApiServer = (): ApiServer => {
	const database = new Database();
	database.updateData((draft) => {
		seedWatchlists(draft);
	});

	const server: Server = createServer({
		routes() {
			this.namespace = '/market-tracker/api';

			createWatchlistRoutes(database, this);
		}
	});
	return {
		server,
		database,
		authenticate: createAuthenticate(database)
	};
};
