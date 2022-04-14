import './Watchlists.scss';
import { Typography, Collapse } from 'antd';
import { ReactNode, useContext, useEffect } from 'react';
import { ScreenContext } from '../../ScreenContext';
import { match } from 'ts-pattern';
import { Breakpoints, getBreakpointName } from '../../utils/Breakpoints';
import { Watchlist } from '../../../types/Watchlist';
import { useImmer } from 'use-immer';
import { getAllWatchlists } from '../../../services/WatchlistService';
import { pipe } from 'fp-ts/es6/function';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import { castDraft } from 'immer';

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

export const Watchlists = () => {
	const [state, setState] = useImmer<State>({
		watchlists: []
	});

	useEffect(() => {
		pipe(
			getAllWatchlists(),
			TaskEither.map((watchlists) =>
				setState((draft) => {
					draft.watchlists = castDraft(watchlists);
				})
			)
		)();
	}, [setState]);

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
