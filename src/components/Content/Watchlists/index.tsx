import { useImmer } from 'use-immer';
import { DbWatchlist } from '../../../types/Watchlist';

interface State {
	readonly loading: boolean;
	readonly watchlists: ReadonlyArray<DbWatchlist>;
	readonly renameWatchlistId?: string;
	readonly confirmModal: {
		readonly show: boolean;
		readonly message: string;
		readonly watchlistName: string;
		readonly symbol?: string;
	};
	readonly inputModal: {
		readonly show: boolean;
	};
}

export const Watchlists = () => {
	const [state, setState] = useImmer<State>({
		loading: true,
		watchlists: [],
		confirmModal: {
			show: false,
			message: '',
			watchlistName: ''
		},
		inputModal: {
			show: false
		}
	});

	return <h1>Hello World</h1>;
};
