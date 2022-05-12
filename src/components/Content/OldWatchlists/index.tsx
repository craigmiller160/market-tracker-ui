
import { Button, Collapse, Typography } from 'antd';
import { ReactNode, useContext, useEffect, useMemo } from 'react';
import { ScreenContext } from '../../ScreenContext';
import { match } from 'ts-pattern';
import { Breakpoints, getBreakpointName } from '../../utils/Breakpoints';
import { DbWatchlist } from '../../../types/Watchlist';
import { Updater, useImmer } from 'use-immer';
import {
	createWatchlist,
	getAllWatchlists,
	removeStockFromWatchlist,
	removeWatchlist,
	renameWatchlist
} from '../../../services/WatchlistService';
import { pipe } from 'fp-ts/es6/function';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import { castDraft } from 'immer';
import { TaskTryT } from '@craigmiller160/ts-functions/es/types';
import { Spinner } from '../../UI/Spinner';
import { RefreshProvider } from '../common/refresh/RefreshProvider';
import { WatchlistPanel, WatchlistPanelConfig } from './WatchlistPanel';
import { ConfirmModal, ConfirmModalResult } from '../../UI/ConfirmModal';
import { InputModal } from '../../UI/InputModal';



const createPanels = (
	watchlists: ReadonlyArray<DbWatchlist>,
	panelConfig: WatchlistPanelConfig
): ReactNode =>
	watchlists.map((watchlist) => (
		<WatchlistPanel
			key={watchlist._id}
			{...panelConfig}
			watchlist={watchlist}
		/>
	));



const createOnRenameWatchlist = (setState: Updater<State>) => (id?: string) =>
	setState((draft) => {
		draft.renameWatchlistId = id;
	});

const createOnSaveRenamedWatchlist =
	(setState: Updater<State>) => (id: string, newName: string) =>
		setState((draft) => {
			const watchlistToChangeIndex = draft.watchlists.findIndex(
				(watchlist) => watchlist._id === id
			);
			const watchlistToChange = draft.watchlists[watchlistToChangeIndex];
			const oldName = watchlistToChange.watchlistName;
			draft.renameWatchlistId = undefined;
			draft.watchlists[watchlistToChangeIndex] = castDraft({
				...watchlistToChange,
				watchlistName: newName
			});
			renameWatchlist(oldName, newName)();
		});

const createShowConfirmRemoveWatchlist =
	(setState: Updater<State>) => (id: string) =>
		setState((draft) => {
			const foundWatchlist = draft.watchlists.find(
				(watchlist) => watchlist._id === id
			);
			if (foundWatchlist) {
				draft.confirmModal = {
					show: true,
					message: `Are you sure you want to remove watchlist "${foundWatchlist.watchlistName}"`,
					watchlistName: foundWatchlist.watchlistName
				};
			}
		});



const createShowConfirmRemoveStock =
	(setState: Updater<State>) => (watchlistId: string, symbol: string) =>
		setState((draft) => {
			const watchlistName = draft.watchlists.find(
				(watchlist) => watchlist._id === watchlistId
			)?.watchlistName;
			if (!watchlistName) {
				return;
			}
			draft.confirmModal = {
				show: true,
				watchlistName,
				symbol,
				message: `Are you sure you want to remove "${symbol}" from watchlist "${watchlistName}"`
			};
		});





export const Watchlists = () => {





	const onRenameWatchlist = useMemo(
		() => createOnRenameWatchlist(setState),
		[setState]
	);
	const onSaveRenamedWatchlist = useMemo(
		() => createOnSaveRenamedWatchlist(setState),
		[setState]
	);
	const showConfirmRemoveWatchlist = useMemo(
		() => createShowConfirmRemoveWatchlist(setState),
		[setState]
	);

	const showConfirmRemoveStock = useMemo(
		() => createShowConfirmRemoveStock(setState),
		[setState]
	);


	const panelConfig: WatchlistPanelConfig = {
		breakpoints,
		renameWatchlistId: state.renameWatchlistId,
		onRenameWatchlist,
		onSaveRenamedWatchlist,
		onRemoveWatchlist: showConfirmRemoveWatchlist,
		onRemoveStock: showConfirmRemoveStock
	};
	const panels = createPanels(state.watchlists, panelConfig);

	return (
		<RefreshProvider>

		</RefreshProvider>
	);
};
