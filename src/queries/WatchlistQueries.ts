import {
	QueryClient,
	useMutation,
	useQuery,
	useQueryClient
} from '@tanstack/react-query';
import {
	addStockToWatchlist,
	createWatchlist,
	getAllWatchlists,
	getWatchlistNames,
	removeStockFromWatchlist,
	removeWatchlist,
	renameWatchlist
} from '../services/WatchlistService';
import { DbWatchlist } from '../types/Watchlist';

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
	return useMutation<unknown, Error, RenameWatchlistParams>({
		mutationFn: ({ oldName, newName }) => renameWatchlist(oldName, newName),
		onSuccess: () => invalidateQueries(queryClient)
	});
};

type AddStockToWatchlistParams = {
	readonly watchlistName: string;
	readonly stockSymbol: string;
};

export const useAddStockToWatchlist = (onSuccess?: () => void) => {
	const queryClient = useQueryClient();
	return useMutation<DbWatchlist, Error, AddStockToWatchlistParams>({
		mutationFn: ({ watchlistName, stockSymbol }) =>
			addStockToWatchlist(watchlistName, stockSymbol),
		onSuccess: () => {
			invalidateQueries(queryClient);
			onSuccess?.();
		}
	});
};

type CreateWatchlistParams = {
	readonly watchlistName: string;
	readonly stockSymbol?: string;
};

export const useCreateWatchlist = (onSuccess?: () => void) => {
	const queryClient = useQueryClient();
	return useMutation<DbWatchlist, Error, CreateWatchlistParams>({
		mutationFn: ({ watchlistName, stockSymbol }) =>
			createWatchlist(watchlistName, stockSymbol),
		onSuccess: () => {
			invalidateQueries(queryClient);
			onSuccess?.();
		}
	});
};

export const useGetWatchlistNames = () =>
	useQuery({
		queryKey: [GET_WATCHLIST_NAMES_KEY],
		queryFn: getWatchlistNames
	});

type RemoveStockFromWatchlistParams = {
	readonly watchlistName: string;
	readonly stockSymbol: string;
};

export const useRemoveStockFromWatchlist = () => {
	const queryClient = useQueryClient();
	return useMutation<DbWatchlist, Error, RemoveStockFromWatchlistParams>({
		mutationFn: ({ watchlistName, stockSymbol }) =>
			removeStockFromWatchlist(watchlistName, stockSymbol),
		onSuccess: () => invalidateQueries(queryClient)
	});
};

type RemoveWatchlistParams = {
	readonly watchlistName: string;
};

export const useRemoveWatchlist = () => {
	const queryClient = useQueryClient();
	return useMutation<unknown, Error, RemoveWatchlistParams>({
		mutationFn: ({ watchlistName }) => removeWatchlist(watchlistName),
		onSuccess: () => invalidateQueries(queryClient)
	});
};
