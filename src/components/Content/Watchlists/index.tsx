import './Watchlists.scss';
import { Collapse, Typography } from 'antd';
import { ReactNode, useContext, useEffect, useMemo } from 'react';
import { ScreenContext } from '../../ScreenContext';
import { match } from 'ts-pattern';
import { Breakpoints, getBreakpointName } from '../../utils/Breakpoints';
import { DbWatchlist } from '../../../types/Watchlist';
import { Updater, useImmer } from 'use-immer';
import {
	getAllWatchlists,
	removeWatchlist,
	renameWatchlist
} from '../../../services/WatchlistService';
import { pipe } from 'fp-ts/es6/function';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import { castDraft } from 'immer';
import { TaskTryT } from '@craigmiller160/ts-functions/es/types';
import { Spinner } from '../../UI/Spinner';
import { RefreshProvider } from '../common/refresh/RefreshProvider';
import {
	createWatchlistPanel,
	WatchlistPanelConfig
} from './createWatchlistPanel';
import { watch } from 'vite/types/chokidar';
import { ConfirmModal, ConfirmModalResult } from '../../UI/ConfirmModal';

interface State {
	readonly loading: boolean;
	readonly watchlists: ReadonlyArray<DbWatchlist>;
	readonly renameWatchlistId?: string;
	readonly showConfirmModal: boolean;
	readonly confirmModalMessage: string;
	readonly confirmModalWatchlistId?: string;
}

const getTitleSpace = (breakpoints: Breakpoints): string | JSX.Element =>
	match(breakpoints)
		.with({ xs: true }, () => <br />)
		.otherwise(() => ' ');

const createPanels = (
	watchlists: ReadonlyArray<DbWatchlist>,
	panelConfig: WatchlistPanelConfig
): ReactNode => watchlists.map(createWatchlistPanel(panelConfig));

const createGetWatchlists = (setState: Updater<State>): TaskTryT<void> =>
	pipe(
		getAllWatchlists(),
		TaskEither.map((watchlists) =>
			setState((draft) => {
				draft.watchlists = castDraft(watchlists);
				draft.loading = false;
			})
		)
	);

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
				draft.showConfirmModal = true;
				draft.confirmModalWatchlistId = id;
				draft.confirmModalMessage = `Are you sure you want to remove watchlist "${foundWatchlist.watchlistName}"`;
			}
		});

const createHandleConfirmModalAction =
	(setState: Updater<State>, getWatchlists: TaskTryT<void>) =>
	(result: ConfirmModalResult) => {
		if (ConfirmModalResult.OK === result) {
			setState((draft) => {
				draft.showConfirmModal = false;
				draft.loading = true;
			});
			// TODO how to get watchlistName
			pipe(
				removeWatchlist(''),
				TaskEither.chain(() => getWatchlists)
			);
		}
	};

export const Watchlists = () => {
	const [state, setState] = useImmer<State>({
		loading: true,
		watchlists: [],
		showConfirmModal: false,
		confirmModalMessage: ''
	});

	const getWatchlists = useMemo(
		() => createGetWatchlists(setState),
		[setState]
	);

	useEffect(() => {
		getWatchlists();
	}, [getWatchlists]);

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
	const handleConfirmModalAction = useMemo(
		() => createHandleConfirmModalAction(setState),
		[setState]
	);

	const { breakpoints } = useContext(ScreenContext);
	const titleSpace = getTitleSpace(breakpoints);
	const breakpointName = getBreakpointName(breakpoints);
	const panelConfig: WatchlistPanelConfig = {
		breakpoints,
		renameWatchlistId: state.renameWatchlistId,
		onRenameWatchlist,
		onSaveRenamedWatchlist,
		onRemoveWatchlist: showConfirmRemoveWatchlist
	};
	const panels = createPanels(state.watchlists, panelConfig);

	const body = match(state)
		.with({ loading: true }, () => <Spinner />)
		.otherwise(() => (
			<Collapse className="Accordion" accordion destroyInactivePanel>
				{panels}
			</Collapse>
		));

	return (
		<RefreshProvider>
			<div
				className={`WatchlistsPage ${breakpointName}`}
				data-testid="watchlist-page"
			>
				<Typography.Title>
					Investment{titleSpace}Watchlists
				</Typography.Title>
				{body}
			</div>
			<ConfirmModal
				show={state.showConfirmModal}
				message={state.confirmModalMessage}
				onClose={handleConfirmModalAction}
			/>
		</RefreshProvider>
	);
};
