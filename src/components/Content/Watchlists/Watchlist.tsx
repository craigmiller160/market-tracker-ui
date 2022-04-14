import { WatchlistItem } from '../../../types/Watchlist';

interface Props {
	readonly stocks: ReadonlyArray<WatchlistItem>;
	readonly cryptos: ReadonlyArray<WatchlistItem>;
}

export const Watchlist = (props: Props) => <h3>The Watchlist</h3>;
