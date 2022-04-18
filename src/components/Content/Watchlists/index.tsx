import './Watchlists.scss';
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
import {
	createWatchlistPanel,
	WatchlistPanelConfig
} from './createWatchlistPanel';
import { ConfirmModal, ConfirmModalResult } from '../../UI/ConfirmModal';
import { InputModal } from '../../UI/InputModal';

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
				draft.confirmModal = {
					show: true,
					message: `Are you sure you want to remove watchlist "${foundWatchlist.watchlistName}"`,
					watchlistName: foundWatchlist.watchlistName
				};
			}
		});

const createHandleConfirmModalAction =
	(setState: Updater<State>, getWatchlists: TaskTryT<void>) =>
	(result: ConfirmModalResult, watchlistName: string, symbol?: string) => {
		if (ConfirmModalResult.OK === result) {
			setState((draft) => {
				draft.confirmModal.show = false;
				draft.loading = true;
			});
			const action = symbol
				? removeStockFromWatchlist(watchlistName, symbol)
				: removeWatchlist(watchlistName);
			pipe(
				action,
				TaskEither.chain(() => getWatchlists)
			)();
		} else {
			setState((draft) => {
				draft.confirmModal.show = false;
			});
		}
	};

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

const createShowAddWatchlistModal = (setState: Updater<State>) => () =>
	setState((draft) => {
		draft.inputModal.show = true;
	});

const createHandleAddWatchlistResult =
	(setState: Updater<State>, getWatchlists: TaskTryT<void>) =>
	(value?: string) => {
		setState((draft) => {
			draft.inputModal.show = false;
		});
		if (value) {
			pipe(
				createWatchlist(value),
				TaskEither.chain(() => getWatchlists)
			)();
		}
	};

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
		() => createHandleConfirmModalAction(setState, getWatchlists),
		[setState, getWatchlists]
	);
	const showConfirmRemoveStock = useMemo(
		() => createShowConfirmRemoveStock(setState),
		[setState]
	);
	const showAddWatchlistModal = useMemo(
		() => createShowAddWatchlistModal(setState),
		[setState]
	);
	const handleAddWatchlistResult = useMemo(
		() => createHandleAddWatchlistResult(setState, getWatchlists),
		[setState, getWatchlists]
	);

	const { breakpoints } = useContext(ScreenContext);
	const titleSpace = getTitleSpace(breakpoints);
	const breakpointName = getBreakpointName(breakpoints);
	const panelConfig: WatchlistPanelConfig = {
		breakpoints,
		renameWatchlistId: state.renameWatchlistId,
		onRenameWatchlist,
		onSaveRenamedWatchlist,
		onRemoveWatchlist: showConfirmRemoveWatchlist,
		onRemoveStock: showConfirmRemoveStock
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
				<div className="RootActions">
					<Button onClick={showAddWatchlistModal}>Add</Button>
				</div>
				{body}
			</div>
			<ConfirmModal
				title="Remove"
				show={state.confirmModal.show}
				message={state.confirmModal.message}
				onClose={(result) =>
					handleConfirmModalAction(
						result,
						state.confirmModal.watchlistName,
						state.confirmModal.symbol
					)
				}
			/>
			<InputModal
				title="Add Watchlist"
				show={state.inputModal.show}
				label="Name"
				onClose={handleAddWatchlistResult}
			/>
		</RefreshProvider>
	);
};
