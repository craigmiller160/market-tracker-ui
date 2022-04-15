import './Watchlists.scss';
import { Collapse, Typography } from 'antd';
import { ReactNode, useContext, useEffect, useMemo } from 'react';
import { ScreenContext } from '../../ScreenContext';
import { match } from 'ts-pattern';
import { Breakpoints, getBreakpointName } from '../../utils/Breakpoints';
import { Watchlist } from '../../../types/Watchlist';
import { Updater, useImmer } from 'use-immer';
import { getAllWatchlists } from '../../../services/WatchlistService';
import { pipe } from 'fp-ts/es6/function';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import { castDraft } from 'immer';
import { TaskTryT } from '@craigmiller160/ts-functions/es/types';
import { Spinner } from '../../UI/Spinner';
import { RefreshProvider } from '../common/refresh/RefreshProvider';
import { createWatchlistPanel } from './createWatchlistPanel';

interface State {
	readonly loading: boolean;
	readonly watchlists: ReadonlyArray<Watchlist>;
}

const getTitleSpace = (breakpoints: Breakpoints): string | JSX.Element =>
	match(breakpoints)
		.with({ xs: true }, () => <br />)
		.otherwise(() => ' ');

const createPanels = (watchlists: ReadonlyArray<Watchlist>): ReactNode =>
	watchlists.map(createWatchlistPanel);

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

	const { breakpoints } = useContext(ScreenContext);
	const titleSpace = getTitleSpace(breakpoints);
	const breakpointName = getBreakpointName(breakpoints);
	const panels = createPanels(state.watchlists);

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
