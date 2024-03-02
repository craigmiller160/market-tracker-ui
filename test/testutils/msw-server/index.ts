// eslint-disable-next-line import/no-unresolved
import { setupServer, SetupServerApi } from 'msw/node';
import { Database } from './Database';
import * as Option from 'fp-ts/Option';
import { nanoid } from '@reduxjs/toolkit';
import { seedWatchlists } from './seedData/watchlists';
import { seedTradier } from './seedData/tradier';
import { createOAuthHandlers } from './handlers/oauthHandlers';
import { createWatchlistHandlers } from './handlers/watchlistHandlers';
import { createTradierHandlers } from './handlers/tradierHandlers';
import {createPortfolioHandlers} from './handlers/portfolioHandlers';

type ApiServerActions = Readonly<{
	clearDefaultUser: () => void;
	startServer: () => void;
	resetServer: () => void;
	stopServer: () => void;
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

const setInitialData = (database: Database) =>
	database.updateData((draft) => {
		draft.authUser = Option.some({
			userId: nanoid()
		});
		seedWatchlists(draft);
		seedTradier(draft);
	});

export const newApiServer = (): ApiServer => {
	const database = new Database();
	setInitialData(database);

	const server: SetupServerApi = setupServer(
		...createOAuthHandlers(database),
		...createWatchlistHandlers(database),
		...createTradierHandlers(database),
		...createPortfolioHandlers()
	);
	return {
		server,
		database,
		actions: {
			clearDefaultUser: createClearDefaultUser(database),
			resetServer: () => setInitialData(database),
			startServer: () => server.listen({ onUnhandledRequest: 'error' }),
			stopServer: () => server.close()
		}
	};
};
