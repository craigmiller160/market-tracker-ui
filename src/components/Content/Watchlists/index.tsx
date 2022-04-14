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

interface State {
	readonly watchlists: ReadonlyArray<Watchlist>;
}

const getTitleSpace = (breakpoints: Breakpoints): string | JSX.Element =>
	match(breakpoints)
		.with({ xs: true }, () => <br />)
		.otherwise(() => ' ');

const createPanels = (watchlists: ReadonlyArray<Watchlist>): ReactNode =>
	watchlists.map((watchlist) => (
		<Collapse.Panel
			key={watchlist._id}
			header={
				<Typography.Title level={4}>
					{watchlist.watchlistName}
				</Typography.Title>
			}
		>
			<h3>This is the Watchlist</h3>
		</Collapse.Panel>
	));

const createGetWatchlists = (setState: Updater<State>): TaskTryT<void> =>
	pipe(
		getAllWatchlists(),
		TaskEither.map((watchlists) =>
			setState((draft) => {
				draft.watchlists = castDraft(watchlists);
			})
		)
	);

export const Watchlists = () => {
	const [state, setState] = useImmer<State>({
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
	return (
		<div
			className={`WatchlistsPage ${breakpointName}`}
			data-testid="watchlist-page"
		>
			<Typography.Title>
				Investment{titleSpace}Watchlists
			</Typography.Title>
			<Collapse className="Accordion" accordion>
				{panels}
			</Collapse>
		</div>
	);
};
