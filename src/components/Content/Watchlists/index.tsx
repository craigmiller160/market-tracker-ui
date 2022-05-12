import { Updater, useImmer } from 'use-immer';
import { DbWatchlist } from '../../../types/Watchlist';
import { Breakpoints, getBreakpointName } from '../../utils/Breakpoints';
import { match } from 'ts-pattern';
import './Watchlists.scss';
import { useContext, useMemo } from 'react';
import { ScreenContext } from '../../ScreenContext';
import { Spinner } from '../../UI/Spinner';
import { Button, Collapse, Typography } from 'antd';
import { Accordion } from '../../UI/Accordion';
import { RefreshProvider } from '../common/refresh/RefreshProvider';
import { ConfirmModal, ConfirmModalResult } from '../../UI/ConfirmModal';
import { InputModal } from '../../UI/InputModal';
import { TaskTryT } from '@craigmiller160/ts-functions/es/types';
import {
	createWatchlist,
	getAllWatchlists,
	removeStockFromWatchlist,
	removeWatchlist
} from '../../../services/WatchlistService';
import { pipe } from 'fp-ts/es6/function';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import { castDraft } from 'immer';

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

const getTitleSpace = (breakpoints: Breakpoints): string | JSX.Element =>
	match(breakpoints)
		.with({ xs: true }, () => <br />)
		.otherwise(() => ' ');

const createShowAddWatchlistModal = (setState: Updater<State>) => () =>
	setState((draft) => {
		draft.inputModal.show = true;
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

	const showAddWatchlistModal = useMemo(
		() => createShowAddWatchlistModal(setState),
		[setState]
	);
	const handleConfirmModalAction = useMemo(
		() => createHandleConfirmModalAction(setState, getWatchlists),
		[setState, getWatchlists]
	);
	const handleAddWatchlistResult = useMemo(
		() => createHandleAddWatchlistResult(setState, getWatchlists),
		[setState, getWatchlists]
	);

	const { breakpoints } = useContext(ScreenContext);
	const titleSpace = getTitleSpace(breakpoints);
	const breakpointName = getBreakpointName(breakpoints);

	const body = match(state)
		.with({ loading: true }, () => <Spinner />)
		.otherwise(() => <Accordion panels={[]} />);

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
