import { Watchlist } from '../../../types/Watchlist';
import { Collapse, Typography } from 'antd';
import { WatchlistSection } from './WatchlistSection';
import './WatchlistPanel.scss';

const WatchlistPanelTitle = ({ watchlist }: { watchlist: Watchlist }) => {
	return (
		<Typography.Title className="PanelTitle" level={4}>
			{watchlist.watchlistName}
		</Typography.Title>
	);
};

export const createWatchlistPanel = (watchlist: Watchlist) => {
	return (
		<Collapse.Panel
			key={watchlist._id}
			className="WatchlistPanel"
			header={<WatchlistPanelTitle watchlist={watchlist} />}
		>
			<WatchlistSection
				stocks={watchlist.stocks}
				cryptos={watchlist.cryptos}
			/>
		</Collapse.Panel>
	);
};
