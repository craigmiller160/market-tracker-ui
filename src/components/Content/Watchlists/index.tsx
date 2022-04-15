import './Watchlists.scss';
import { Collapse, Typography } from 'antd';
import { ReactNode, useContext, useEffect, useMemo } from 'react';
import { ScreenContext } from '../../ScreenContext';
import { match } from 'ts-pattern';
import { Breakpoints, getBreakpointName } from '../../utils/Breakpoints';
import { Watchlist } from '../../../types/Watchlist';
import { Updater, useImmer } from 'use-immer';
import {
	getAllWatchlists,
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

interface State {
	readonly loading: boolean;
	readonly watchlists: ReadonlyArray<Watchlist>;
	readonly renameWatchlistId?: string;
}

const getTitleSpace = (breakpoints: Breakpoints): string | JSX.Element =>
	match(breakpoints)
		.with({ xs: true }, () => <br />)
		.otherwise(() => ' ');

const createPanels = (
	watchlists: ReadonlyArray<Watchlist>,
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

export const Watchlists = () => {
	const [state, setState] = useImmer<State>({
		loading: true,
		watchlists: []
	});

	const getWatchlists = useMemo(
		() => createGetWatchlists(setState),
		[setState]
	);

	useEffect(() => {
		getWatchlists();
	}, [getWatchlists]);

	// TODO move outside of component
	const onRenameWatchlist = (id?: string) => {
		setState((draft) => {
			draft.renameWatchlistId = id;
		});
	};
	const onSaveRenamedWatchlist = (id: string, newName: string) => {
		const watchlistToChangeIndex = state.watchlists.findIndex(
			(watchlist) => watchlist._id === id
		);
		const watchlistToChange = state.watchlists[watchlistToChangeIndex];
		const oldName = watchlistToChange.watchlistName;
		setState((draft) => {
			draft.renameWatchlistId = undefined;
			draft.watchlists[watchlistToChangeIndex] = castDraft({
				...watchlistToChange,
				watchlistName: newName
			});
		});
		renameWatchlist(oldName, newName);
	};

	const { breakpoints } = useContext(ScreenContext);
	const titleSpace = getTitleSpace(breakpoints);
	const breakpointName = getBreakpointName(breakpoints);
	const panelConfig: WatchlistPanelConfig = {
		renameWatchlistId: state.renameWatchlistId,
		onRenameWatchlist,
		onSaveRenamedWatchlist
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
		</RefreshProvider>
	);
};
