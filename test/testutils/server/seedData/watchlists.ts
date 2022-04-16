import { DataUpdater, ensureDbUserRecord } from '../Database';
import { Watchlist } from '../../../../src/types/Watchlist';
import { castDraft } from 'immer';

export const seedWatchlists: DataUpdater = (draft) => {
	draft.watchlists = castDraft([
		ensureDbUserRecord<Watchlist>({
			watchlistName: 'First Watchlist',
			stocks: [],
			cryptos: []
		}),
		ensureDbUserRecord<Watchlist>({
			watchlistName: 'Second Watchlist',
			stocks: [],
			cryptos: []
		})
	]);
};
