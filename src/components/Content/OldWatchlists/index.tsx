
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









export const Watchlists = () => {








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
