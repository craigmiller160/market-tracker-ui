import './Watchlists.scss';
import { Typography } from 'antd';
import { useContext } from 'react';
import { ScreenContext } from '../../ScreenContext';
import { match } from 'ts-pattern';

export const Watchlists = () => {
	const { breakpoints } = useContext(ScreenContext);
	const space = match(breakpoints)
		.with({ xs: true }, () => <br />)
		.otherwise(() => ' ');
	return (
		<div className="WatchlistsPage" data-testid="watchlist-page">
			<Typography.Title>Investment{space}Watchlists</Typography.Title>
		</div>
	);
};
