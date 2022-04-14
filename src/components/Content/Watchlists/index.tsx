import './Watchlists.scss';
import { Typography } from 'antd';
import { useContext } from 'react';
import { ScreenContext } from '../../ScreenContext';
import { match } from 'ts-pattern';

const useTitleSpace = () => {
	const { breakpoints } = useContext(ScreenContext);
	return match(breakpoints)
		.with({ xs: true }, () => <br />)
		.otherwise(() => ' ');
};

export const Watchlists = () => {
	const titleSpace = useTitleSpace();
	return (
		<div className="WatchlistsPage" data-testid="watchlist-page">
			<Typography.Title>
				Investment{titleSpace}Watchlists
			</Typography.Title>
		</div>
	);
};
