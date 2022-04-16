import { DbWatchlist } from '../../src/types/Watchlist';
import * as WatchlistService from '../../src/services/WatchlistService';
import '@relmify/jest-fp-ts';
import { ApiServer, newApiServer } from '../testutils/server';

describe('WatchlistService', () => {
	let apiServer: ApiServer;
	let seedWatchlists: ReadonlyArray<DbWatchlist>;
	beforeEach(() => {
		apiServer = newApiServer();
		seedWatchlists = apiServer.database.data.watchlists;
	});

	afterEach(() => {
		apiServer.server.shutdown();
	});

	it('getAllWatchlists', async () => {
		const result = await WatchlistService.getAllWatchlists()();
		expect(result).toEqualRight(seedWatchlists);
	});

	it('renameWatchlist', async () => {
		const result = await WatchlistService.renameWatchlist(
			'First Watchlist',
			'NewWatchlist'
		)();
		expect(result).toBeRight();
		const firstWatchlist = apiServer.database.data.watchlists[0];
		expect(firstWatchlist).toEqual({
			...seedWatchlists[0],
			watchlistName: 'NewWatchlist'
		});
	});
});
