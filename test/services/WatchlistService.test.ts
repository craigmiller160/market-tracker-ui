import { Watchlist } from '../../src/types/Watchlist';
import { ajaxApi } from '../../src/services/AjaxApi';
import MockAdapter from 'axios-mock-adapter';
import * as WatchlistService from '../../src/services/WatchlistService';
import '@relmify/jest-fp-ts';

const watchlists: ReadonlyArray<Watchlist> = [
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
});
