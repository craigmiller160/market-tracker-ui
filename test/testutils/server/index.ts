import { createServer } from 'miragejs';
import { Server } from 'miragejs/server';
import { Database } from './Database';
import { createWatchlistRoutes } from './routes/watchlists';
import { seedWatchlists } from './seedData/watchlists';
import * as Option from 'fp-ts/Option';
import { createOAuthRoutes } from './routes/oauth';
import { createTradierRoutes } from './routes/tradier';
import { seedTradier } from './seedData/tradier';
import { nanoid } from '@reduxjs/toolkit';

interface ApiServerActions {
	readonly clearDefaultUser: () => void;
}

export interface ApiServer {
	readonly server: Server;
	readonly database: Database;
	readonly actions: ApiServerActions;
}

const createClearDefaultUser = (database: Database) => () =>
	database.updateData((draft) => {
		draft.authUser = Option.none;
	});

export const newApiServer = (): ApiServer => {
	const database = new Database();
	database.updateData((draft) => {
		draft.authUser = Option.some({
			userId: nanoid()
		});
		seedWatchlists(draft);
		seedTradier(draft);
	});

	const server: Server = createServer({
		routes() {
			this.namespace = '/market-tracker/api';
			createOAuthRoutes(database, this);
			createWatchlistRoutes(database, this);
			createTradierRoutes(database, this);
		}
	});
	return {
		server,
		database,
		actions: {
			clearDefaultUser: createClearDefaultUser(database)
		}
	};
};
