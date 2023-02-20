import { useQuery } from '@tanstack/react-query';
import { getAllWatchlists } from '../services/WatchlistService';

export const GET_ALL_WATCHLISTS_KEY = 'WatchlistQueries_GetAllWatchlists';
export const RENAME_WATCHLIST_KEY = 'WatchlistQueries_RenameWatchlist';
export const ADD_STOCK_TO_WATCHLIST_KEY =
	'WatchlistQueries_AddStockToWatchlist';
export const CREATE_WATCHLIST_KEY = 'WatchlistQueries_CreateWatchlist';
export const GET_WATCHLIST_NAMES_KEY = 'WatchlistQueries_GetWatchlistNames';
export const REMOVE_STOCK_FROM_WATCHLIST_KEY =
	'WatchlistQueries_RemoveStockFromWatchlist';
export const REMOVE_WATCHLIST_KEY = 'WatchlistQueries_RemoveWatchlist';
export const useGetAllWatchlists = () =>
	useQuery({
		queryKey: [GET_ALL_WATCHLISTS_KEY],
		queryFn: getAllWatchlists
	});
