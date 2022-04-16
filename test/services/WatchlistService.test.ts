import { DbWatchlist } from '../../src/types/Watchlist';
import * as WatchlistService from '../../src/services/WatchlistService';
import '@relmify/jest-fp-ts';
import MockAdapter from 'axios-mock-adapter';
import { ajaxApi } from '../../src/services/AjaxApi';

const watchlists: ReadonlyArray<DbWatchlist> = [
	{
		_id: '1',
		userId: 2,
		watchlistName: 'Watchlist',
		stocks: [],
		cryptos: []
	},
	{
		_id: '2',
		userId: 2,
		watchlistName: 'Watchlist2',
		stocks: [],
		cryptos: []
	}
];

const mockApi = new MockAdapter(ajaxApi.instance);

describe('WatchlistService', () => {
	beforeEach(() => {
		mockApi.reset();
	});

	it('getAllWatchlists', async () => {
		mockApi.onGet('/watchlists/all').reply(200, watchlists);
		const result = await WatchlistService.getAllWatchlists()();
		expect(result).toEqualRight(watchlists);
	});

	it('renameWatchlist', async () => {
		mockApi
			.onPut('/watchlists/First%20Watchlist/rename/NewWatchlist')
			.reply(200);
		const result = await WatchlistService.renameWatchlist(
			'First Watchlist',
			'NewWatchlist'
		)();
		expect(result).toBeRight();
	});
});
