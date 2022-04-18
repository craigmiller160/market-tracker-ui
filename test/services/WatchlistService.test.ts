import { DbWatchlist, Watchlist } from '../../src/types/Watchlist';
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

	it('addStockToWatchlist', async () => {
		const newWatchlist: DbWatchlist = {
			...watchlists[0],
			stocks: [
				{
					symbol: 'VTI'
				}
			]
		};
		mockApi
			.onPut('/watchlists/First%20Watchlist/stock/VTI')
			.reply(200, newWatchlist);
		const result = await WatchlistService.addStockToWatchlist(
			'First Watchlist',
			'VTI'
		)();
		expect(result).toEqualRight(newWatchlist);
	});

	it('getWatchlistNames', async () => {
		mockApi.onGet('/watchlists/names').reply(200, ['One', 'Two']);
		const result = await WatchlistService.getWatchlistNames()();
		expect(result).toEqualRight(['One', 'Two']);
	});

	it('createWatchlist with stock', async () => {
		const watchlistName = 'MyWatchlist';
		const symbol = 'VTI';
		const body: Watchlist = {
			watchlistName,
			stocks: [{ symbol }],
			cryptos: []
		};
		const response: DbWatchlist = {
			...body,
			userId: 1,
			_id: '2'
		};
		mockApi.onPost('/watchlists', body).reply(200, response);

		const result = await WatchlistService.createWatchlist(
			watchlistName,
			symbol
		)();
		expect(result).toEqualRight(response);
	});

	it('createWatchlist without stock', async () => {
		const watchlistName = 'MyWatchlist';
		const body: Watchlist = {
			watchlistName,
			stocks: [],
			cryptos: []
		};
		const response: DbWatchlist = {
			...body,
			userId: 1,
			_id: '2'
		};
		mockApi.onPost('/watchlists', body).reply(200, response);

		const result = await WatchlistService.createWatchlist(watchlistName)();
		expect(result).toEqualRight(response);
	});

	it('removeStockFromWatchlist', async () => {
		const newWatchlist: DbWatchlist = {
			...watchlists[0],
			stocks: []
		};
		mockApi
			.onDelete('/watchlists/First%20Watchlist/stock/VTI')
			.reply(200, newWatchlist);
		const result = await WatchlistService.removeStockFromWatchlist(
			'First Watchlist',
			'VTI'
		)();
		expect(result).toEqualRight(newWatchlist);
	});

	it('removeWatchlist', async () => {
		mockApi.onDelete('/watchlists/First%20Watchlist').reply(200);
		const result = await WatchlistService.removeWatchlist(
			'First Watchlist'
		)();
		expect(result).toBeRight();
	});
});
