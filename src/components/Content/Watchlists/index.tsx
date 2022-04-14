import './Watchlists.scss';
import { Typography, Collapse } from 'antd';
import { useContext } from 'react';
import { ScreenContext } from '../../ScreenContext';
import { match } from 'ts-pattern';
import { Breakpoints, getBreakpointName } from '../../utils/Breakpoints';

const getTitleSpace = (breakpoints: Breakpoints): string | JSX.Element =>
	match(breakpoints)
		.with({ xs: true }, () => <br />)
		.otherwise(() => ' ');

export const Watchlists = () => {
	const { breakpoints } = useContext(ScreenContext);
	const titleSpace = getTitleSpace(breakpoints);
	const breakpointName = getBreakpointName(breakpoints);
	return (
		<div
			className={`WatchlistsPage ${breakpointName}`}
			data-testid="watchlist-page"
		>
			<Typography.Title>
				Investment{titleSpace}Watchlists
			</Typography.Title>
			<Collapse className="Accordion" accordion>
				<Collapse.Panel key="1" header="Panel 1">
					<p>This is Panel 1</p>
				</Collapse.Panel>
				<Collapse.Panel key="2" header="Panel 2">
					<p>This is Panel 2</p>
				</Collapse.Panel>
			</Collapse>
		</div>
	);
};
