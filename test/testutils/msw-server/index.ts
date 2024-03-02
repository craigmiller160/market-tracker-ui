// eslint-disable-next-line import/no-unresolved
import { setupServer, SetupServerApi } from 'msw/node';
import { Database } from './Database';
import * as Option from 'fp-ts/Option';
import { nanoid } from '@reduxjs/toolkit';
import { seedWatchlists } from './seedData/watchlists';
import { seedTradier } from './seedData/tradier';
import { createOAuthHandlers } from './handlers/oauthHandlers';
import {createWatchlistHandlers} from './handlers/watchlistHandlers';

type ApiServerActions = Readonly<{
	clearDefaultUser: () => void;
}>;

export type ApiServer = Readonly<{
	server: SetupServerApi;
	database: Database;
	actions: ApiServerActions;
}>;

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

	const server: SetupServerApi = setupServer(
		...createOAuthHandlers(database),
		...createWatchlistHandlers(database)
	);
	return {
		server,
		database,
		actions: {
			clearDefaultUser: createClearDefaultUser(database)
		}
	};
};
