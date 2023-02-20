import {
	QueryClient,
	useMutation,
	useQuery,
	useQueryClient
} from '@tanstack/react-query';
import {
	getAllWatchlists,
	renameWatchlist
} from '../services/WatchlistService';

export const GET_ALL_WATCHLISTS_KEY = 'WatchlistQueries_GetAllWatchlists';
export const GET_WATCHLIST_NAMES_KEY = 'WatchlistQueries_GetWatchlistNames';

const invalidateQueries = (queryClient: QueryClient) =>
	Promise.all([
		queryClient.invalidateQueries([GET_WATCHLIST_NAMES_KEY]),
		queryClient.invalidateQueries([GET_ALL_WATCHLISTS_KEY])
	]);

export const useGetAllWatchlists = () =>
	useQuery({
		queryKey: [GET_ALL_WATCHLISTS_KEY],
		queryFn: getAllWatchlists
	});

type RenameWatchlistParams = {
	readonly oldName: string;
	readonly newName: string;
};

export const useRenameWatchlist = () => {
	const queryClient = useQueryClient();
	useMutation<unknown, Error, RenameWatchlistParams>({
		mutationFn: ({ oldName, newName }) => renameWatchlist(oldName, newName),
		onSuccess: () => invalidateQueries(queryClient)
	});
};
