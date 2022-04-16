import { DbWatchlist } from '../../src/types/Watchlist';
import { ajaxApi } from '../../src/services/AjaxApi';
import MockAdapter from 'axios-mock-adapter';
import * as WatchlistService from '../../src/services/WatchlistService';
import '@relmify/jest-fp-ts';
import { nanoid } from '@reduxjs/toolkit';
import { ApiServer, newApiServer } from '../testutils/server2';

const watchlists: ReadonlyArray<DbWatchlist> = [
	{
		_id: nanoid(),
		userId: 2,
		watchlistName: 'Watchlist',
		stocks: [],
		cryptos: []
	},
	{
		_id: nanoid(),
		userId: 2,
		watchlistName: 'Watchlist2',
		stocks: [],
		cryptos: []
	}
];

const mockApi = new MockAdapter(ajaxApi.instance);

describe('WatchlistService', () => {
	let apiServer: ApiServer;
	beforeEach(() => {
		apiServer = newApiServer();
		mockApi.reset();
	});

	afterEach(() => {
		apiServer.shutdown;
	});

	it('getAllWatchlists', async () => {
		mockApi.onGet('/watchlists/all').reply(200, watchlists);
		const result = await WatchlistService.getAllWatchlists()();
		expect(result).toEqualRight(watchlists);
	});

	it('renameWatchlist', async () => {
		mockApi.onPut('/watchlists/old/rename/new').reply(204);
		const result = await WatchlistService.renameWatchlist('old', 'new')();
		expect(result).toBeRight();
	});
});
