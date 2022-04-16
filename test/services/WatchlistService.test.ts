import { DbWatchlist, Watchlist } from '../../src/types/Watchlist';
import * as WatchlistService from '../../src/services/WatchlistService';
import '@relmify/jest-fp-ts';
import { ApiServer, newApiServer } from '../testutils/server2';
import { ensureDbUserRecord } from '../testutils/server2/Database';
import { castDraft } from 'immer';

// TODO move to special seed data in the server directly
const watchlists: ReadonlyArray<DbWatchlist> = [
	ensureDbUserRecord<Watchlist>({
		watchlistName: 'Watchlist',
		stocks: [],
		cryptos: []
	}),
	ensureDbUserRecord<Watchlist>({
		watchlistName: 'Watchlist2',
		stocks: [],
		cryptos: []
	})
];

describe('WatchlistService', () => {
	let apiServer: ApiServer;
	beforeEach(() => {
		apiServer = newApiServer();
		apiServer.database.updateData((draft) => {
			draft.watchlists = castDraft(watchlists);
		});
	});

	afterEach(() => {
		apiServer.server.shutdown();
	});

	it('getAllWatchlists', async () => {
		const result = await WatchlistService.getAllWatchlists()();
		expect(result).toEqualRight(watchlists);
	});

	it('renameWatchlist', async () => {
		const result = await WatchlistService.renameWatchlist(
			'Watchlist',
			'NewWatchlist'
		)();
		expect(result).toBeRight();
		const firstWatchlist = apiServer.database.data.watchlists[0];
		expect(firstWatchlist).toEqual({
			...watchlists[0],
			watchlistName: 'NewWatchlist'
		});
	});
});
