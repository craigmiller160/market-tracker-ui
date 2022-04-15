import { Watchlist } from '../../../types/Watchlist';
import { Collapse, Typography } from 'antd';
import { WatchlistSection } from './WatchlistSection';
import './WatchlistPanel.scss';

const createTitle = (watchlist: Watchlist) => {
	return (
		<Typography.Title className="PanelTitle" level={4}>
			{watchlist.watchlistName}
		</Typography.Title>
	);
};

export const createWatchlistPanel = (watchlist: Watchlist) => {
	const title = createTitle(watchlist);
	return (
		<Collapse.Panel
			key={watchlist._id}
			className="WatchlistPanel"
			header={title}
		>
			<WatchlistSection
				stocks={watchlist.stocks}
				cryptos={watchlist.cryptos}
			/>
		</Collapse.Panel>
	);
};
