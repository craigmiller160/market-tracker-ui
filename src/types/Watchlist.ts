import { type DbRecord, type UserRecord } from './db';

export interface WatchlistItem {
    readonly symbol: string;
}

export interface Watchlist {
    readonly watchlistName: string;
    readonly stocks: ReadonlyArray<WatchlistItem>;
    readonly cryptos: ReadonlyArray<WatchlistItem>;
}

export type DbWatchlist = Watchlist & DbRecord & UserRecord;
