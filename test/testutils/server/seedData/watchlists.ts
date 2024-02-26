import { type DataUpdater, ensureDbUserRecord } from '../Database';
import { type Watchlist } from '../../../../src/types/Watchlist';
import { castDraft } from 'immer';

export const seedWatchlists: DataUpdater = (draft) => {
	draft.watchlists = castDraft([
		ensureDbUserRecord<Watchlist>({
			watchlistName: 'First Watchlist',
			stocks: [
				{
					symbol: 'VTI'
				},
				{
					symbol: 'VOO'
				}
			],
			cryptos: []
		}),
		ensureDbUserRecord<Watchlist>({
			watchlistName: 'Second Watchlist',
			stocks: [
				{
					symbol: 'AAPL'
				},
				{
					symbol: 'GOOG'
				}
			],
			cryptos: []
		})
	]);
};
